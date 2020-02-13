/* @flow */
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { Growl } from 'primereact/components/growl/Growl';

const defErrorOpt = { severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 5000 };
const defInfoOpt = { severity: 'info', summary: 'Info', detail: '', life: 5000 };
const defWarnOpt = { severity: 'warn', summary: 'Warning', detail: '', life: 5000 };
const defSuccessOpt = { severity: 'success', summary: 'Success', detail: '', life: 5000 };

const ToastrStyle = styled.span`
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
 * Input Renderer with SplitButton to change of option filtering
 */
class Toastr extends PureComponent<Object, Object> {
    toastr: any;

    /**
      * Show toastr
      */
    show(options: Object) {
        this.toastr.show({ ...options, life: 5000 });
    }

    /**
      * Show success toastr
      */
    success(options: Object) {
        this.toastr.show({ ...defSuccessOpt, ...options });
    }

    /**
      * Show info toastr
      */
    info(options: Object) {
        this.toastr.show({ ...defInfoOpt, ...options });
    }

    /**
      * Show warning toastr
      */
    warn(options: Object) {
        this.toastr.show({ ...defWarnOpt, ...options });
    }

    /**
      * Show error toastr
      */
    error(options: Object) {
        this.toastr.show({ ...defErrorOpt, ...options });
    }
    /**
      * @override
      */
    render(){
        return (
            <ToastrStyle>
                <Growl ref={(el) => { this.toastr = el; }} />
            </ToastrStyle>
        );
    }
}

export default Toastr;
