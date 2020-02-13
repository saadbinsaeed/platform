// @flow
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { geolocated } from 'react-geolocated';
// $FlowFixMe
import { withTheme } from 'styled-components';
// $FlowFixMe
import { Map, TileLayer, FeatureGroup  } from 'react-leaflet';
// $FlowFixMe
import { EditControl } from 'react-leaflet-draw';
// $FlowFixMe
import MeasureControl from 'react-leaflet-measure';
import Drawer from 'app/components/atoms/Drawer/Drawer';
import DrawerDetail from './DrawerDetail';
// $FlowFixMe
import ErrorBoundary from 'app/components/atoms/ErrorBoundary/ErrorBoundary';
import { MyMarker } from './MapIcons';
import LocationsList from './LocationsList';

const measureOptions = {
    position: 'topright',
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: 'acres',
    activeColor: '#db4a29',
    completedColor: '#9b2d14'
};

const MapComponent = styled.div`
    width: ${props => props.width};
    height: ${props => props.height};
    min-width: ${props => props.width};
    min-height: ${props => props.height};
`;
/**
 * A map component to show locations on a map, including the location of myself.
 */
class GeoMap extends PureComponent<Object, Object> {
    /**
     * Set our default state
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            positioning: {},
            locations: [],
            filters: [],
            detailOpen: false,
        };
    }
    static propTypes = {
        isGeolocationAvailable: PropTypes.bool,
        isGeolocationEnabled: PropTypes.bool,
        coords: PropTypes.object,
        locations: PropTypes.array,
        showMyLocation: PropTypes.bool,
        width: PropTypes.string,
        height: PropTypes.string,
        loadData: PropTypes.func,
        loadDetail: PropTypes.func,
    };
    /**
     * Update component if passed props change
     */
    componentWillUpdate(nextProps) {
        if (this.state.locations !== nextProps.locations) {
            this.setState({locations: nextProps.locations});
            this.forceUpdate();
        }
        if (this.props.filters !== nextProps.filters) {
            this.setState({ filters: nextProps.filters });
            this.loadDataWithParams();
        }
    }

    handleViewport = (event) => {
        this.loadDataWithParams(event);
    };

    toggleDetail = (id: number) => {
        // console.log('toggleDetail', id);
        id && this.fetchDetailData(id);
        this.setState({ detailOpen: !this.state.detailOpen });
    };

    fetchDetailData = (id) => {
        if (this.props.loadDetail) { this.props.loadDetail(id); }
    };

    loadDataWithParams = (event) => {
        event && this.setState({ positioning: event });
        const map = this.refs.map.leafletElement;
        // console.log('map', map);
        const bounds = map.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const params = { ...this.state.positioning, filters: this.state.filters, bounds: { ne, sw } };

        this.props.loadData(params);
    };

    /**
     * Render the map
     */
    render() {
        // console.log('MapProps', this.props);
        // console.log('MapState', this.state);
        const { isGeolocationAvailable, isGeolocationEnabled, coords, showMyLocation, width, height, currentUser, detail } = this.props;
        const position = !isGeolocationAvailable || !isGeolocationEnabled || !coords ? [0, 0] : [this.props.coords.latitude, this.props.coords.longitude];
        return (
            <ErrorBoundary>
                <Drawer title="Detail" isOpen={this.state.detailOpen} isToggled={this.toggleDetail}>
                    <DrawerDetail info={detail} />
                </Drawer>
                <MapComponent width={width} height={height}>
                    <Map preferCanvas ref="map" center={position} zoom={3} style={{ width, height }} onViewportChanged={this.handleViewport}>
                        <MeasureControl {...measureOptions} />
                        <FeatureGroup>
                            <EditControl
                                position='topright'
                                draw={{
                                    rectangle: false
                                }}
                            />
                            <TileLayer
                                url="http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                            />
                            <LocationsList locations={this.state.locations} toggleDetail={id => this.toggleDetail(id)} />
                            )}
                            {
                                (!isGeolocationAvailable || !isGeolocationEnabled || !coords) && !showMyLocation
                                    ? null :
                                    <MyMarker position={position} user={currentUser} />
                            }
                        </FeatureGroup>
                    </Map>
                </MapComponent>
            </ErrorBoundary>
        );
    }
}

export default withTheme(geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(GeoMap));
