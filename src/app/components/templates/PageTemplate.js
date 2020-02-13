/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setHeader } from 'store/actions/app/appActions';
import { ChildrenProp } from 'app/utils/propTypes/common';
import PageContent from 'app/components/molecules/PageContent/PageContent';
import ErrorBoundary from 'app/components/atoms/ErrorBoundary/ErrorBoundary';
import { deepEquals } from 'app/utils/utils';

/**
 * Layout that controls the page
 */
class PageTemplate extends PureComponent<Object, Object> {

    static propTypes = {
        title: PropTypes.string,
        subTitle: PropTypes.string,
        info: PropTypes.array,
        color: PropTypes.object,
        // app: PropTypes.object,
        overflowHidden: PropTypes.bool,
        children: ChildrenProp,
        setHeader: PropTypes.func,
    };

    /**
     * Try push to store onMount
     */
    componentDidMount() {
        this.setHeaderProps(this.props);
    }

    /**
     * Update state when changes are pushed
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        const { title, subTitle, info, menuItems, color } = this.props;
        if (
            prevProps.title !== title
            || prevProps.subTitle !== subTitle
            || !deepEquals(prevProps.info, info)
            || prevProps.menuItems !== menuItems
            || prevProps.color !== color
        ) {
            this.setHeaderProps(this.props);
        }
    }

    /**
     * Update our headers func
     */
    setHeaderProps = (props) => {
        const { title, subTitle, info, pillText, actions, menuItems, color } = props;
        const Headers = {
            title: title || '',
            subTitle: subTitle || '',
            headerInfo: info || [],
            pillText: pillText || '',
            actions: actions || '',
            menuItems: menuItems || '',
            color: color || {},
        };
        this.props.setHeader(Headers);
    };

    /**
     * Render our page template
     */
    render() {
        // console.log('PageTemplateProps', this.props);
        const { overflowHidden, children } = this.props;
        return (
            <ErrorBoundary>
                <PageContent overflowHidden={overflowHidden}>
                    {children}
                </PageContent>
            </ErrorBoundary>
        );
    }
}

export default connect(null, { setHeader })(PageTemplate);
