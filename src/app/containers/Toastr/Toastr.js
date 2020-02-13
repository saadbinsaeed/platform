/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Growl } from 'primereact/components/growl/Growl';

const ToastrStyle = styled.span`
    p {
        font-weight: bold !important;
    }
    .ui-growl {
        z-index: 99999 !important;
    }
    .ui-growl-message-error {
        background: ${({ theme }) => theme.color.error} !important;
    }
    .ui-growl-message-info {
        background: ${({ theme }) => theme.color.info} !important;
    }
    .ui-growl-message-warn {
        background: ${({ theme }) => theme.color.warning} !important;
    }
    .ui-growl-message-success {
        background: ${({ theme }) => theme.color.success} !important;
    }
`;

/**
 * Toastr container
 */
class ToastrContainer extends PureComponent<Object> {

    static propTypes = {
        options: PropTypes.object,
    };
    toastr: any;

    /**
     * @override
     */
    componentDidUpdate(prevProps: Object) {
        const { detail } = this.props.options;
        const modifiedWords = (detail || '').split(' ').map((word) => {
            if (word.length > 25) {
                return `${word.substring(0, 12)}...${word.slice(-10)}`;
            }
            return word;
        });
        this.toastr.show({ ...this.props.options, detail: (modifiedWords || []).join(' '), life: 5000 });
    }

    /**
     * @override
     */
    render(): Object {
        return (
            <ToastrStyle>
                <Growl ref={(el) => { this.toastr = el; }} />
            </ToastrStyle>
        );
    }
}

export default connect(
    (state: Object): Object => ({
        options: state.app.toastrOptions,
    }),
    null
)(ToastrContainer);
