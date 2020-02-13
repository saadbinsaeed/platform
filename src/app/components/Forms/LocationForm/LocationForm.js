/* @flow */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

import DirectoriesDropdown from 'app/containers/Common/DropDowns/DirectoriesDropdown/DirectoriesDropdown';
import Field from 'app/components/molecules/Field/Field';
import Button from 'app/components/atoms/Button/Button';
import Location from 'app/components/molecules/Map/Location/Location';
import Radio from 'app/components/atoms/Radio/Radio';
import Dropdown from 'app/components/atoms/Dropdown/Dropdown';
import Label from 'app/components/molecules/Label/Label';
import { Col, Row } from 'react-styled-flexboxgrid';
import { set } from 'app/utils/immutable/Immutable';
import { createEvent } from 'app/utils/http/event';
import { get } from 'app/utils/lo/lo';
import { LocationInfo } from 'app/utils/types/interfaces';
import Geocode from 'app/utils/maps/geocodeUtils';
import { showToastr } from 'store/actions/app/appActions';
import { stripUnwanted } from 'app/utils/string/string-utils';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';

const WAIT_INTERVAL = 1000;

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;

const LatLongChar = styled(Label)`
    margin-top: 3px;
    margin-left: 0;
    font-size: 25px;
`;

const ButtonContainer = styled.div`
    display: flex;
`;

/**
 * Renders a location form to allow a user to change address and location.
 */
class LocationForm extends Component<Object, Object> {
    static propTypes: Object = {
        value: PropTypes.object,
        iconInfo: PropTypes.object,
        name: PropTypes.string,
        onChange: PropTypes.func,
        addressOnlyFields: PropTypes.bool,
        showToastr: PropTypes.func
    };

    static defaultProps = {
        addressOnlyFields: false,
        value: {}
    };

    state = { locationKey: 0 };
    timer: TimeoutID;
    locationRef = React.createRef();

    /**
     * Handle a form change
     * @param event
     */
    handleChange = (event: Object) => {
        const { name, type } = event.target;
        let { value } = event.target;
        const is_manual = get(this.props.value, 'is_manual');
        if (type === 'number') {
            if ((name === 'latitude' || name === 'lat.degrees') && value.length > 1) {
                if (!Geocode.isValidLatitute(value)) {
                    return;
                }
            }
            if ((name === 'longitude' || name === 'long.degrees') && value.length > 1) {
                if (!Geocode.isValidLongitute(value)) {
                    return;
                }
            }
            value = value && parseFloat(value);
            if (name === 'latitude' || name === 'longitude') {
                const updatedLocationInfo = set(this.props.value, name, value);
                this.onChange(updatedLocationInfo);
                !is_manual && this.handleLatLongChange(updatedLocationInfo);
                return;
            }
        } else {
            value = stripUnwanted(value);
        }
        let updatedLocationInfo = set(this.props.value, name, value);
        const { lat = {}, long = {} } = updatedLocationInfo;
        if (name.includes('lat')) {
            if (!this.isValidValues(lat.seconds)) return;
            if (!this.isValidValues(lat.minutes)) return;
            const latitude = Geocode.convertDMSToDD(lat.degrees, lat.minutes, lat.seconds, lat.direction);
            updatedLocationInfo = set(updatedLocationInfo, 'latitude', latitude);
            !is_manual && this.handleLatLongChange(updatedLocationInfo);
        }
        if (name.includes('long')) {
            if (!this.isValidValues(long.seconds)) return;
            if (!this.isValidValues(long.minutes)) return;
            const longitude = Geocode.convertDMSToDD(long.degrees, long.minutes, long.seconds, long.direction);
            updatedLocationInfo = set(updatedLocationInfo, 'longitude', longitude);
            !is_manual && this.handleLatLongChange(updatedLocationInfo);
        }
        this.onChange(updatedLocationInfo);

        // if any address field changed we will change the coordinates
        if (name.includes('address')) {
            this.handleAddressChange(updatedLocationInfo); // To minimize the call on name change however it wont have any impact
        }
    };

