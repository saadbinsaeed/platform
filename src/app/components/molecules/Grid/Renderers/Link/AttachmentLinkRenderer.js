/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isDefined } from 'app/utils/utils';

const AttachmentLinkRenderer = ({ data = {}, value, redirectTo }: Object) => {
    if (!isDefined(value)) {
        return null;
    }
    const linkTo = {
        thing: `things/${data.id}/attachments`,
        person: `people/${data.id}/attachments`,
        organisation: `organisations/${data.id}/attachments`,
        custom: `custom-entities/${data.id}/attachments`
    }[redirectTo];
    return <Link to={`/${linkTo}`}> {value} </Link>;
};
AttachmentLinkRenderer.propTypes = {
    data: PropTypes.object,
    value: PropTypes.number,
    redirectTo: PropTypes.oneOf(['thing', 'person', 'organisation', 'custom']).isRequired
};

export default AttachmentLinkRenderer;
