/* @flow */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';

import UserAutocomplete from 'app/components/molecules/Autocomplete/UserAutocomplete';
import PersonAutocomplete from 'app/components/molecules/Autocomplete/PersonAutocomplete';
import OrganisationAutocomplete from 'app/components/molecules/Autocomplete/OrganisationAutocomplete';
import IconsSelect from 'app/components/molecules/IconsSelect/IconsSelect';
import ColorPicker from 'app/components/molecules/ColorPicker/ColorPicker';
import LocationForm from 'app/components/Forms/LocationForm/LocationForm';
import Form from 'app/components/atoms/Form/Form';
import Container from 'app/components/atoms/Container/Container';
import Card from 'app/components/molecules/Card/Card';
import Field from 'app/components/molecules/Field/Field';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import { ContactInfoListForm } from 'app/components/Forms/ContactInfoListForm/ContactInfoListForm';
import Immutable, { set } from 'app/utils/immutable/Immutable';
import { get } from 'app/utils/lo/lo';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import { formatDate } from 'app/utils/date/date';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import ImageUploader from 'app/components/molecules/ImageUploader/ImageUploader';
import { saveOrganisation } from 'store/actions/entities/organisationsActions';
import { uploadImage } from 'store/actions/entities/entitiesActions';
import { stripUnwanted } from 'app/utils/string/string-utils';

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

/**
 * General tab in organisations view.
 * Todo: We probably should extract the form in it's own component, however
 * nearly the only code here is form related.
 */
class OrganisationAbout extends Component<Object, Object> {
    state: Object;

