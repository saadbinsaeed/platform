/* @flow */

import PropTypes from 'prop-types';

/**
 * Renders the location info inside of an ag-grid.
 *
 * @param props the Component's properties
 */
const LocationValue = ( { value }: Object ) => {
    if (!value) {
        return null;
    }

    const { address, longitude, latitude } = value || {};
    if ( address ) {
        const line1 = address.line1 ? `${address.line1}, ` : '';
        const line2 = address.line2 ? `${address.line2}, ` : '';
        const code = address.code ? `${address.code}, ` : '';
        const city = address.city ? `${address.city}, ` : '';
        const province = address.province ? `${address.province}, ` : '';
        const country = address.country ? `${address.country}` : '';
        return `${line1}${line2}${city}${province}${code}${country}`;
    }

    if ( longitude && latitude ) {
        return `${longitude} - ${latitude}`;
    }
    return null;
};
LocationValue.propTypes = {
    value: PropTypes.object,
};

export default LocationValue;
