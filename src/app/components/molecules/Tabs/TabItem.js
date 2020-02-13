import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import styled from 'styled-components';

const TabItemStyle = styled.div`
    display: inline-block;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    min-width: 100px;
    max-width: 200px;
    padding: .8rem 2rem;
    bottom: 0;
    color: ${ ( { theme } ) => theme.color.white };
    opacity: 0.7;
    & a {
        display: block;
        color: ${ ( { theme } ) => theme.color.white };
    }
    &.active {
        background: ${ ( { theme } ) => `linear-gradient(to bottom, transparent 0%, transparent 92%, ${theme.color.white} 92%, ${theme.color.white} 100%)` };
        @media(min-width: ${({ theme }) => theme.media.sm}) {
             background: ${ ( { theme } ) => `linear-gradient(to bottom, transparent 0%, transparent 95%, ${theme.color.white} 95%, ${theme.color.white} 100%)` };
        }
        font-weight: 500;
        opacity: 1;
    }
`;

const TabLink = styled(Link)`
    display: inline-block;
    color: ${ ( { theme } ) => theme.base.textColor };
`;

/**
 * Tab Item component
 */
class TabItem extends Component<Object, Object> {

    /**
     * Call parent function
     */
    setActive = () => {
        this.props.selectTab && this.props.selectTab();
    };
    /**
     * Render our tab item
     */
    render() {
        const { label, to, activeOnlyWhenExact } = this.props;
        return (
            <Route
            // eslint-disable-next-line react/no-children-prop
                path={to} exact={activeOnlyWhenExact} children={({ match }) => {
                    if(match) {
                        setTimeout(this.props.selectTab, 300);
                    }
                    return (
                        <TabLink to={to}>
                            <TabItemStyle className={match ? 'active' : ''} onClick={this.setActive} innerRef={(el) => { this.props.register && this.props.register(el); }} {...this.props}>
                                { label }
                            </TabItemStyle>
                        </TabLink>
                    );
                }}
            />
        );
    }
}

TabItem.propTypes = {
    label: PropTypes.string,
    to: PropTypes.any.isRequired,
    activeOnlyWhenExact: PropTypes.bool,
    selectTab: PropTypes.func,
    register: PropTypes.func,
};

export default TabItem;
