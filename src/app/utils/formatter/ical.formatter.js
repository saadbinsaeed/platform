

/* @flow */

type IcalData = {
    id: string,
    stamp: string,
    start: string,
    end: string,
    summary: string,
    description: string,
    url: string
}

/**
 * Formats body to an ical format.
 *
 * @param data the object data
 * @param format the format to use (optional)
 */
const formatIcal = (data: IcalData) => {
    const { id, stamp, start, end, summary, description, url } = data;

    const body = `BEGIN:VCALENDAR\r\n`+
        `VERSION:2.0\r\n`+
        `PRODID:-//affectli/cal//Affectli Calendar v1.0//EN\r\n`+
        `BEGIN:VEVENT\r\n`+
        `UID:${id}\r\n`+
        `DTSTAMP:${stamp}\r\n`+
        `DTSTART:${start}\r\n`+
        `DTEND:${end}\r\n`+
        `SUMMARY:${summary}\r\n`+
        `DESCRIPTION:${description}\r\n`+
        `URL:${url}\r\n`+
        `END:VEVENT\r\n`+
        `END:VCALENDAR\r\n`;

    return body;
};


export { formatIcal };