    /**
     * componentDidMount - description
     *
     * @return {type}  description
     */
    componentDidMount() {
        const { location } = this.props;
        if (location && location.state && location.state.scrollIntoView) {
            this.locationRef.current && this.locationRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    isValidValues = (value: number) => {
        if (value < 0 || value >= 59.9999) {
            this.props.showToastr({ severity: 'warn', detail: 'Please enter the valid value (0-60) in seconds' });
            return false;
        }
        return true;
    };
    /**
     * Converting the decimal format to DMS
     * and saving it the object
     */
    setDDToDMS = (updatedLocationInfo: Object) => {
        const { latitude, longitude } = updatedLocationInfo;
        const lat = Geocode.convertDDtoDMS('latitude', latitude);
        const long = Geocode.convertDDtoDMS('longitude', longitude);
        updatedLocationInfo = set(updatedLocationInfo, 'lat', lat);
        updatedLocationInfo = set(updatedLocationInfo, 'long', long);
        return updatedLocationInfo;
    };

    /**
     * Emit a change to parent.
     * @param locationInfo
     */
    onChange = (locationInfo: LocationInfo) => {
        if (this.props.onChange) {
            const name = this.props.name;
            const value = locationInfo;
            const event = createEvent('change', { name, value });
            this.props.onChange(event);
        }
    };

    handleLatLongChange = (updatedLocationInfo: Object) => {
        clearTimeout(this.timer);
        const lat = Number(get(updatedLocationInfo, 'latitude'));
        const long = Number(get(updatedLocationInfo, 'longitude'));
        this.timer = setTimeout(() => {
            Geocode.fromLatLong(lat, long).then(
                (response) => {
                    // const adrs = response.results[0].formatted_address;
                    const address = Geocode.getAddress(response.results[0].address_components);
                    updatedLocationInfo = set(updatedLocationInfo, 'address', { add_type: 'Physical', ...address });
                    this.onChange(updatedLocationInfo);
                },
                (error) => {
                    const address = Geocode.getAddress();
                    updatedLocationInfo = set(updatedLocationInfo, 'address', { add_type: 'Physical', ...address });
                    this.onChange(updatedLocationInfo);
                }
            );
        }, WAIT_INTERVAL);
    };

    /**
     *
     */
    handleAddressChange = (updatedLocationInfo: Object) => {
        const is_manual = get(this.props.value, 'is_manual');
        clearTimeout(this.timer);
        const adresString = this.getAddressInput(updatedLocationInfo);
        this.timer = setTimeout(() => {
            Geocode.fromAddress(adresString).then(
                (response) => {
                    const { lat, lng } = response.results[0].geometry.location;
                    updatedLocationInfo = set(this.props.value, 'latitude', lat);
                    updatedLocationInfo = set(updatedLocationInfo, 'longitude', lng);
                    !is_manual && this.onChange(updatedLocationInfo);
                    this.centerMap();
                },
                (error) => {
                    // console.log(error);
                }
            );
        }, WAIT_INTERVAL);
    };

    /**
     *
     */
    getAddressInput = (updatedLocationInfo: Object) => {
        const line1 = updatedLocationInfo.address['line1'];
        const line2 = updatedLocationInfo.address['line2'];
        const code = updatedLocationInfo.address['code'];
        const city = updatedLocationInfo.address['city'];
        const province = updatedLocationInfo.address['province'];
        const country = updatedLocationInfo.address['country'];
        return `${line1} ${line2} ${code} ${city} ${province} ${country}`;
    };

    /**
     * Send updated map location
     */
    centerMap = () => {
        this.setState({ locationKey: this.state.locationKey + 1 });
    };

    myLocation = () => {
        Geocode.getCurrentLocation(this.myCurrentLocation, this.myCurrentlocationError);
    };

    /**
     * params position
     */
    myCurrentLocation = (position: Object) => {
        let updatedLocationInfo = set(this.props.value, 'latitude', position.coords.latitude);
        updatedLocationInfo = set(updatedLocationInfo, 'longitude', position.coords.longitude);
        this.onChange(updatedLocationInfo);
        this.handleLatLongChange(updatedLocationInfo);
    };

    onMapClick = (lat: number, lng: number) => {
        const is_manual = get(this.props.value, 'is_manual');
        let updatedLocationInfo = set(this.props.value, 'latitude', lat);
        updatedLocationInfo = set(updatedLocationInfo, 'longitude', lng);

        this.onChange(updatedLocationInfo);
        !is_manual && this.handleLatLongChange(updatedLocationInfo);
    };

    myCurrentlocationError = () => {
        this.props.showToastr({ severity: 'error', detail: 'Could not get your location, please allow location tracking in your browser' });
    };

    /**
     * Lifecycle hook.
     * @returns {XML}
     */
    render(): Object {
        const locationInfo = this.props.value || {};
        const { lat = {}, long = {} } = this.setDDToDMS(locationInfo);

        const latitude = get(locationInfo, 'latitude');
        const longitude = get(locationInfo, 'longitude');
        const name = get(locationInfo, 'name');
        const { field = 'DegDec' } = locationInfo;
        const isMinDec = field === 'MinDec';
        const colSize = !isMinDec ? 3 : 4;
        return (
            <div>
                {!this.props.addressOnlyFields && (
                    <div ref={this.locationRef}>
                        <Location
                            latitude={latitude}
                            longitude={longitude}
                            onClick={this.onMapClick}
                            key={this.state.locationKey}
                            iconInfo={this.props.iconInfo}

                        />

                        <Field label="Name" name="name" value={name} onChange={this.handleChange} type="text" placeholder="Name" />
                        {field === 'DegDec' ? (
                            <Fragment>
                                <Field
                                    label="Latitude"
                                    placeholder="Latitude"
                                    name="latitude"
                                    value={latitude}
                                    onChange={this.handleChange}
                                    type="number"
                                    title="Numbers only"
                                />
                                <Field
                                    label="Longitude"
                                    placeholder="Longitude"
                                    name="longitude"
                                    value={longitude}
                                    onChange={this.handleChange}
                                    type="number"
                                    title="Numbers only"
                                />
                            </Fragment>
                        ) : null}
                        {field === 'DMS' || field === 'MinDec' ? (
                            <Fragment>
                                <Label>Latitude</Label>
                                <div>
                                    <Row>
                                        <Col lg={colSize} md={colSize} sm={12} xs={12}>
                                            <Row>
                                                <Col lg={11} md={11} sm={11} xs={11}>
                                                    <Field
                                                        name="lat.degrees"
                                                        value={lat.degrees}
                                                        onChange={this.handleChange}
                                                        type="number"
                                                        placeholder="D"
                                                        min="0"
                                                        title="Numbers only"
                                                    />
                                                </Col>
                                                <Col lg={1} md={1} sm={1} xs={1}>
                                                    <LatLongChar>°</LatLongChar>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={colSize} md={colSize} sm={12} xs={12}>
                                            <Row>
                                                <Col lg={11} md={11} sm={11} xs={11}>
                                                    {isMinDec ? (
                                                        <Field
                                                            name="lat.minutes"
                                                            value={lat.minutes + lat.seconds / 100}
                                                            onChange={this.handleChange}
                                                            type="number"
                                                            placeholder="M"
                                                            min="0"
                                                            max="60"
                                                            step="any"
                                                            title="Numbers only"
                                                        />
                                                    ) : (
                                                        <Field
                                                            name="lat.minutes"
                                                            value={Math.round(lat.minutes)}
                                                            onChange={this.handleChange}
                                                            type="number"
                                                            placeholder="M"
                                                            min="0"
                                                            max="59"
                                                            title="Numbers only"
                                                        />
                                                    )}
                                                </Col>
                                                <Col lg={1} md={1} sm={1} xs={1}>
                                                    <LatLongChar>{`'`}</LatLongChar>
                                                </Col>
                                            </Row>
                                        </Col>
                                        {!isMinDec ? (
                                            <Col lg={colSize} md={colSize} sm={12} xs={12}>
                                                <Row>
                                                    <Col lg={11} md={11} sm={11} xs={11}>
                                                        <Field
                                                            name="lat.seconds"
                                                            value={lat.seconds}
                                                            onChange={this.handleChange}
                                                            type="number"
                                                            placeholder="S"
                                                            title="Numbers only"
                                                        />
                                                    </Col>
                                                    <Col lg={1} md={1} sm={1} xs={1}>
                                                        <LatLongChar>{`''`}</LatLongChar>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        ) : null}

                                        <Col lg={colSize} md={colSize} sm={12} xs={12}>
                                            <Dropdown
                                                name="lat.direction"
                                                placeholder="Select.."
                                                onChange={this.handleChange}
                                                closeOnChange
                                                value={lat.direction}
                                                clearable={false}
                                                options={[{ label: 'N', value: 'N' }, { label: 'S', value: 'S' }]}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <Label>Longitude</Label>
                                <div>
                                    <Row>
                                        <Col lg={colSize} md={colSize} sm={12} xs={12}>
                                            <Row>
                                                <Col lg={11} md={11} sm={11} xs={11}>
                                                    <Field
                                                        name="long.degrees"
                                                        value={long.degrees}
                                                        onChange={this.handleChange}
                                                        type="number"
                                                        placeholder="D"
                                                        min="0"
                                                        title="Numbers only"
                                                    />
                                                </Col>
                                                <Col lg={1} md={1} sm={1} xs={1}>
                                                    <LatLongChar>°</LatLongChar>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={colSize} md={colSize} sm={12} xs={12}>
                                            <Row>
                                                <Col lg={11} md={11} sm={11} xs={11}>
                                                    {isMinDec ? (
                                                        <Field
                                                            name="long.minutes"
                                                            value={long.minutes + long.seconds / 100}
                                                            onChange={this.handleChange}
                                                            type="number"
                                                            placeholder="M"
                                                            min="0"
                                                            max="60"
                                                            step="any"
                                                            title="Numbers only"
                                                        />
                                                    ) : (
                                                        <Field
                                                            name="long.minutes"
                                                            value={Math.round(long.minutes)}
                                                            onChange={this.handleChange}
                                                            type="number"
                                                            placeholder="M"
                                                            min="0"
                                                            max="59"
                                                            title="Numbers only"
                                                        />
                                                    )}
                                                </Col>
                                                <Col lg={1} md={1} sm={1} xs={1}>
                                                    <LatLongChar>{`'`}</LatLongChar>
                                                </Col>
                                            </Row>
                                        </Col>
                                        {!isMinDec ? (
                                            <Col lg={colSize} md={colSize} sm={12} xs={12}>
                                                <Row>
                                                    <Col lg={11} md={11} sm={11} xs={11}>
                                                        <Field
                                                            name="long.seconds"
                                                            value={long.seconds}
                                                            onChange={this.handleChange}
                                                            type="number"
                                                            placeholder="S"
                                                            title="Numbers only"
                                                        />
                                                    </Col>
                                                    <Col lg={1} md={1} sm={1} xs={1}>
                                                        <LatLongChar>{`''`}</LatLongChar>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        ) : null}
                                        <Col lg={colSize} md={colSize} sm={12} xs={12}>
                                            <Dropdown
                                                name="long.direction"
                                                placeholder="Select.."
                                                onChange={this.handleChange}
                                                closeOnChange
                                                value={long.direction}
                                                fluid
                                                selection
                                                clearable={false}
                                                options={[{ label: 'E', value: 'E' }, { label: 'W', value: 'W' }]}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </Fragment>
                        ) : null}
                        <Container>
                            <Radio
                                label="DegDec"
                                name="DegDec"
                                checked={field === 'DegDec' || false}
                                onChange={() => this.handleChange(createEvent('change', { name: 'field', value: 'DegDec' }))}
                            />
                            &nbsp;&nbsp; {/* TEMPORARY FIX -  By applying margin or padding disturbs the position of label */}
                            <Radio
                                label="DMS"
                                name="DMS"
                                checked={field === 'DMS' || false}
                                onChange={() => this.handleChange(createEvent('change', { name: 'field', value: 'DMS' }))}
                            />
                            &nbsp;&nbsp;
                            <Radio
                                label="MinDec"
                                name="MinDec"
                                checked={field === 'MinDec' || false}
                                onChange={() => this.handleChange(createEvent('change', { name: 'field', value: 'MinDec' }))}
                            />
                        </Container>
                        {/*<Select label="Lat/Long Type" placeholder="Select type" fluid search selection value="DMS" options={[]} disabled />*/}
                        <ButtonContainer>
                            <Checkbox
                                label="Custom Address"
                                name="is_manual"
                                title="Enter your custom address details on the fields below"
                                checked={get(locationInfo, 'is_manual')}
                                onChange={this.handleChange}
                            />
                            <Button color="primary" onClick={this.centerMap} type="button">
                                {' '}
                                Center map
                            </Button>
                            <Button color="primary" onClick={this.myLocation} type="button">
                                {' '}
                                My location
                            </Button>
                        </ButtonContainer>
                    </div>
                )}

                <Field
                    label="Address Line 1"
                    placeholder="Address Line 1"
                    type="text"
                    name="address.line1"
                    value={get(locationInfo, 'address.line1')}
                    onChange={this.handleChange}
                />

                <Field
                    label="Address Line 2"
                    placeholder="Address Line 2"
                    type="text"
                    name="address.line2"
                    value={get(locationInfo, 'address.line2')}
                    onChange={this.handleChange}
                />

                <Field label="City" name="address.city" placeholder="City" value={get(locationInfo, 'address.city')} onChange={this.handleChange} />

                <Field
                    label="State/Province"
                    name="address.province"
                    placeholder="State/Province"
                    value={get(locationInfo, 'address.province')}
                    onChange={this.handleChange}
                />

                <Field
                    label="Post/Zip Code"
                    name="address.code"
                    placeholder="Post/Zip Code"
                    value={get(locationInfo, 'address.code')}
                    onChange={this.handleChange}
                />

                <DirectoriesDropdown
                    label="Country"
                    name="address.country"
                    directoryType="country"
                    valueField="label"
                    value={get(locationInfo, 'address.country')}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

export default connect(
    null,
    { showToastr }
)(LocationForm);
