// @flow

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import debouncePromise from 'debounce-promise';
import styled from 'styled-components';

import Alert from 'app/components/molecules/Alert/Alert';
import VirtualList from 'app/components/molecules/VirtualList/VirtualList';
import Loader from 'app/components/atoms/Loader/Loader';
import Container from 'app/components/atoms/Container/Container';

const TitleContainer = styled(Container)`
background: ${({ theme }) => theme.color.background};
position: relative;
width: 100%;
margin-bottom: -1rem;
z-index: 1;

font-size: .7rem;
padding: .5rem 4.5rem;
font-weight: 500;
`;

/**
 *
 */
class VirtualListManaged extends PureComponent<Object, Object> {

    static propTypes = {
        renderComponent: PropTypes.func.isRequired,
        itemSize: PropTypes.number.isRequired,
        itemCount: PropTypes.number.isRequired,
        loadData: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        startIndex: PropTypes.number.isRequired,
        filterBy: PropTypes.arrayOf(PropTypes.object),
        orderBy: PropTypes.arrayOf(PropTypes.object),
        list: PropTypes.arrayOf(PropTypes.object),
        maxWidth: PropTypes.string,
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    };

    state = { list: [], firstLoading: true, key: 0, forceUpdateKey: 0 };
    requestedIndexes: Set<number> = new Set();
    unmounted = false;
    virtualListStyle = { paddingTop: '2rem'};
    prevStartIndex = -1;
    prevStopIndex = -1;

    componentDidMount() {
        this.loadData().finally(() => !this.unmounted && this.setState({ firstLoading: false }));
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    componentDidUpdate(prevProps: Object) {
        const { list, startIndex, orderBy, filterBy } = this.props;

        if (list && prevProps.list !== list) {
            this.addItems(startIndex, list);
        }

        if (orderBy !== prevProps.orderBy || filterBy !== prevProps.filterBy) {
            this.resetView({ orderBy, filterBy });
        }
    }

    addItems(startIndex: number, list: Object[]) {
        const next = [ ...this.state.list ];
        (list || []).forEach((item, index) => next[(startIndex || 0) + index] = item);
        const uniqueList = next.filter(Boolean).filter((item, index, self) => self.findIndex(t => t.id === item.id) === index);
        this.setState({ list: uniqueList, forceUpdateKey: this.state.forceUpdateKey + 1 });
    }

    resetView = (stateConfiguration: ?Object) => {
        this.requestedIndexes = new Set();
        this.prevStartIndex = -1;
        this.prevStopIndex = -1;
        this.setState({
            ...(stateConfiguration || {}),
            list: [],
            key: this.state.key + 1
        }, this.loadData);
    }

    /** Load more rows on scroll down **/
    loadMoreRows = ({ startIndex, stopIndex }: Object) => this.loadData({ startIndex, stopIndex });

    /** We call the loadData function attached to the filtersView **/
    loadData = debouncePromise((options: ?Object) => {
        const { filterBy, orderBy } = this.props;
        let { startIndex: start, stopIndex: stop  } = options || {};
        start = start || 0;
        if (start >= 15) { // we need to preload the 'page before'
            start -= 15;
        }
        stop = stop || 30;
        if ((stop - start) < 30) { // we need to preload at least 30 elements
            stop = start + 30;
        }

        while (start < stop && this.requestedIndexes.has(start)) {
            ++start;
        }
        while (stop > start && this.requestedIndexes.has(stop)) {
            --stop;
        }
        if (start === stop) {
            return Promise.resolve();
        }
        if (this.prevStartIndex === start && this.prevStopIndex === stop) {
            return Promise.resolve();
        }

        const promise = this.props.loadData({ startIndex: start, stopIndex: stop, filterBy, orderBy });
        const isPromise = promise instanceof Promise;
        if (!isPromise) {
            throw new Error('The loadData function MUST return a Promise.');
        }
        for (let i = start; i < stop; ++i) {
            this.requestedIndexes.add(i);
        }
        this.prevStartIndex = start;
        this.prevStopIndex = stop;
        return promise;
    }, 400);

    showNoResult = () => {
        const { isLoading, title, itemCount = 0 } = this.props;
        return !this.state.firstLoading
            && !isLoading
            && !itemCount
            && !title
            && <Alert type='background' margin={16}>No results</Alert>;
    };

    forceUpdate = () => this.setState({ forceUpdateKey: this.state.forceUpdateKey + 1 });

    render() {
        const { itemSize, itemCount, isLoading, maxWidth, title, renderComponent } = this.props;
        const { list, key, forceUpdateKey }= this.state;
        const maxTitleWidth = Number(maxWidth) + 50;
        return (
            <Fragment>
                {this.state.firstLoading && isLoading && <Loader absolute />}
                {this.showNoResult()}
                {title && <TitleContainer width={String(maxTitleWidth)}>{title}</TitleContainer>}
                <VirtualList
                    key={key}
                    forceupdate={forceUpdateKey}
                    onItemsRendered={this.loadMoreRows}
                    width={maxWidth}
                    itemSize={itemSize}
                    itemCount={itemCount}
                    renderItem={({ index, style, resize }) =>
                        list[index] ? renderComponent({ style, index, resize, data: list[index], itemSize })
                            : (<div style={style} key={index}><Loader key={index} /></div>)
                    }
                    style={this.virtualListStyle}
                />
            </Fragment>
        );
    }
};

export default VirtualListManaged;
