/* @flow */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import memoize from 'memoize-one';

import { showToastr } from 'store/actions/app/appActions';
import { set } from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import Card from 'app/components/molecules/Card/Card';
import Field from 'app/components/molecules/Field/Field';
import Container from 'app/components/atoms/Container/Container';
import Form from 'app/components/atoms/Form/Form';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import ClassificationDropdown from 'app/containers/Common/DropDowns/ClassificationsDropdownDeprecated';
import { safeToJS } from 'app/utils/trasformer/transformer';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { connect } from 'react-redux';
import UserAutocomplete from 'app/components/molecules/Autocomplete/UserAutocomplete';
import ColorPicker from 'app/components/molecules/ColorPicker/ColorPicker';
import Select from 'app/components/molecules/Autocomplete/Select';

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

/**
 * General tab in classifications view.
 * Todo: We probably should extract the form in it's own component, however
 * nearly the only code here is form related.
 */
class ClassificationDetailAbout extends Component<Object, Object> {
    static propTypes: Object = {
        classification: PropTypes.object,
        updateClassification: PropTypes.func,
        userProfile: PropTypes.object,
    };

    colors: Array<string>;

    form: any;

    state: {
        classificationForm?: Object
    };

    /**
     *
     * @param props
     */
    constructor(props: Object) {
        super(props);
        this.state = { classificationForm: this._manipulateData(props.classification) };
    }

    /**
     * @override
     */
    componentDidUpdate(prevsProp: Object) {
        if (prevsProp.classification !== this.props.classification) {
            this.setState({ classificationForm: this._manipulateData(this.props.classification) });
        }
    }

    /**
     * Handle a form change
     * @param event
     */
    handleChange = (event: Object) => {
        const { name, value } = event.target;
        const nValue = this._normalizeValue(name, value);
        this.setState({
            classificationForm: set(this.state.classificationForm, name, nValue),
        });
    };

    _normalizeValue = (name: string, value: any) => {
        if (name === 'uri') {
            return value.toLowerCase();
        }
        return value;
    };

    _manipulateData = memoize((classification: Object) => {
        const parents = (classification.parents || []).map(({ uri }) => uri);
        return set(classification, 'parents', parents);
    });

    /**
     * Save the form.
     */
    onFormSubmit = (e) => {
        e.preventDefault();
        const classificationForm = get(this.state, 'classificationForm');
        const { id, name, abstract: cAbstract, active, color, applicableOn, dataOwner: { login }, parents } = classificationForm || {};
        const uri = String(get(classificationForm, 'uri')).trim();
        if (!uri) {
            this.props.showToastr({ severity: 'warn', detail: 'Classification URI can not be empty' });
        } else if (/\s/.test(uri)) {
            this.props.showToastr({ severity: 'warn', detail: 'Classification URI can not contain white spaces' });
        } else {
            const parentUris = (parents || []).map(parent => typeof(parent) === 'object' ? parent.uri : parent);
            this.props.updateClassification({ id, name, uri, abstract: cAbstract, active, color, applicableOn, dataOwner: { login }, parentUris });
        }
    };

    render() {
        const classification = safeToJS(this.state.classificationForm);
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canEdit = isAdmin || permissionsSet.has('entity.classification.edit');
        if (!classification) {
            return null;
        }
        return (
            <Fragment>
                <ContentArea>
                    <Form id="form" onSubmit={this.onFormSubmit}>
                        <Container width="1024">
                            <Card
                                collapsible
                                title="General Information"
                                description={
                                    <Fragment>
                                        <Field
                                            id="name"
                                            label="Name"
                                            name="name"
                                            placeholder="Name"
                                            value={get(classification, 'name')}
                                            onChange={this.handleChange}
                                            pattern=".{3,60}"
                                            title="3 to 60 characters"
                                            required
                                        />
                                        {/* hidden as per:
                                        https://gitlab.mi-c3.com/affectli-project/affectli-support-issues/issues/6046
                                        <Field
                                            id="name"
                                            label="Application"
                                            name="no_backend_yet"
                                            placeholder="Name"
                                            value={get(classification, 'no_backend_yet', 'API not available')}
                                            onChange={this.handleChange}
                                            disabled
                                        />*/}
                                        <Field
                                            id="uri"
                                            name="uri"
                                            label="Class URI"
                                            placeholder="Classification URI"
                                            pattern=".{3,50}"
                                            required
                                            value={get(classification, 'uri') || ''}
                                            onChange={this.handleChange}
                                        />
                                        <UserAutocomplete
                                            name="dataOwner"
                                            label="Data Owner"
                                            value={get(classification, 'dataOwner')}
                                            onChange={this.handleChange}
                                            required
                                            disabled={!canEdit}
                                            filterBy={isAdmin ? null : [{ field: 'active', op: '=', value: true }]}
                                        />
                                        <CheckboxContainer>
                                            <Checkbox
                                                label="Active"
                                                name="active"
                                                checked={get(classification, 'active')}
                                                onChange={this.handleChange}
                                            />
                                            &nbsp;&nbsp;
                                            <Checkbox
                                                id="abstract"
                                                name="abstract"
                                                label="Abstract"
                                                placeholder="Abstract"
                                                checked={get(classification, 'abstract')}
                                                onChange={this.handleChange}
                                            />
                                        </CheckboxContainer>
                                    </Fragment>
                                }
                            />

                            <Card
                                collapsible
                                title="Classification Details"
                                description={
                                    <Fragment>
                                        <Select
                                            label="Applies to"
                                            name="applicableOn"
                                            value={get(classification, 'applicableOn') || []}
                                            onChange={this.handleChange}
                                            options={[
                                                { value: 'thing', label: 'Thing' },
                                                { value: 'organisation', label: 'Organisation' },
                                                { value: 'person', label: 'Person' },
                                                { value: 'custom', label: 'Custom Entity' },
                                                { value: 'group', label: 'Group' },
                                                { value: 'relationship', label: 'Relationship' },
                                            ]}
                                            multiple
                                        />

                                        <ClassificationDropdown
                                            label="Inherited from"
                                            name="parents"
                                            valueProperty="uri"
                                            value={classification.parents}
                                            onChange={this.handleChange}
                                            multiple
                                            filterBy={[{ field: 'id', op: '<>', value: classification.id }]}
                                        />
                                    </Fragment>
                                }
                            />

                            <Card
                                collapsible
                                title="Symbolisation Section"
                                description={<ColorPicker
                                    label="Color"
                                    name="color"
                                    value={get(classification, 'color')}
                                    onChange={this.handleChange}
                                />}
                            />
                        </Container>
                    </Form>
                </ContentArea>
                {canEdit && (
                    <FooterBar>
                        <TextIcon label="Save" icon="content-save" color="primary" type="submit" form="form"/>
                    </FooterBar>
                )}
            </Fragment>
        );
    }
}

export default connect(
    null,
    { showToastr },
)(ClassificationDetailAbout);
