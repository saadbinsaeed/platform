/* @flow */

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Col, Row } from 'react-styled-flexboxgrid';
import { showToastr } from 'store/actions/app/appActions';
import Button from 'app/components/atoms/Button/Button';
import Field from 'app/components/molecules/Field/Field';
import Form from 'app/components/atoms/Form/Form';
import Dropdown from 'app/components/atoms/Dropdown/Dropdown';
import Modal from 'app/components/molecules/Modal/Modal';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import ModalFooter from 'app/components/molecules/Modal/ModalFooter';
import { safeToJS } from 'app/utils/trasformer/transformer';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import { startsWith } from 'app/utils/string/string-utils';
import Immutable, { set } from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import history from 'store/History';
import KeyValuePairTable from './KeyValuePairTable/KeyValuePairTable';
import FieldItem from 'app/components/Entities/Classifications/FieldItem';
import attributeTypes from 'app/containers/Classifications/attributeTypes';
import ClassificationAutocomplete from 'app/components/molecules/Autocomplete/ClassificationAutocomplete';
import Loader from 'app/components/atoms/Loader/Loader';

const AvailableGridCheckBox = styled(Col)`
    display: none !important;
`;

const formats = [];
for (const delimiter of [' ', '/', '-', '.']) {
    for (const d of ['D', 'DD']) {
        for (const m of ['M', 'MM']) {
            for (const y of ['Y', 'YY']) {
                formats.push(`${d}${delimiter}${m}${delimiter}${y}`);
                formats.push(`${d}${delimiter}${y}${delimiter}${m}`);
                formats.push(`${m}${delimiter}${d}${delimiter}${y}`);
                formats.push(`${m}${delimiter}${y}${delimiter}${d}`);
                formats.push(`${y}${delimiter}${d}${delimiter}${m}`);
                formats.push(`${y}${delimiter}${m}${delimiter}${d}`);
            }
        }
    }
}

/**
 * Attribute detail modal
 */
class AttributeDetailModal extends Component<Object, Object> {
    static propTypes: Object = {
        classification: PropTypes.object,
        updateClassification: PropTypes.func,
        showToastr: PropTypes.func,
        match: RouterMatchPropTypeBuilder({ attributeFieldUri: PropTypes.string.isRequired }),
    };

    state: Object;

    attributeId: number = -1;

    fUri: ?Object;

    /**
     *
     * @param props
     */
    constructor(props: Object) {
        super(props);
        this.state = this.resetForm(props);

        (this: Object).handleChange = this.handleChange.bind(this);
        (this: Object).onFormSubmit = this.onFormSubmit.bind(this);
    }

    /**
     * @override
     */
    componentDidUpdate(prevProps, prevState) {
        if (this.props.classification !== prevProps.classification) {
            this.setState(this.resetForm(this.props));
        }
    }

    /**
     * Handle a form change
     * @param event
     */
    handleChange(event: Object) {
        const { name, value } = event.target;
        if (name === 'f_uri') {
            event.target.setCustomValidity('');
            const parentUri = `${this.state.classificationForm.uri}/`;
            if (startsWith(value, parentUri)) {
                const uri = value.replace(parentUri, '').toLowerCase();
                this.setState({
                    classificationForm: this.setFieldValue(
                        this.state.classificationForm,
                        name,
                        `${parentUri}${uri}`,
                    ),
                });
            }
        } else if (name === 'name') {
            const parentUri = `${this.state.classificationForm.uri}/`;
            let classificationForm = this.setFieldValue(this.state.classificationForm, name, value);
            // update the URI if it is not defined or if it is derived by the name
            const newUri = value.replace(/[^\w\d]+/g, '').toLowerCase();
            const newFullUri = `${parentUri}${newUri}`;
            const uri = this.getFieldValue(this.state.classificationForm, 'f_uri');
            if (!uri || !value || startsWith(uri, newFullUri) || startsWith(newFullUri, uri)) {
                this.fUri && this.fUri.setCustomValidity('');
                classificationForm = this.setFieldValue(classificationForm, 'f_uri', newFullUri);
            }
            this.setState({ classificationForm });
        } else if (name === 'kind') {
            this.setState(
                { classificationForm: this.setFieldValue(this.state.classificationForm, name, value) },
                () => {
                    this.setState({
                        classificationForm: this.setFieldValue(
                            this.state.classificationForm,
                            'default_value',
                            null,
                        ),
                    });
                },
            );
        } else {
            if (this.attributeId === -1) {
                this.setState(this.resetForm(this.props));
            }
            if (name === 'type' && ['things', 'people', 'organisations', 'custom', 'classification'].includes(value)) {
                return this.setState({
                    classificationForm: this.setFieldValue(
                        this.setFieldValue(
                            this.state.classificationForm,
                            'filter_expression',
                            JSON.stringify([{ field: 'active', op: '=', value: true }]),
                        ),
                        name,
                        value,
                    ),
                });
            }
            this.setState({ classificationForm: this.setFieldValue(this.state.classificationForm, name, value) });
        }
    }

