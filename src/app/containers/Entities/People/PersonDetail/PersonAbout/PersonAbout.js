/* @flow */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';

import UserAutocomplete from 'app/components/molecules/Autocomplete/UserAutocomplete';
import IconsSelect from 'app/components/molecules/IconsSelect/IconsSelect';
import ColorPicker from 'app/components/molecules/ColorPicker/ColorPicker';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import Container from 'app/components/atoms/Container/Container';
import Form from 'app/components/atoms/Form/Form';
import LocationForm from 'app/components/Forms/LocationForm/LocationForm';
import { ContactInfoListForm } from 'app/components/Forms/ContactInfoListForm/ContactInfoListForm';
import Card from 'app/components/molecules/Card/Card';
import Field from 'app/components/molecules/Field/Field';
import { set } from 'app/utils/immutable/Immutable';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import { formatDate } from 'app/utils/date/date';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import ImageUploader from 'app/components/molecules/ImageUploader/ImageUploader';
import { savePerson } from 'store/actions/entities/peopleActions';
import { uploadImage } from 'store/actions/entities/entitiesActions';
import Immutable from 'app/utils/immutable/Immutable';
import DateTimePickerModal from 'app/components/molecules/DataTimePicker/DateTimePickerModal';
import { stripUnwanted } from 'app/utils/string/string-utils';

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

/**
 * General tab in persons view.
 * Todo: We probably should extract the form in it's own component, however
 * nearly the only code here is form related.
 */
class PeopleAbout extends Component<Object, Object> {
    state: Object;

    static propTypes: Object = {
        // eslint-disable-next-line react/no-unused-prop-types
        person: PropTypes.object,
        savePerson: PropTypes.func.isRequired,
        uploadImage: PropTypes.func.isRequired,
        imageUploading: PropTypes.bool,
        userProfile: PropTypes.object,
    };

    /**
     * @param props the Component's properties
     */
    constructor(props) {
        super(props);

        this.state = { personForm: Immutable(props.person || {}) };

        (this: Object).handleChange = this.handleChange.bind(this);
        (this: Object).onFormSubmit = this.onFormSubmit.bind(this);
        (this: Object).uploadImage = this.uploadImage.bind(this);
    }

    /**
     * @override
     */
    componentDidUpdate(prevProps: Object) {
        if (prevProps.person !== this.props.person) {
            this.setState({ personForm: Immutable(this.props.person) });
        }
    }

    /**
     * Handle a form change
     * @param event
     */
    handleChange(event) {
        const { name, type } = event.target;
        let { value } = event.target;
        value = stripUnwanted(value);
        if (type === 'number') {
            value = parseFloat(value);
        }
        if (name === 'dateOfBirth') {
            value = value ? new Date(value).toISOString() : null;
        }
        if (name === 'name') {
            value = String(value).trimLeft();
        }
        // Set a nested state based on field name
        this.setState({
            personForm: set(this.state.personForm, name, value),
        });
    }

    /**
     * Returns person dob in yyyy-mm-dd format
     * @param person
     * @returns {string}
     */
    getDateOfBirth(person) {
        return person.dateOfBirth ? moment(person.dateOfBirth, moment.ISO_8601).toDate() : null;
    }

