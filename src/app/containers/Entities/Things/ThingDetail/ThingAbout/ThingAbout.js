/* @flow */
import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import memoize from 'memoize-one';

import UserAutocomplete from 'app/components/molecules/Autocomplete/UserAutocomplete';
import ThingAutocomplete from 'app/components/molecules/Autocomplete/ThingAutocomplete';
import OrganisationAutocomplete from 'app/components/molecules/Autocomplete/OrganisationAutocomplete';
import IconsSelect from 'app/components/molecules/IconsSelect/IconsSelect';
import ColorPicker from 'app/components/molecules/ColorPicker/ColorPicker';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import Container from 'app/components/atoms/Container/Container';
import Form from 'app/components/atoms/Form/Form';
import Card from 'app/components/molecules/Card/Card';
import Field from 'app/components/molecules/Field/Field';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import ImageUploader from 'app/components/molecules/ImageUploader/ImageUploader';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import LocationForm from 'app/components/Forms/LocationForm/LocationForm';
import Immutable from 'app/utils/immutable/Immutable';
import { set, get } from 'app/utils/lo/lo';
import { formatDate } from 'app/utils/date/date';
import { uploadImage } from 'store/actions/entities/entitiesActions';
import { saveThing } from 'store/actions/entities/thingsActions';
import { stripUnwanted } from 'app/utils/string/string-utils';

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

/**
 * The Thing About Tab.
 */
class ThingAbout extends PureComponent<Object, Object> {
    state: Object;

