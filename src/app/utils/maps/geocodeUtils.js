// @flow
import { isDefined } from 'app/utils/utils';

const API_KEY = 'AIzaSyBn4zixY8-GRFxLxifzO2jyrrqCRW4qn7Q';
const GOOGLE_API = 'https://maps.google.com/maps/api/geocode/json';

/**
 *
 */
class GeoCoding {
    /**
     * async fromLatLng - description
     *
     * @param  {type} lat    description
     * @param  {type} lng    description
     * @param  {type} apiKey description
     * @return {type}        description
     */
    fromLatLong = async (lat: number, lng: number, apiKey: string = API_KEY) => {
        if (!isDefined(lat) || !isDefined(lng)) {
            return Promise.reject(new Error('Provided coordinates are invalid'));
        }

        const latLng = `${lat},${lng}`;
        let url = `${GOOGLE_API}?latlng=${encodeURI(latLng)}`;
        url += `&key=${apiKey}`;
        return this.handleUrl(url);
    };

    /**
     * async fromAddress - description
     *
     * @param  {type} address description
     * @param  {type} apiKey  description
     * @return {type}         description
     */
    fromAddress = async (address: string, apiKey: string = API_KEY) => {
        if (!address) {
            return Promise.reject(new Error('Provided address is invalid'));
        }

        let url = `${GOOGLE_API}?address=${encodeURI(address)}`;
        url += `&key=${apiKey}`;
        return this.handleUrl(url);
    };

    /**
     * async handleUrl - description
     *
     * @param  {type} url: string description
     * @return {type}             description
     */
    handleUrl = async (url: string) => {
        const response = await fetch(url).catch(error => Promise.reject(new Error('Error fetching data')));

        const json = await response.json().catch(() => {
            return Promise.reject(new Error('Error parsing server response'));
        });

        if (json.status === 'OK') {
            return json;
        }
        return Promise.reject(new Error(`Server returned status code ${json.status}`));
    };

    /**
     * show the user current position
     */
    getCurrentLocation = (onSuccess: Function, onError: Function) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }
    };

    /**
     * This function will be used to
     * convert Degree Minutes Seconds
     * to decimal format like 24.44
     */
    convertDMSToDD = (degrees: number = 0, minutes: number = 0, seconds: number = 0, direction: string) => {
        let dd = (degrees || 0) + (minutes || 0) / 60 + (seconds || 0) / (60 * 60);
        if (direction === 'S' || direction === 'W') {
            dd = dd * -1;
        }
        return dd;
    };

    /**
     * This function will be used to convert
     * decimal format to degree minutes and
     * secods format
     */
    convertDDtoDMS = (name: string, dd: number) => {
        const degrees = parseInt(dd, 10);
        const minutes = parseInt((dd - degrees) * 60, 10);
        // const seconds = parseInt((dd - degrees - minutes / 60) * 3600, 10);
        const seconds = (dd - degrees - minutes / 60) * 3600;
        let direction = '';
        if (name === 'latitude') direction = dd > 0 ? 'N' : 'S';
        if (name === 'longitude') direction = dd > 0 ? 'E' : 'W';
        return { degrees: Math.abs(degrees), minutes: Math.abs(minutes), seconds: Math.abs(seconds), direction };
    };

    /**
     * It will take the address_components from
     * geo code response and convert it to the
     * Address object with all required fields
     */
    getAddress = (address_components: Array<Object> = []) => {
        const address = { province: '', city: '', country: '', code: '', line1: '', line2: '' };
        if (!address_components.length) return address;
        address_components.forEach(({ types, long_name }) => {
            if (types.includes('administrative_area_level_1')) address.province = long_name;
            if (types.includes('administrative_area_level_2')) address.city = long_name;
            if (types.includes('country')) address.country = long_name.toUpperCase();
            if (types.includes('postal_code')) address.code = long_name;
            if (types.includes('sublocality') || types.includes('locality')) address.line2 = address.line2 ? `${address.line2} ${long_name}` : long_name;
            if (types.includes('street_number') || types.includes('route')) address.line1 = address.line1 ? `${address.line1} ${long_name}` : long_name;
        });
        return address;
    };

    /**
     * This function will check whether the latitude is vlaid or not
     */
    isValidLatitute = (latitude: number | string) => {
        const patt = new RegExp('^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,15})?))$');
        if (!patt.test(String(latitude))) {
            return false;
        }
        return true;
    };

    /**
     * This function will check whether the longitude is vlaid or not
     */
    isValidLongitute = (longitude: number | string) => {
        const patt = new RegExp('^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,15})?))$');
        if (!patt.test(String(longitude))) {
            return false;
        }
        return true;
    };
}

const Geocode = new GeoCoding();

export default Geocode;
