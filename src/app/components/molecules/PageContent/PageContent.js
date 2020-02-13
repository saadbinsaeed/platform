import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PageContentStyle = styled.section`
    // background: rgba(255, 0, 0, 0.1);
    grid-area: content;
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas: "pTabs"
                         "pActions"
                         "pContent"
                         "pFooter";
    position: relative;
    ${ ( { overflowHidden } ) => overflowHidden ? 'overflow: hidden' : 'overflow: auto' };
`;
/**
 * Our container that holds all page content
 */
class PageContent extends PureComponent<Object, Object> {
    /**
   * Render our page content with the correct height
   */
    render() {
        const { overflowHidden, style } = this.props;
        return (
            <PageContentStyle className={'page-content'} overflowHidden={overflowHidden} style={style}>
                {this.props.children}
            </PageContentStyle>
        );
    }
}

PageContent.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    overflowHidden: PropTypes.bool
};


export default PageContent;
