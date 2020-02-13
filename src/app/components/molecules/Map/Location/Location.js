/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import { SimpleMarker } from './SimpleMarker/SimpleMarker';
import { isDefined } from 'app/utils/utils';

/* Map configuration */
const mapOptions = (maps) => {
    return {
        mapTypeId: maps.MapTypeId.HYBRID,
        mapTypeControl: true,
        zoomControlOptions: {
            position: maps.ControlPosition.TOP_RIGHT,
            style: maps.ZoomControlStyle.SMALL,
        },
        mapTypeControlOptions: {
            position: maps.ControlPosition.TOP_RIGHT,
            style: maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [maps.MapTypeId.SATELLITE, maps.MapTypeId.HYBRID, maps.MapTypeId.TERRAIN],
        },
    };
};

/**
 * A map component
 */
export default class Location extends PureComponent<Object> {
    static propTypes = {
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        centerKey: PropTypes.number,
        writeMode: PropTypes.bool,
        onClick: PropTypes.func,
        iconInfo: PropTypes.object,
    };

    static defaultProps = {
        iconInfo: {},
    };

    static defaultProps = {
        color: '',
    }

    /**
     * onclick map will change the coordinates
     */
    mapClicked = (mapProps: Object) => {
        this.props.onClick(mapProps.lat, mapProps.lng);
    };

    /**
     * Lifecycle hook: Executed on component render.
     * @returns {XML}
     */
    render(): Object {
        const { latitude, longitude, iconInfo } = this.props;
        const noLocation = !isDefined(latitude) || !isDefined(longitude) || latitude === '' || longitude === '';

        if (noLocation) {
            return <span> No location is available. </span>;
        }
        const marker = !this.props.writeMode ? <SimpleMarker lat={latitude} lng={longitude} text={'Thing Location'} iconInfo={iconInfo} /> : null;
        return (
            <div style={{ height: '300px' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyBn4zixY8-GRFxLxifzO2jyrrqCRW4qn7Q', libraries: 'places' }}
                    center={{ lat: latitude, lng: longitude }}
                    defaultZoom={11}
                    options={mapOptions}
                    {...this.props}
                    onClick={this.mapClicked}
                >
                    {marker}
                </GoogleMapReact>
            </div>
        );
    }
}
