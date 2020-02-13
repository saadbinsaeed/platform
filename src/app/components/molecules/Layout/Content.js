// LIBRARY IMPORTS
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChildrenProp } from 'app/utils/propTypes/common';
// UI IMPORTS

// STYLE IMPORTS
const ContentWrapper = styled.article`
   grid-area: content;
   display: grid;
   grid-template-areas: "actions"
                         "main";
   grid-template-rows: auto 1fr;
`;

const ContentActions = styled.div`
  grid-area: actions;
`;

const ContentInner = styled.div`
    padding: ${({ noPadding }) => noPadding ? 0 : '0 1rem 1rem 1rem;' };
    overflow: auto;
    grid-area: main;
`;


const Content = (props) => {
    return (
        <ContentWrapper {...props} className="LayoutContent">
            {props.header && props.showToggle && <ContentActions> {props.header} </ContentActions>}
            <ContentInner {...props} className="ContentInner">
                {props.children}
            </ContentInner>
        </ContentWrapper>
    );
};

Content.propTypes = {
    children: ChildrenProp,
    header: ChildrenProp,
    showToggle: PropTypes.bool,
};

export default Content;
