// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure, setPropTypes } from 'recompose';
import L from 'leaflet';
import { Cluster4, Cluster3, Cluster2, Cluster1, DefaultSvgMarker } from './MapIcons';

const LocationsList = ({ locations, toggleDetail }) => {
    // console.log('locations', locations);
    return locations.map((location, i) => {
        const point = new L.Point(location.latitude, location.longitude);
        const coord = L.Projection.SphericalMercator.unproject(point);
        const id = 16329;
        const { properties } = location;
        // So we have fucked up data for showing marker status, so now bs to fix
        const priorityLevels = [
            { priority_1_sitecount: properties.proc_inst_priority_1_sitecount },
            { priority_2_sitecount: properties.proc_inst_priority_2_sitecount },
            { priority_3_sitecount: properties.proc_inst_priority_3_sitecount },
            { priority_4_sitecount: properties.proc_inst_priority_4_sitecount }
        ];
        let clusterType = 0;
        const levels = [];
        // eslint-disable-next-line array-callback-return
        priorityLevels.map((level) => {
            if (Number(Object.values(level)) > 0) {
                clusterType++;
                levels.push(level);
            }
        });

        if (properties.status_id === 'CLUSTER') {

            if (clusterType === 1) {
                return <Cluster1
                    name={location.title}
                    position={coord}
                    key={coord + i}
                    priorityLevels={levels}
                    onClick={() => toggleDetail(id)}
                />;
            }

            if (clusterType === 2) {
                return <Cluster2
                    name={location.title}
                    position={coord}
                    key={coord + i}
                    priorityLevels={levels}
                    onClick={() => toggleDetail(id)}
                />;
            }

            if (clusterType === 3) {
                return <Cluster3
                    name={location.title}
                    position={coord}
                    key={coord + i}
                    priorityLevels={levels}
                    onClick={() => toggleDetail(id)}
                />;
            }

            if (clusterType === 4) {
                return <Cluster4
                    name={location.title}
                    position={coord}
                    key={coord + i}
                    priorityLevels={levels}
                    onClick={() => toggleDetail(id)}
                />;
            }

        }

        if (properties.status_id !== 'CLUSTER') { // We should load correct icons depending on type
            return <DefaultSvgMarker
                name={location.title}
                priority={location.priority}
                position={coord}
                key={coord + i}
                onClick={() => toggleDetail(id)}
            />;
        }
        return null;
    });
};

export default compose(pure, setPropTypes({
    locations: PropTypes.array.isRequired,
    toggleDetail: PropTypes.func
}))(LocationsList);
