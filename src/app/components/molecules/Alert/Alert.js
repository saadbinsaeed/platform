/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const AlertStyle = styled.div`
    font-size: .9rem;
    text-align: center;
    padding: 0.6rem;
    & a {
      color: white;
    }
    border-radius: .3rem;
    margin: ${({margin}) => margin ? `${margin}px` : 0};
    background: ${({ theme, type }) => theme && type ? theme.color[type] : theme.color.info};
`;
/**
 * Show an inline alert. Good for on-page validation
 */
class Alert extends Component<Object, Object> {
    state = {
        visible: Boolean
    };
    /**
     * Set our initial state
     * @param props
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            visible: true
        };
    }

    onDismiss = () => {
        this.setState(
            {
                visible: false
            }
        );
    };

    /**
     * Render our alert component
     */
    render() {
        return (
            <AlertStyle type={this.props.type} margin={this.props.margin} isOpen={this.state.visible} toggle={this.onDismiss}>
                {this.props.children}
            </AlertStyle>
        );
    }
}

Alert.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    type: PropTypes.string,
    margin: PropTypes.number
};

export default Alert;
