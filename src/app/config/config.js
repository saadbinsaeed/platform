/* @flow */

import Immutable from 'app/utils/immutable/Immutable';

/**
 * @private
 * Determines if the application is running in an iframe
 *
 * @return {boolean} - returns true if app is loaded in iFrame
 */
const isInIFrame = (): boolean => {
    return window.self !== window.top;
};

/**
 * @const {Map} CONFIG - map that contains the application configuration parameters
 */
const CONFIG: Object = Immutable( {
    API_ENTRY_POINT: window.localStorage.getItem( 'API_ENTRY_POINT' ) || '',
    BASE_PATH: 'platform',
    IN_IFRAME: isInIFrame(),
} );

export default CONFIG;