    static propTypes: Object = {
        // eslint-disable-next-line react/no-unused-prop-types
        organisation: PropTypes.object,
        saveOrganisation: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        uploadImage: PropTypes.func.isRequired,
        userProfile: PropTypes.object,
    };

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);

        this.state = { organisationForm: Immutable(props.organisation || {}) };

        (this: Object).handleChange = this.handleChange.bind(this);
        (this: Object).onFormSubmit = this.onFormSubmit.bind(this);
        (this: Object).uploadImage = this.uploadImage.bind(this);
    }

    /**
     * @override
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.organisation !== this.props.organisation) {
            this.setState({ organisationForm: Immutable(nextProps.organisation) });
        }
    }

    /**
     * Handle a form change
     * @param event
     */
    handleChange(event: Object) {
        const { name, type, label } = event.target;
        let { value } = event.target;
        let organisationForm;
        const formData = this.state.organisationForm;
        value = stripUnwanted(value);
        if (name === 'parent.id' || name === 'contactPerson.id') {
            const path = name.replace(/\.id/, '');
            organisationForm = {
                ...this.state.organisationForm,
                [path]: {
                    'id': value || null,
                    'name': label || null,
                },
            };
        } else {
            if (type === 'number') {
                value = parseFloat(value);
            } else if (type === 'date') {
                value = value ? new Date(value).toISOString() : null;
            }
            if (name === 'name') {
                value = String(value).trimLeft();
            }
            organisationForm = set(formData, name, value);
            if (name === 'name' && (!formData.fullName || formData.fullName === formData.name)) {
                organisationForm = set(organisationForm, 'fullName', value);
            }
        }
        this.setState({ organisationForm });
    }

    /**
     * @param image upload the specified Organisation's image
     */
    uploadImage(image) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.props.uploadImage(this.props.organisation.id, 'organisation', image)
                .then(() => {
                    this.setState({ imageToUpload: e.target.result });
                }).catch((error) => {
                    return error;
                });
        };
        reader.readAsDataURL(image);
    }

    /**
     * Save the form.
     * @param event SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onFormSubmit(event) {
        // prevent default execution
        event.preventDefault();
        const dateTime = moment();
        let { organisationForm } = this.state;
        organisationForm = set(organisationForm, 'partyId', String(get(organisationForm, 'partyId') || '').trim());
        organisationForm = set(organisationForm, 'modifiedDate', dateTime);
        if (!organisationForm.fullName) {
            organisationForm = set(organisationForm, 'fullName', organisationForm.name);
        }
        this.setState({
            organisationForm,
        }, () => this.props.saveOrganisation(organisationForm));
    }

    /**
     * Lifecycle hook.
     * @returns {XML}
     */
    render(): Object {
        const organisation = this.state.organisationForm;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canEdit = isAdmin || permissionsSet.has('entity.organisation.edit');
        const { image } = organisation || {};
        const imageSrc = this.state.imageToUpload || image;
        const iconInfo = { name: organisation.iconName, color: organisation.iconColor };

        return (
            <Fragment>
                <ContentArea>
                    <Form id="form" onSubmit={this.onFormSubmit}>
                        <Container width="1024">
                            <Card
                                collapsible
                                title="Basic"
                                description={
                                    <Fragment>
                                        <Field
                                            label="ID"
                                            placeholder=""
                                            type="number"
                                            value={organisation.id}
                                            disabled
                                        />
                                        <Field
                                            label="Last Modified"
                                            type="datetime"
                                            value={formatDate(organisation.modifiedDate)}
                                            disabled
                                        />
                                        <Field
                                            label="Created On"
                                            type="datetime"
                                            value={formatDate(organisation.createdDate)}
                                            disabled
                                        />
                                        <Field
                                            name="partyId"
                                            label="Unique External Reference"
                                            title="Max 60 characters"
                                            onChange={this.handleChange}
                                            maxLength="60"
                                            value={get(organisation, 'partyId')}
                                        />
                                    </Fragment>
                                }
                            />

                            <Card
                                collapsible
                                title="Organisation Details"
                                description={
                                    <Fragment>
                                        {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                                        <ImageUploader
                                            title="Profile Image"
                                            image={imageSrc}
                                            isUploading={this.props.isLoading}
                                            uploadFunction={this.uploadImage}
                                            canEdit={canEdit}
                                            name={get(organisation, 'name', '')}
                                        />

                                        <Field
                                            label="Name"
                                            name="name"
                                            placeholder="Name"
                                            value={get(organisation, 'name', '')}
                                            onChange={this.handleChange}
                                            required
                                            disabled={!canEdit}
                                            pattern=".{3,60}"
                                            title="3 to 60 characters"
                                        />
                                        <Field
                                            label="Organisation Full Name"
                                            name="fullName"
                                            placeholder="Full Name"
                                            value={get(organisation, 'fullName', '')}
                                            onChange={this.handleChange}
                                            minLength="1"
                                            disabled={!canEdit}
                                        />

                                        <OrganisationAutocomplete
                                            name="parent"
                                            label="Parent Organisation"
                                            value={get(organisation, 'parent')}
                                            onChange={this.handleChange}
                                            filterBy={isAdmin ? null : [{ field: 'active', op: '=', value: true }]}
                                        />

                                        <UserAutocomplete
                                            name="dataOwner"
                                            label="Data Owner"
                                            value={organisation && organisation.dataOwner}
                                            onChange={this.handleChange}
                                            required
                                            disabled={!canEdit}
                                            filterBy={isAdmin ? null : [{ field: 'active', op: '=', value: true }]}
                                        />

                                        <PersonAutocomplete
                                            name="contactPerson"
                                            label="Contact Person"
                                            value={get(organisation, 'contactPerson')}
                                            onChange={this.handleChange}
                                            filterBy={isAdmin ? null : [{ field: 'active', op: '=', value: true }]}
                                        />

                                        <IconsSelect
                                            name="iconName"
                                            label="Icon"
                                            value={get(organisation, 'iconName', '')}
                                            onChange={this.handleChange}
                                            disabled={!canEdit}
                                        />
                                        <ColorPicker
                                            label="Icon Color"
                                            name="iconColor"
                                            placeholder="Icon Color"
                                            value={organisation.iconColor}
                                            onChange={this.handleChange}
                                            disabled={!canEdit}
                                        />
                                    </Fragment>
                                }
                            />

                            <Card
                                collapsible
                                title="Entity Details"
                                description={
                                    <Fragment>
                                        <CheckboxContainer>
                                            <Checkbox
                                                label="Active"
                                                name="active"
                                                type="checkbox"
                                                checked={get(organisation, 'active', true)}
                                                onChange={evt =>
                                                    this.handleChange({
                                                        target: {
                                                            name: 'active',
                                                            value: evt.target.checked,
                                                            type: 'checkbox',
                                                        },
                                                    })
                                                }
                                            />
                                            &nbsp;&nbsp;
                                            <Checkbox
                                                label="Show on Situational Awareness"
                                                name="enableGis"
                                                checked={get(organisation, 'enableGis', false)}
                                                onChange={this.handleChange}
                                                disabled={!canEdit}
                                            />
                                        </CheckboxContainer>
                                        <Field
                                            label="Description"
                                            name="description"
                                            placeholder="Description"
                                            value={get(organisation, 'description', '')}
                                            onChange={this.handleChange}
                                        />
                                    </Fragment>
                                }
                            />

                            <Card
                                collapsible
                                title="Contact Info"
                                description={
                                    <ContactInfoListForm
                                        name="contactInfo"
                                        value={organisation.contactInfo}
                                        onChange={this.handleChange}
                                    />
                                }
                            />

                            <Card
                                collapsible
                                title="Location"
                                description={<LocationForm
                                    name="locationInfo"
                                    value={get(organisation, 'locationInfo') || {}}
                                    onChange={this.handleChange}
                                    iconInfo={iconInfo}
                                    location={this.props.location}
                                />}
                            />
                        </Container>
                    </Form>
                </ContentArea>
                {!canEdit ? null : (
                    <FooterBar>
                        <TextIcon icon="content-save" label="Save" color="primary" type="submit" form="form"/>
                    </FooterBar>
                )}
            </Fragment>
        );
    }
}

const mapStateToProps: Function = (state: Object): Object => ({
    userProfile: state.user.profile,
});
export default connect(
    mapStateToProps,
    { saveOrganisation, uploadImage },
)(OrganisationAbout);
