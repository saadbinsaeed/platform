/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Bar from 'app/components/atoms/Bar/Bar';
import { ChildrenProp } from 'app/utils/propTypes/common';

const ActionBarStyle = styled(Bar)`
    grid-area: pActions;
    font-size: inherit;
    align-items: ${({ alignItems }) => alignItems || 'center'};
    ${ ({ theme, marginBottom }) => marginBottom ? `margin-bottom: ${ theme.base.padding }` : '' };
    ${ ({ theme, borderBottom }) => borderBottom ? `border-bottom: 1px solid ${ theme.base.borderColor }` : '' };
    ${ ( { wrap } ) => wrap ? 'flex-wrap: wrap' : '' };
`;

const ActionBarColumn = styled.div`
        display: flex;
        ${({ leftStretch }) => leftStretch ? 'flex-grow: 1' : ''};
    `;

const ActionBarLeft = styled(ActionBarColumn)`
        flex-grow: 1;
        justify-content: flex-start;
        text-align: left;
        padding-right: .5rem;
    `;

const ActionBarCenter = styled(ActionBarColumn)`
        flex-grow: 1;
        justify-content: center;
        text-align: center;
    `;

const ActionBarRight = styled(ActionBarColumn)`
        ${({ rightShrink }) => rightShrink ? 'flex-grow: 0' : 'flex-grow: 1'};
        justify-content: flex-end;
        text-align: right;
        margin-left: 0;
    `;

const ActionBar = (props: Object) => {
    const { alignItems, wrap, left, center, right, marginBottom, scrollable, leftStretch, rightShrink, borderBottom } = props;
    return (
        <ActionBarStyle wrap={wrap} alignItems={alignItems} marginBottom={marginBottom} borderBottom={borderBottom} scrollable={scrollable}>
            {left && <ActionBarLeft leftStretch={leftStretch}>{left}</ActionBarLeft> }
            {center && <ActionBarCenter>{center}</ActionBarCenter> }
            {right && <ActionBarRight rightShrink={rightShrink}>{right}</ActionBarRight> }
        </ActionBarStyle>
    );
};

ActionBar.propTypes = {
    marginBottom: PropTypes.bool,
    borderBottom: PropTypes.bool,
    rightShrink: PropTypes.bool,
    scrollable: PropTypes.bool,
    left: ChildrenProp,
    center: ChildrenProp,
    right: ChildrenProp
};

ActionBar.defaultProps = {
    borderBottom: true,
};

export default ActionBar;