    /**
     * @param image upload the specified Person's image
     */
    uploadImage(image) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.props.uploadImage(this.props.person.id, 'person', image)
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
        let { personForm } = this.state;
        const partyId = personForm.partyId && personForm.partyId.trim();
        personForm = set(personForm, 'partyId', partyId);
        personForm = set(personForm, 'modifiedDate', dateTime);
        this.setState({
            personForm,
        }, () => this.props.savePerson(personForm));
    }

    /**
     * Lifecycle hook.
     * @returns {XML}
     */
    render(): Object {
        const person = this.state.personForm;
        const { permissions, isAdmin } = this.props.userProfile;
        const permissionsSet = new Set(permissions || []);
        const canEdit = isAdmin || permissionsSet.has('entity.person.edit');

        const currentDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
        const imageUrl = person.image;
        const imageSrc = this.state.imageToUpload || imageUrl;
        const iconInfo = { name: person.iconName, color: person.iconColor };
        return (
            <Fragment>
                <ContentArea>
                    <Form onSubmit={this.onFormSubmit} id="people_about_form">
                        <Container width="1024">
                            <Card
                                collapsible
                                title="Basic"
                                description={
                                    <div>
                                        <Field label="ID" placeholder="" type="number" value={person.id} disabled/>
                                        <Field
                                            label="Last Modified"
                                            type="datetime"
                                            value={formatDate(person.modifiedDate)}
                                            disabled
                                        />
                                        <Field
                                            label="Created On"
                                            type="datetime"
                                            value={formatDate(person.createdDate)}
                                            disabled
                                        />
                                        <Field
                                            name="partyId"
                                            label="Unique External Reference"
                                            title="Max 60 characters"
                                            onChange={this.handleChange}
                                            disabled={!!person.user}
                                            maxLength="60"
                                            value={person.partyId}
                                        />
                                    </div>
                                }
                            />

                            <Card
                                collapsible
                                title="Person Details"
                                description={
                                    <div>
                                        {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                                        <ImageUploader
                                            title="Profile Image"
                                            image={imageSrc}
                                            isUploading={this.props.imageUploading}
                                            uploadFunction={this.uploadImage}
                                            canEdit={canEdit}
                                            name={person.name}
                                        />

                                        <Field
                                            label="Name"
                                            name="name"
                                            placeholder="Name"
                                            value={person.name}
                                            onChange={this.handleChange}
                                            required
                                            minLength="1"
                                            disabled={!canEdit}
                                            pattern=".{3,60}"
                                            title="3 to 60 characters"
                                        />

                                        <UserAutocomplete
                                            name="dataOwner"
                                            label="Data Owner"
                                            value={person && person.dataOwner}
                                            onChange={this.handleChange}
                                            required
                                            disabled={!canEdit}
                                            filterBy={isAdmin ? null : [{ field: 'active', op: '=', value: true }]}
                                        />

                                        <DateTimePickerModal
                                            maxDate={moment(currentDate, moment.ISO_8601).toDate()}
                                            minDate={moment('1900-01-01T19:00:00.000Z', moment.ISO_8601).toDate()}
                                            format="DD/MM/YYYY"
                                            label="Birthday"
                                            placeholder="Birthday"
                                            name="dateOfBirth"
                                            kind="date"
                                            value={this.getDateOfBirth(person)}
                                            onChange={this.handleChange}
                                            disableFormating
                                        />

                                        <IconsSelect
                                            name="iconName"
                                            label="Icon"
                                            value={person.iconName}
                                            onChange={this.handleChange}
                                            disabled={!canEdit}
                                        />
                                        <ColorPicker
                                            label="Icon Color"
                                            name="iconColor"
                                            placeholder="Icon Color"
                                            value={person.iconColor}
                                            onChange={this.handleChange}
                                            disabled={!canEdit}
                                        />
                                    </div>
                                }
                            />

                            <Card
                                collapsible
                                title="Entity Details"
                                description={
                                    <div>
                                        <CheckboxContainer>
                                            <Checkbox
                                                label="Active"
                                                name="active"
                                                type="checkbox"
                                                checked={person.active}
                                                onChange={this.handleChange}
                                            />
                                            &nbsp;&nbsp;
                                            <Checkbox
                                                label="Show on Situational Awareness"
                                                name="enableGis"
                                                checked={person.enableGis}
                                                onChange={this.handleChange}
                                                disabled={!canEdit}
                                            />
                                        </CheckboxContainer>

                                        <Field
                                            label="Description"
                                            name="description"
                                            placeholder="Description"
                                            value={person.description}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                }
                            />

                            <Card
                                collapsible
                                title="Contact Info"
                                description={<ContactInfoListForm
                                    name="contactInfo"
                                    value={person.contactInfo}
                                    onChange={this.handleChange}
                                />}
                            />

                            <Card
                                collapsible
                                title="Location"
                                description={
                                    <div>
                                        <LocationForm
                                            name="locationInfo"
                                            value={person.locationInfo || {}}
                                            onChange={this.handleChange}
                                            iconInfo={iconInfo}
                                            location={this.props.location}
                                        />
                                    </div>
                                }
                            />
                        </Container>
                    </Form>
                </ContentArea>
                {!canEdit ? null : (
                    <FooterBar>
                        <TextIcon
                            icon="content-save"
                            label="Save"
                            color="primary"
                            form="people_about_form"
                            type="submit"
                        />
                    </FooterBar>
                )}
            </Fragment>
        );
    }
}

const mapStateToProps: Function = (state: Object): Object => {
    return {
        userProfile: state.user.profile,
    };
};

export default connect(
    mapStateToProps,
    {
        savePerson,
        uploadImage,
    },
)(PeopleAbout);