    /**
     * Resets form state.
     */
    resetForm({ classification, match }: Object) {
        const newState = { classificationForm: classification };
        let fields = safeToJS(get(newState, 'classificationForm.formDefinitions.fields'));
        if (fields) {
            fields.forEach((element, index) => {
                if (element.f_uri === decodeURIComponent(match.params.attributeFieldUri)) {
                    this.attributeId = index;
                }
            });
        }
        if (this.attributeId === -1 && classification) {
            const emptyAttribute = { f_uri: '', group_name: classification.name };
            fields = Immutable([...(fields || []), emptyAttribute]);
            newState.classificationForm = set(newState.classificationForm, 'formDefinitions.fields', fields);
            this.attributeId = fields.length - 1;
        }

        return newState;
    }

    /**
     * prevent form submission on enter key press in input.
     */
    onKeyPress = (event) => {
        if (event.which === 13) {
            event.preventDefault();
        }
    };

    /**
     * Save the form.
     */
    onFormSubmit(event: Event) {
        event.preventDefault();
        const { classificationForm } = this.state;
        const { name: classificationName } = this.props.classification;
        // the attribute URI must be unique
        const fUri = this.getFieldValue(classificationForm, 'f_uri');

        const matches = classificationForm.formDefinitions.fields.filter((field) => {
            return field.f_uri === fUri;
        }).length;
        if (matches > 1) {
            this.props.showToastr({
                severity: 'error',
                detail: 'The same URI is used by another attribute: please change the URI of this attribute before saving it.',
            });
            return;
        }
        let update = true;
        let toastrMsg = false;
        const type = this.getFieldValue(classificationForm, 'type');
        if (!type) {
            return this.props.showToastr({
                severity: 'error',
                detail: 'Attribute type is missing.',
            });
        }
        const enumerations = this.getFieldValue(classificationForm, 'enum_values') || [];
        if (type === 'enum' && !enumerations.length) {
            toastrMsg = {
                severity: 'error',
                detail: 'Please enter one key-value pair before submitting form.',
            };
            update = false;
        }
        if (enumerations) {
            enumerations.forEach((kvPair, index) => {
                enumerations.forEach((innerKVpair, innerIndex) => {
                    if (index !== innerIndex && (innerKVpair.key === kvPair.key || innerKVpair.value === kvPair.value)) {
                        toastrMsg = {
                            severity: 'error',
                            detail: 'Please fill all the cells with a unique value before submitting form.',
                        };
                        update = false;
                    }
                });
                if (kvPair.value === '' || kvPair.key === '') {
                    toastrMsg =
                        { severity: 'error', detail: 'Please fill all the cell values before submitting form.' };
                    update = false;
                }
                if (kvPair.value.length > 50) {
                    toastrMsg = { severity: 'error', detail: 'Value should be less then 50 characters.' };
                    update = false;
                }
                if (kvPair.key.length > 50) {
                    toastrMsg = { severity: 'error', detail: 'Key should be less then 50 characters.' };
                    update = false;
                }
            });
        }
        const groupName = this.getFieldValue(classificationForm, 'group_name');
        const formData = this.setFieldValue(classificationForm, 'group_name', groupName || classificationName);
        const { id, formDefinitions} = formData || {};
        if (update) {
            return this.setState({ isLoading: true }, () => {
                this.props.updateClassification({ id, formDefinitions})
                    .then(() => {
                        this.setState(this.resetForm(this.props));
                        this.attributeId = -1;
                        history.push(`/classifications/${classificationForm.id}/attributes`);
                    })
                    .catch((e) => {
                        this.setState({ isLoading: false });
                        this.props.showToastr({ severity: 'error', detail: `Failed to save attribute. ${e}` });
                    });
            });
        }
        this.props.showToastr(toastrMsg);
    }

