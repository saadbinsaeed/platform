/* @flow */

export interface Address {
    add_type?: string;
    line1?: string;
    line2?: string;
    country?: string;
    province?: string;
    city?: string;
    code?: string;
}

export interface LocationInfo {
    uri?: string;
    latitude?: number;
    longitude?: number;
    geom?: Object;
    name?: string;
    address: ?Address;
}

export interface ContactInfo {
    type: string,
    is_primary: boolean,
    sub_type: string,
    identifier: string,
    address: ?Address
}
