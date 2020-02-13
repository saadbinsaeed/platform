/* @flow */

import React from 'react';
import { get } from 'app/utils/lo/lo';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { onlyUpdateForKeys } from 'recompose';

const EntityLink = styled(Link)`
    text-decoration: none;
`;

const EntityLinkRenderer = onlyUpdateForKeys(['data'])((props: Object) => {
    const { data: { nodeType2 }, data } = props;
    const entity = get(data, `${nodeType2}2`) || {};
    if (!entity) return null;
    const plural = {
        person: 'people',
        thing: 'things',
        organisation: 'organisations',
        process: 'legacy',
    }[nodeType2];
    const linkTo = plural === 'legacy' ? `/${plural}/process/${entity.id}` : `/${plural}/${entity.id}/summary`;
    return <EntityLink to={linkTo}>{entity.name}</EntityLink>;
});

export default EntityLinkRenderer;
