/* @flow */

import jsonexport from 'jsonexport';
import moment from 'moment';
import FileSaver from 'file-saver';

/**
 * download list of user
 * @param name is the filename to download
 * @param rows is the data object that download
 */
const saveCsv = (name: string, rows: Array<Object>) => {
    if (rows && rows.length) {
        jsonexport(rows, { headers: Object.keys(rows[0]) }, (error, csv) => {
            if(error) {
                // eslint-disable-next-line no-console
                return console.log('[ExportCSV]', error);
            };
            const filename = `${ name } ${moment().format('DD.MM.YYYY HH.mm.ss')}.csv`;
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            FileSaver.saveAs(blob, filename);
        });
    }
};

/**
 * download a text file
 * @param name is the filename to download
 * @param body is the body of the text file
 * @param ext is the extensions supported
 */
const saveText = (name: string, body: string, ext: '.txt' | '.ics') => {
    if (body) {
        const filename = `${ name } ${moment().format('DD.MM.YYYY HH.mm.ss')}${ext}`;
        const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, filename);
    }
};

export {
    saveCsv,
    saveText
};