    static propTypes: Object = {
        thing: PropTypes.object.isRequired,
        saveThing: PropTypes.func.isRequired,
        uploadImage: PropTypes.func,
        isLoading: PropTypes.bool,
        imageData: PropTypes.object,
        allOpen: PropTypes.bool,
        userProfile: PropTypes.object,
    };

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);

        this.state = { thingForm: Immutable(props.thing), imageError: false };

        (this: Object).handleChange = this.handleChange.bind(this);
        (this: Object).onFormSubmit = this.onFormSubmit.bind(this);
        (this: Object).uploadImage = this.uploadImage.bind(this);
        (this: Object).handleImageError = this.handleImageError.bind(this);
    }

    /**
     * @override
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.thing !== this.props.thing) {
            this.setState({ thingForm: Immutable(nextProps.thing) });
        }
    }

    /**
     * Handle a form change
     * @param event
     */
    handleChange(event: Object) {
        const { name, type } = event.target;
        let { value } = event.target;
        if (type === 'number') {
            value = parseFloat(value);
        } else {
            value = stripUnwanted(value);
        }
        if (name === 'name') {
            value = String(value).trimLeft();
        }
        this.setState({ thingForm: set(this.state.thingForm, name, value) });
    }

    /**
     * Save the form.
     * @param event SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onFormSubmit(event) {
        event.preventDefault();
        const { thingForm } = this.state;
        this.props.saveThing(set(thingForm, 'thingId', thingForm.thingId && thingForm.thingId.trim()));
    }

    /**
     * @param image upload the specified Thing's image
     */
    uploadImage(image) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.props.uploadImage(this.props.thing.id, 'thing', image)
                .then(() => {
                    this.setState({
                        imageError: false,
                        imageToUpload: e.target.result,
                    });
                }).catch((error) => {
                    return error;
                });
        };
        reader.readAsDataURL(image);
    }

    /**
     * @param event a SyntheticEvent (https://facebook.github.io/react/docs/events.html).
     */
    handleImageError(event) {
        this.setState({ imageError: true });
    }

    buildOwnerFilterBy = memoize((id: number, isAdmin: boolean) => {
        const filters = [
            { field: 'id', op: '<>', value: id }
        ];
        if (!isAdmin) {
            filters.push({ field: 'active', op: '=', value: true });
        }
        return filters;
    });

    buildLocationForm = memoize((locationInfo, iconName, iconColor, location, handleChange) => {
        const iconInfo = { name: iconName, color: iconColor };
        return <LocationForm
            name="locationInfo"
            value={locationInfo || {}}
            iconInfo={iconInfo}
            location={location}
            onChange={handleChange}
        />;
    });

    /**
     * Lifecycle hook.
     * @returns {XML}
     */
    render(): Object {
        const { userProfile, location, isLoading } = this.props;
        const { permissions, isAdmin } = userProfile;
        const permissionsSet = new Set(permissions || []);
        const canEdit = isAdmin || permissionsSet.has('entity.thing.edit');
        const {
            id, thingId, name, description, iconName, iconColor, createdDate, modifiedDate,
            image, dataOwner, parent, organisation, active, enableGis, locationInfo,
        } = this.state.thingForm || {};

        const imageSrc = this.state.imageToUpload || image;
        return (
            <Fragment>
                <ContentArea>
                    <Form onSubmit={this.onFormSubmit} id="form">
                        <Container width="1024">
                            <Card
                                collapsible
                                collapsed={this.props.allOpen}
                                title="Basic"
                                description={
                                    <div>
                                        <Field
                                            label="ID"
                                            id="id"
                                            name="id"
                                            type="number"
                                            placeholder=""
                                            value={id}
                                            disabled
                                        />
                                        <Field
                                            label="Last Modified"
                                            type="datetime"
                                            id="modified"
                                            placeholder=""
                                            name="modifiedDate"
                                            value={formatDate(modifiedDate)}
                                            disabled
                                        />
                                        <Field
                                            name="createdDate"
                                            label="Created On"
                                            type="datetime"
                                            id="created"
                                            placeholder=""
                                            value={formatDate(createdDate)}
                                            disabled
                                        />
                                        <Field
                                            label="Unique External Reference"
                                            name="thingId"
                                            value={thingId}
                                            onChange={this.handleChange}
                                            disabled={!canEdit}
                                            title="Max 60 characters"
                                            maxLength="60"
                                        />
                                    </div>
                                }
                            />
                            <Card
                                collapsible
                                collapsed={this.props.allOpen}
                                title="Thing Details"
                                description={
                                    <div>
                                        <ImageUploader
                                            title="Upload image"
                                            image={imageSrc}
                                            isUploading={isLoading}
                                            uploadFunction={this.uploadImage}
                                            canEdit={canEdit}
                                            name={name}
                                        />

                                        <Field
                                            label="Name"
                                            name="name"
                                            placeholder="Name"
                                            value={name}
                                            onChange={this.handleChange}
                                            pattern=".{3,60}"
                                            required
                                            title="3 to 60 characters"
                                            disabled={!canEdit}
                                        />

                                        <UserAutocomplete
                                            name="dataOwner"
                                            label="Data Owner"
                                            value={dataOwner}
                                            onChange={this.handleChange}
                                            required
                                            disabled={!canEdit}
                                            filterBy={isAdmin ? null : [{ field: 'active', op: '=', value: true }]}
                                        />

                                        <ThingAutocomplete
                                            label="Parent"
                                            name="parent"
                                            value={parent}
                                            onChange={this.handleChange}
                                            disabled={!canEdit}
                                            filterBy={this.buildOwnerFilterBy(id, isAdmin)}
                                        />

                                        <OrganisationAutocomplete
                                            label="Organisation"
                                            name="organisation"
                                            value={organisation}
                                            onChange={this.handleChange}
                                            disabled={!canEdit}
                                            filterBy={isAdmin ? null : [{ field: 'active', op: '=', value: true }]}
                                        />

                                        <IconsSelect
                                            name="iconName"
                                            label="Icon"
                                            value={iconName}
                                            onChange={this.handleChange}
                                            disabled={!canEdit}
                                        />
                                        <ColorPicker
                                            label="Icon Color"
                                            name="iconColor"
                                            placeholder="Icon Color"
                                            value={iconColor}
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
                                                checked={active}
                                                onChange={this.handleChange}
                                                disabled={!canEdit}
                                            />
                                            &nbsp;&nbsp;
                                            <Checkbox
                                                label="Show on Situational Awareness"
                                                name="enableGis"
                                                checked={enableGis}
                                                onChange={this.handleChange}
                                                disabled={!canEdit}
                                            />
                                        </CheckboxContainer>
                                        <Field
                                            label="Description"
                                            name="description"
                                            value={description}
                                            placeholder="..."
                                            onChange={this.handleChange}
                                            disabled={!canEdit}
                                        />
                                    </div>
                                }
                            />

                            <Card
                                collapsible
                                collapsed={this.props.allOpen}
                                title="Location"
                                description={this.buildLocationForm(
                                    locationInfo,
                                    iconName,
                                    iconColor,
                                    location,
                                    this.handleChange,
                                )}
                            />
                        </Container>
                    </Form>
                </ContentArea>
                {!canEdit ? null : (
                    <FooterBar>
                        <div>
                            <TextIcon icon="content-save" label="Save" color="primary" form="form" type="submit"/>
                        </div>
                    </FooterBar>
                )}
            </Fragment>
        );
    }
}

const mapStateToProps = (state: Object, props: Object) => ({
    thing: get(state.entities.things.details.data, 'thing'),
    isLoading: state.entities.things.details.isLoading,
    imageData: get(state.entities.things.details.data, 'thing'),
    userProfile: state.user.profile,
});

export default connect(
    mapStateToProps,
    { saveThing, uploadImage },
)(ThingAbout);
