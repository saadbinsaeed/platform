/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TinyVirtualList from 'react-tiny-virtual-list';
import styled from 'styled-components';

import { getNum } from 'app/utils/utils';

const { height, ...TinyVirtualListProps } = TinyVirtualList.propTypes; // eslint-disable-line react/forbid-foreign-prop-types

const TinyVirtualListStyled = styled(TinyVirtualList)`
    max-height: 100%;
`;

/**
 * A TinyVirtualList that takes 100% height.
 */
class VirtualList extends PureComponent<Object, Object> {

    static propTypes = {
        ...TinyVirtualListProps,
        listRef: PropTypes.object,
        className: PropTypes.string,
    }

    rowsHeights: Array<number> = [];

    // $FlowFixMe
    tinyVirtualListRef = React.createRef();

    state = { height: 0, rowsHeights: [] };

    componentDidMount() {
        window.addEventListener('resize', this.updateHeight);
        window.addEventListener('transitionend', this.updateHeight);
        this.updateHeight();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateHeight);
        window.removeEventListener('transitionend', this.updateHeight);
    }

    componentDidUpdate(prevProps: Object) {
        const { itemCount } = this.props;
        if(itemCount !== prevProps.itemCount) {
            this.updateHeight();
        }
    }

    updateHeight = () => {
        const parentHeight = getNum(this.tinyVirtualListRef, 'current.rootNode.parentNode.clientHeight') || 0;
        if (this.state.height !== parentHeight) {
            this.setState({ height: parentHeight });
        }
    };

    resize = (index: number, height: number) => {
        const rowHeight = this.rowsHeights[index] || this.props.itemSize;
        if (rowHeight !== (height || this.props.itemSize)) {
            this.rowsHeights[index] = height || this.props.itemSize;
            this.setState({ rowsHeights: this.rowsHeights }, () => {
                const ref = this.tinyVirtualListRef.current;
                ref && ref.recomputeSizes(index);
                ref && ref.forceUpdate();
            });
        }
    }

    renderItem = ({ index, style }: Object) =>
        this.props.renderItem({index, style, resize: this.resize});

    getRowHeight = (index: number) => this.state.rowsHeights[index] || this.props.itemSize;

    getItemSize = (itemSize: any) => {
        if (typeof itemSize === 'number') {
            return this.getRowHeight;
        } else {
            return itemSize;
        }
    }

    render() {
        const { className, ...tinyVirtualListOptions } = this.props;
        const itemSize = this.getItemSize(this.props.itemSize);
        return (
            <TinyVirtualListStyled
                {...tinyVirtualListOptions}
                innerRef={this.tinyVirtualListRef}
                height={this.state.height}
                renderItem={this.renderItem}
                itemSize={itemSize}
                className={className}
            />
        );
    }

}

export default VirtualList;
