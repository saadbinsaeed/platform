/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Stepper from 'app/components/atoms/Stepper/Stepper';
import { connect } from 'react-redux';
import { showStepperSave, toggleAppHeader } from 'store/actions/app/appActions';
import Form from 'app/components/atoms/Form/Form';
import history from 'store/History';
import { bind } from 'app/utils/decorators/decoratorUtils';

/**
 *
 */
export class StepperContainer extends PureComponent<Object, Object> {
    static propTypes = {
        steps: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isRequired,
                subTitle: PropTypes.string,
                formId: PropTypes.string
            })
        ).isRequired,
        onClose: PropTypes.func,
        onDone: PropTypes.func.isRequired,
        toggleAppHeader: PropTypes.func.isRequired,
        showStepperSave: PropTypes.func.isRequired
    };

    static defaultProps = {};

    constructor(props: Object) {
        super(props);
        this.state = {
            step: 1,
            disabled: false
        };
        this.props.toggleAppHeader(true);
        this.props.showStepperSave();
    }

    componentWillUnmount() {
        this.props.toggleAppHeader(false);
    }

    @bind
    mbHandleError(mbError: any) {
        this.setState({ disabled: false });
        if (mbError instanceof Error) {
            // if there was error navigate back to the last step
            return this.onPrevious();
        }
        this.onClose();
    };

    @bind
    onNext() {
        const { step } = this.state;
        step <= this.props.steps.length && this.setState(prevState => ({ step: prevState.step + 1 }));
    }

    @bind
    onPrevious() {
        const { step } = this.state;
        step > 1 && this.setState(prevState => ({ step: prevState.step - 1 }));
    }

    @bind
    onDone() {
        const { onDone } = this.props;
        if (onDone) {
            const res = this.props.onDone();
            this.setState({ disabled: true });
            if (res.then && typeof res.then === 'function') {
                res.then(this.mbHandleError, this.mbHandleError);
            } else {
                this.onClose();
            }
        }
    }

    @bind
    onClose() {
        if (this.props.onClose) {
            this.props.onClose();
        } else {
            history.pushBack();
        }
    }

    @bind
    onFormSubmit(event: Object) {
        event.preventDefault();
        if (this.state.step === this.props.steps.length) {
            this.onDone();
        } else {
            this.onNext();
        }
    }

    render() {
        const { step, disabled } = this.state;
        const { config } = this.props;
        const { title, subTitle, formId, content } = this.props.steps[step - 1] || {};
        return (
            <Stepper
                title={step > this.props.steps.length ? 'Loading' : title}
                subTitle={step > this.props.steps.length ? '' : subTitle}
                step={step}
                steps={this.props.steps && this.props.steps.length}
                onNext={this.onNext}
                onPrevious={this.onPrevious}
                onClose={this.onClose}
                formId={formId}
                disabled={disabled}
                hideOnSave={config.hideOnSave}
            >
                <Form onSubmit={this.onFormSubmit} id={formId}>
                    {content}
                </Form>
            </Stepper>
        );
    }
}

export default connect(
    state => ({ config: state.app.stepper }),
    {
        toggleAppHeader,
        showStepperSave
    }
)(StepperContainer);
