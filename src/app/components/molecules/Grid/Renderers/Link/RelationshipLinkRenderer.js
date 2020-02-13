/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isDefined } from 'app/utils/utils';

const RelationshipLinkRenderer = ({ data = {}, value, redirectTo }: Object) => {
    if (!isDefined(value)) {
        return null;
    }
    const linkTo = {
        thing: `things/${data.id}/relationships`,
        person: `people/${data.id}/relationships`,
        organisation: `organisations/${data.id}/relationships`,
        custom: `custom-entities/${data.id}/relationships`,

    }[redirectTo];
    return <Link to={`/${linkTo}`}> {value} </Link>;
};
RelationshipLinkRenderer.propTypes = {
    data: PropTypes.object,
    value: PropTypes.number,
    redirectTo: PropTypes.oneOf(['thing', 'person', 'organisation', 'custom']).isRequired
};

export default RelationshipLinkRenderer;
