/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'app/components/atoms/Button/Button';
import Form from 'app/components/atoms/Form/Form';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import history from 'store/History';
import FormGenerator from 'app/containers/Designer/Form/components/FormGenerator';
import { bind } from 'app/utils/decorators/decoratorUtils';
import Immutable from 'app/utils/immutable/Immutable';
/**
 * Renders the form to a add a Classification
 */
class ClassificationAdd extends PureComponent<Object, Object> {
    static propTypes = {
        addClassificationFn: PropTypes.func.isRequired,
        isLoading: PropTypes.bool
    };

    static defaultProps = {
        isLoading: false
    };

    formRef: Object = React.createRef();

    fieldDefinitions = [
        {
            field: 'name',
            type: 'text',
            properties: {
                label: 'Name',
                name: 'name',
            },
            constraints: {
                required: true,
                minLength: 3,
                maxLength: 60,
            },
        },
        {
            field: 'uri',
            type: 'text',
            properties: {
                label: 'Class URI',
                name: 'uri',
            },
            constraints: {
                required: true,
                noWhiteSpace: true,
                minLength: 3,
                maxLength: 50,
            },
        },
    ];

    state: Object = Immutable({
        formData: {
            name: '',
            uri: ''
        }
    });

    /**
     * Handle the form submit event.
     * @param e the form submit SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     * @returns {boolean} false.
     */
    @bind
    onFormSubmit(e: Event) {
        e.preventDefault();
        this.formRef.current.isValidForm().then(({ data, errors }) => {
            if(!errors) {
                this.props.addClassificationFn(data);
            }
        });
    };

    /**
     * Handle the on change event of the elements inside of the form.
     * @param event the on change SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    @bind
    handleChange(data: Object) {
        if (data.uri) {
            data = { ...data, uri: this._normalizeValue(data.uri)};
        }
        this.setState({ formData: data });
    };

    @bind
    _normalizeValue(value: string) {
        if (value !== '') {
            return value.toLowerCase();
        }
    };

    /**
     * @override
     */
    render(): Object {
        const { isLoading } = this.props;
        const { formData } = this.state;
        return (
            <Form loading={isLoading}>
                <FormGenerator
                    components={this.fieldDefinitions}
                    ref={this.formRef}
                    data={formData}
                    ListItemProps={{
                        disableGutters: true
                    }}
                />
                <ModalFooter>
                    <Button type="button" onClick={history.pushBack}>
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" onClick={this.onFormSubmit}>
                        Submit
                    </Button>
                </ModalFooter>
            </Form>
        );
    }
}

export default connect(
    state => ({
        isLoading: state.classifications.addedClassification.isLoading
    })
)(ClassificationAdd);
