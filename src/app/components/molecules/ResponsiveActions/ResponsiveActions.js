// @flow
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from 'app/components/atoms/Icon/Icon';
import PopupMenu from 'app/components/molecules/PopupMenu/PopupMenu';

const ResponsiveActionsStyled = styled.div`
    & i {
        margin-left: .6rem;
    }
    & .dropdownActions {
        display: none;
    }
    @media(max-width: ${({ theme }) => theme.media.md} ) {
        & > i, & > a {
            display: none;
        }
        & .dropdownActions {
            display: inherit;
        }
        & .dropdownActions > div {
            text-align: right;
        }
        & .dropdownActions > div > a {
            width: 24px;
            display: inline-block;
        }
    }
`;

const ResponsiveActions = (props: Object) => {
    const { actions } = props;
    return (
        <ResponsiveActionsStyled>
            {actions}
            <PopupMenu content={actions} className="dropdownActions">
                <Icon name="dots-vertical" />
            </PopupMenu>
        </ResponsiveActionsStyled>
    );
};

ResponsiveActions.propTypes = {
    actions: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default ResponsiveActions;