    hideExtensionTypes = [
        'timestamp',
        'enum',
        'things',
        'people',
        'organisations',
        'directory',
        'custom',
        'classification',
    ];

    /**
     * @override
     */
    render() {
        const { classificationForm, isLoading } = this.state;
        if (!classificationForm) {
            return null;
        }
        if (isLoading) {
            return (<Loader absolute backdrop/>);
        }
        const parentUri = `${classificationForm.uri}/`;
        const name = this.getFieldValue(this.props.classification, 'name', '');
        const title = name ? `Edit Attribute: ${name}` : 'Add Attribute';

        const type = this.getFieldValue(classificationForm, 'type');
        const text_ext = this.getFieldValue(classificationForm, 'text_ext');
        const readOnlyValue = this.getFieldValue(classificationForm, 'readOnly');
        const requiredValue = this.getFieldValue(classificationForm, 'required');
        const extentions = this.hideExtensionTypes.includes(type) ? null : (
            <Fragment>
                <Field
                    type="text"
                    name="text_ext"
                    label="Extension Text"
                    placeholder="$"
                    title="Max 12 characters are allowed"
                    value={text_ext}
                    maxLength="12"
                    onChange={this.handleChange}
                />

                <Dropdown
                    label="Display"
                    value={this.getFieldValue(classificationForm, 'text_ext_position')}
                    onChange={this.handleChange}
                    name="text_ext_position"
                    placeholder="Display text..."
                    fluid
                    required={!!text_ext}
                    options={[{ value: 'before', label: 'Before Value' }, { value: 'after', label: 'After Value' }]}
                />
            </Fragment>
        );
        const selectedClass = this.getFieldValue(classificationForm, 'class');
        return (
            <Modal title={title} closeUrl={`/classifications/${classificationForm.id}/attributes`} open>
                <Form onKeyPress={this.onKeyPress} onSubmit={this.onFormSubmit}>
                    <div>
                        <Field
                            label="Name"
                            name="name"
                            placeholder="Name"
                            value={this.getFieldValue(classificationForm, 'name')}
                            onChange={this.handleChange}
                            pattern=".{3,60}"
                            title="3 to 60 characters"
                            required
                            minLength="1"
                        />
                        <Field
                            inputRef={(input) => {
                                this.fUri = input;
                            }}
                            label="Attribute URI"
                            name="f_uri"
                            value={this.getFieldValue(classificationForm, 'f_uri', parentUri)}
                            onChange={this.handleChange}
                            required
                            pattern={`.{${parentUri.length + 1},}`}
                            onInvalid={(event) => {
                                event.target.setCustomValidity('Please complete the URI');
                            }}
                        />
                        <Field
                            label="Group Name"
                            name="group_name"
                            placeholder={`Group name (${classificationForm.name})`}
                            value={this.getFieldValue(classificationForm, 'group_name')}
                            onChange={this.handleChange}
                        />
                        <Row>
                            <Col xs={12} sm={3} md={3} lg={3}>
                                <Checkbox
                                    label="Summary"
                                    name="summary"
                                    checked={this.getFieldValue(classificationForm, 'summary')}
                                    onChange={this.handleChange}
                                />
                            </Col>
                            <Col xs={12} sm={3} md={3} lg={3}>
                                <Checkbox
                                    label="Read only"
                                    name="readOnly"
                                    disabled={requiredValue}
                                    checked={readOnlyValue}
                                    onChange={this.handleChange}
                                />
                            </Col>
                            {type !== 'bool' && (
                                <Col xs={12} sm={3} md={3} lg={3}>
                                    <Checkbox
                                        label="Required"
                                        name="required"
                                        disabled={readOnlyValue}
                                        checked={requiredValue}
                                        onChange={this.handleChange}
                                    />
                                </Col>
                            )}
                            <AvailableGridCheckBox xs={12} sm={9} md={9} lg={9}>
                                <Checkbox
                                    label="Available for grid"
                                    name="availableForGrid"
                                    checked={this.getFieldValue(classificationForm, 'availableForGrid')}
                                    onChange={this.handleChange}
                                />
                            </AvailableGridCheckBox>
                        </Row>

                        <Dropdown
                            label="Attribute Type"
                            value={type}
                            onChange={evt => this.handleChange({ target: { name: 'type', value: evt.target.value } })}
                            name="type"
                            placeholder="Select an attribute type"
                            fluid
                            required
                            options={attributeTypes}
                        />

                        {type === 'directory' && (
                            <Field
                                name="dir_domain"
                                label="Domain"
                                placeholder="Domain"
                                value={this.getFieldValue(classificationForm, 'dir_domain')}
                                onChange={this.handleChange}
                            />
                        )}

                        {['things', 'people', 'organisations', 'custom', 'classification'].includes(type) && (
                            <Field
                                name="filter_expression"
                                label="Filter expression"
                                placeholder="Filter expression"
                                value={this.getFieldValue(classificationForm, 'filter_expression')}
                                onChange={this.handleChange}
                            />
                        )}

                        {type === 'enum' && (
                            <KeyValuePairTable
                                showToastr={this.props.showToastr}
                                gridData={this.getFieldValue(classificationForm, 'enum_values') || []}
                                name="enum_values"
                                onChange={this.handleChange}
                            />
                        )}

                        {type === 'timestamp' && (
                            <Dropdown
                                label="Type"
                                value={this.getFieldValue(classificationForm, 'kind') || 'datetime'}
                                onChange={this.handleChange}
                                name="kind"
                                placeholder="Select kind"
                                fluid
                                options={[
                                    { value: 'date', label: 'Date' },
                                    { value: 'time', label: 'Time' },
                                    { value: 'datetime', label: 'Date & Time' },
                                ]}
                            />
                        )}

                        {type === 'timestamp' && this.getFieldValue(classificationForm, 'kind') !== 'time' && (
                            <Dropdown
                                label="Format"
                                value={this.getFieldValue(classificationForm, 'format') || 'dd/mm/yy'}
                                onChange={this.handleChange}
                                name="format"
                                placeholder="Select format"
                                fluid
                                options={formats.map(f => ({ value: f, label: f }))}
                            />
                        )}
                        {type === 'custom' && (
                            <Fragment>
                                <ClassificationAutocomplete
                                    label="Classification"
                                    name="class"
                                    placeholder="Select a class..."
                                    applicableOn="custom"
                                    onChange={this.handleChange}
                                    value={selectedClass}
                                />
                            </Fragment>
                        )}
                        {type && (
                            <FieldItem
                                {...this.getValues(classificationForm)}
                                name="Default value"
                                f_uri="default_value"
                                readOnly={false}
                                required={false}
                                updateAttribute={this.handleChange}
                                class={selectedClass}
                                placeholder={'Default value'}
                            />
                        )}

                        {extentions}
                    </div>
                    <ModalFooter>
                        <Button color="primary" type="submit">
                            Save
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }

    /**
     * Returns the classificationForm fields values.
     *
     * @param classificationForm the classification form
     * @returns the field value.
     */
    getValues(classificationForm: Object): any {
        return safeToJS(get(classificationForm, `formDefinitions.fields[${this.attributeId}]`)) || {};
    }

    /**
     * Returns the classificationForm field value.
     *
     * @param classificationForm the classification form
     * @param fieldName the field name
     * @param defaultValue the default value (optional)
     * @returns the field value.
     */
    getFieldValue(classificationForm: Object, fieldName: string, defaultValue: ?any): any {
        return safeToJS(get(
            classificationForm,
            `formDefinitions.fields[${this.attributeId}].${fieldName}`,
        )) || defaultValue;
    }

    /**
     * Returns the classificationForm with the modified field.
     *
     * @param classificationForm the classification form.
     * @param fieldName the name of the field to modify.
     * @param value the value to set.
     */
    setFieldValue(classificationForm: Object, fieldName: string, value: any): Object {
        return set(classificationForm, `formDefinitions.fields[${this.attributeId}].${fieldName}`, value);
    }
}

export default connect(null, { showToastr })(withRouter(AttributeDetailModal));
