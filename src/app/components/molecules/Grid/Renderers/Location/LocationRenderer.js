/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Tag from 'app/components/atoms/Tag/Tag';
import LocationValue from './LocationValue';
import styled from 'styled-components';
import { cut } from 'app/utils/string/string-utils';

const StyledLink = styled(Link)`
    text-decoration: none;
`;
/**
 * Renders the location info inside of an ag-grid.
 *
 * @param props the Component's properties
 */
const LocationRenderer = ({ data, value, linkTo }: Object) => {
    const adrs = LocationValue({ value });
    if (!adrs) {
        return null;
    }
    const adrsStr = String(adrs);
    const location = cut(adrsStr, 25, true);
    const redirectTo = {
        thing: `things/${data.id}/about`,
        person: `people/${data.id}/about`,
        organisation: `organisations/${data.id}/about`,
        custom: `custom-entities/${data.id}/about`
    }[linkTo];
    return (
        <StyledLink to={{ pathname: `/${redirectTo}`, state: { scrollIntoView: true } }}>
            <Tag title={adrsStr}>{location}</Tag>
        </StyledLink>
    );
};
LocationRenderer.propTypes = {
    value: PropTypes.object,
    linkTo: PropTypes.oneOf(['thing', 'person', 'organisation', 'custom']).isRequired
};

export default LocationRenderer;
