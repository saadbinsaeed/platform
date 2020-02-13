/* @flow */
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import memoize from 'memoize-one';
import styled from 'styled-components';

import Card from 'app/components/molecules/Card/Card';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import ColorPicker from 'app/components/molecules/ColorPicker/ColorPicker';
import Container from 'app/components/atoms/Container/Container';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import CustomEntitesAutocomplete from 'app/components/molecules/Autocomplete/CustomEntitesAutocomplete';
import Field from 'app/components/molecules/Field/Field';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import Form from 'app/components/atoms/Form/Form';
import IconsSelect from 'app/components/molecules/IconsSelect/IconsSelect';
import ImageUploader from 'app/components/molecules/ImageUploader/ImageUploader';
import Immutable from 'app/utils/immutable/Immutable';
import LocationForm from 'app/components/Forms/LocationForm/LocationForm';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import UserAutocomplete from 'app/components/molecules/Autocomplete/UserAutocomplete';
import { formatDate } from 'app/utils/date/date';
import { saveCustomEntity } from 'store/actions/entities/customEntitiesActions';
import { set } from 'app/utils/lo/lo';
import { stripUnwanted } from 'app/utils/string/string-utils';
import { uploadImage } from 'store/actions/entities/entitiesActions';
import { get } from 'app/utils/lo/lo';

const CheckboxContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

/**
 * The Custom Entity About Tab.
 */
class CustomEntityAbout extends PureComponent<Object, Object> {
    state: Object;

    static propTypes: Object = {
        customEntity: PropTypes.object.isRequired,
        saveCustomEntity: PropTypes.func.isRequired,
        uploadImage: PropTypes.func,
        isLoading: PropTypes.bool,
        allOpen: PropTypes.bool,
        userProfile: PropTypes.object,
    };

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);

        this.state = { entityForm: Immutable(props.customEntity), imageError: false };

        (this: Object).handleChange = this.handleChange.bind(this);
        (this: Object).onFormSubmit = this.onFormSubmit.bind(this);
        (this: Object).uploadImage = this.uploadImage.bind(this);
        (this: Object).handleImageError = this.handleImageError.bind(this);
    }

    /**
     * @override
     */
    componentDidUpdate(prevProps: Object) {
        if (prevProps.customEntity !== this.props.customEntity) {
            this.setState({ entityForm: Immutable(this.props.customEntity) });
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
        this.setState({ entityForm: set(this.state.entityForm, name, value) });
    }

    /**
     * Save the form.
     * @param event SyntheticEvent (https://facebook.github.io/react/docs/events.html)
     */
    onFormSubmit(event) {
        event.preventDefault();
        const { entityForm } = this.state;
        this.props.saveCustomEntity(entityForm);
    }

    /**
     * @param image upload the specified Entity's image
     */
    uploadImage(image) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.props.uploadImage(this.props.customEntity.id, 'custom', image)
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
        const canEdit = isAdmin || permissionsSet.has('entity.custom.edit');

        const { id, name, description, iconName, iconColor, createdDate, modifiedDate, image, dataOwner, parent, active, enableGis, locationInfo } =
        this.state.entityForm || {};

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
                                    </div>
                                }
                            />
                            <Card
                                collapsible
                                collapsed={this.props.allOpen}
                                title="Custom Entity Details"
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

                                        <CustomEntitesAutocomplete
                                            label="Parent"
                                            name="parent"
                                            value={parent}
                                            onChange={this.handleChange}
                                            disabled={!canEdit}
                                            filterBy={this.buildOwnerFilterBy(id, isAdmin)}
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
    customEntity: get(state.entities.customEntities.details.data, 'customEntity'),
    isLoading: state.entities.customEntities.details.isLoading,
    userProfile: state.user.profile,
});

export default connect(
    mapStateToProps,
    { saveCustomEntity, uploadImage },
)(CustomEntityAbout);
