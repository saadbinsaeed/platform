/* @flow */

/**
 * Utility to fetch data from the API_ENTRY_POINT
 */

import CONFIG from 'app/config/config';
import affectliSso from 'app/auth/affectliSso';

const fetch = window.fetch;

const extractMessage = (data: string | Object): string => {
    const error = data && data.errors && Array.isArray(data.errors) && data.errors[0];
    if (error && error.message) {
        return String(error.message);
    }
    const errorMessage = error ? String(error) : null;
    if ( errorMessage && errorMessage.indexOf('PSQLException ERROR:') === 0 ) {
        return errorMessage.replace(/PSQLException ERROR:([\s\S]*)Where([\s\S]*)/, '$1');
    }

    let message: string = String(data.message || data || '');
    if ( message.indexOf('dbExecutePreparedStatement:ERROR:') > 0 ) {
        const match = message.match(/dbExecutePreparedStatement:ERROR:([^<]*)</);
        return (match && match[ 1 ]) || 'Service error.';
    }
    if ( message.toLowerCase().indexOf('<b>message</b>') > 0 ) {
        const match = message.match(/<b>message<\/b>(.+)<b>description<\/b>/i);
        message = (match && match[1] && match[1].replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '')) || 'Service error.';
        if (message.includes('error with errorCode \'')) {
            const tokens = message.match(/error with errorCode '([^']+)'/);
            if (tokens && tokens.length > 1) {
                return tokens[1];
            }
        }
        if (message.includes('nested exception')) {
            const serverErrorMessage = message.split(':');
            return serverErrorMessage.length >= 2 ? serverErrorMessage[1] + serverErrorMessage[2] : message;
        }
    }

    // https://gitlab.mi-c3.com/affectli-project/affectli-support-issues/issues/7379
    // This error can be popped up in case of any duplication of a unique field
    // but as currently we only have one situation which is regarding email
    if(data && data.exception === 'HTTP 409 Conflict') {
        return 'Selected email is already in use by another user, please set unique email';
    }

    return message;
};


/**
 * @private
 *
 * Handle/normalize the server response.
 *
 * @return {Promise<any>} - returns a promise
 */
const handleResponse = (response: Object) =>
    response.text().then((text: string) => {
        let data = null;
        try {
            data = JSON.parse(text);
        } catch ( err ) {
            data = text;
        }
        if ( !response.ok ) {
            const error: Object = new Error(extractMessage(data));
            error.status = response.status;
            error.statusText = response.statusMessage;
            //FIXME: remove text.indexOf(...) >= 0 when the API are correctly returning 401
            if (error.status === 401 || text.indexOf('Cannot call sendError() after the response has been committed') >= 0) {
                if ( CONFIG.IN_IFRAME ) {
                    window.parent.location.reload();
                }
            }
            throw error;
        }
        return data;
    });

/**
 * @private
 *
 * Fetch the data from the API_ENTRY_POINT.
 *
 * @param {string} url - the request url
 * @param {string} requestType - the http methods to use
 * @param {Object} requestBody - the request body
 * @param {Object} headers - list of additional headers
 *
 * @return {Promise<any>} - returns a promise
 */
const fetchData = (url: string, requestType: ? string, requestBody: ? Object, headers: ? Object): Promise<any> => {

    return affectliSso.updateToken(5)
        .then(() => {
            const options: { method: string, headers: Object, body?: string } = { // $FlowFixMe
                method: requestType,
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Authorization: affectliSso.getBearerToken(),
                    ...( headers ),
                }),
            };

            if ( requestBody ) {
                options.body = JSON.stringify(requestBody);
            }
            return fetch(`${ CONFIG.API_ENTRY_POINT }/${ url }`, options);
        }).then((response: Object) => {
            return handleResponse(response);
        });
};

/**
 * @class
 *
 * Fetch the data from the API_ENTRY_POINT.
 */
export default class HttpFetch {

    /**
     * Method that is used to fetch the data using a GET.
     *
     * @param {string} uri - the request URI
     * @param {Object} headers - list of additional headers
     * @return {Promise<any>} - returns a promise
     * @throws Error
     */
    static getResource(uri: string, headers: ? Object): Promise<any> {
        if ( !uri ) throw new Error('URI is required parameter.');
        return fetchData(uri, 'get', null, headers);
    }

    /**
     * Method that is used to execute an HTTP DELETE.
     *
     * @param {string} uri - the request URI
     * @param {Object} headers - list of additional headers
     * @return {Promise<any>} - returns a promise
     */
    static deleteResource(uri: string, headers: ? Object): Promise<any> {
        if ( !uri ) throw new Error('URI is required parameter.');

        return fetchData(uri, 'delete', null, headers);
    }

    /**
     * Method that is used to fetch the data using a POST.
     *
     * @param {string} uri - the request URI
     * @param {Object} body - the request body
     * @param {Object} headers - list of additional request headers
     * @returns {Promise<any>} - returns a promise
     */
    static postResource(uri: string, body: Object, headers: ? Object): Promise<any> {
        if ( !uri ) throw new Error('URI is required parameter.');
        if ( !body ) throw new Error('`body` is required parameter.');

        return fetchData(uri, 'post', body, headers);
    }

    /**
     * Method that is used to fetch the data using PUT.
     *
     * @param {string} uri - the request URI
     * @param {Object} body - the request body
     * @param {Object} headers - list of additional request headers
     *
     * @returns {Promise<any>} - returns a promise
     */
    static putResource(uri: string, body: Object, headers: ? Object): Promise<any> {
        if ( !uri ) throw new Error('URI is required parameter.');
        if ( !body ) throw new Error('`body` is required parameter.');

        return fetchData(uri, 'put', body, headers);
    }

    /**
     * Uploads a file.
     *
     * @param {string} uri - the request URI
     * @param {File} file - the file to upload
     * @param {File} fieldName - the field name (default: 'attachment')
     * @param {Object} headers - list of additional request headers
     *
     * @returns {Promise<any>} - returns a promise
     */
    static uploadFile(uri: string, file: File, fieldName: string = 'attachment', headers: ? Object): Promise<any> {

        const formData = new FormData();
        formData.append(fieldName, file, file.name);

        return fetch(`${ CONFIG.API_ENTRY_POINT }/${ uri }`, {
            method: 'post',
            headers: new Headers({
                Authorization: affectliSso.getBearerToken(),
                ...headers,
            }),
            body: formData,

        }).then((response: Object) => {
            return handleResponse(response);
        });
    }

    /**
     * Uploads a file.
     *
     * @param {string} uri - the request URI
     * @param {operations} Object - that contains a object with query and variable keys
     * @param {File} file - the file to upload
     * @param {Object} headers - list of additional request headers
     *
     * @returns {Promise<any>} - returns a promise
     */
    static postForm(uri: string, operations: Object, file: File, headers: ? Object): Promise<any> {
        const data = new FormData();
        data.append('operations', JSON.stringify(operations));
        data.append('map', '{ "0": ["variables.file"] }');
        data.append('0', new File([file], file.name));
        return fetch(`${ CONFIG.API_ENTRY_POINT }/${ uri }`, {
            method: 'post',
            headers: new Headers({
                Authorization: affectliSso.getBearerToken(),
                ...headers,
            }),
            body: data,

        }).then((response: Object) => {
            return handleResponse(response);
        });
    }
}
