/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'app/utils/lo/lo';
import { Link } from 'react-router-dom';
import Icon from 'app/components/atoms/Icon/Icon';
import Tag from 'app/components/atoms/Tag/Tag';
import styled from 'styled-components';

const StyledTag = styled(Tag)`
    padding: 0.1rem 0.7rem;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
`;

const ClassificationsRenderer = ({
    data = {},
    valueField,
    label,
    redirectTo,
    id,
    idField,
}: Object) => {
    const clsData = data[valueField] || (get(data, valueField) || []);
    if (!clsData && !clsData.length) {
        return null;
    }
    const entityId = String(get(data, idField));
    const linkTo = {
        thing: `things/${entityId}/classifications`,
        person: `people/${entityId}/classifications`,
        organisation: `organisations/${entityId}/classifications`,
        custom: `custom-entities/${entityId}/classifications`,
    }[redirectTo];
    return clsData
        .filter(cl => cl)
        .map((cl, i) => {
            const text = get(cl, label) || get(cl, 'uri');
            const uri = get(cl, 'uri');
            const identifier = id ? String(get(cl, id)) : cl.id;
            return (
                <StyledTag key={i} color={cl.color}>
                    <StyledLink
                        to={{
                            pathname: `/${linkTo}`,
                            state: { classificationId: identifier },
                        }}
                        title={uri}
                    >
                        {text}{' '}
                    </StyledLink>
                    <StyledLink to={`/classifications/${identifier}/about`}>
                        <Icon name="pencil" size="sm" />
                    </StyledLink>
                </StyledTag>
            );
        });
};

ClassificationsRenderer.propTypes = {
    data: PropTypes.object.isRequired,
    valueField: PropTypes.oneOf([
        'classes',
        'thing.classes',
        'person.classes',
        'organisation.classes',
        'customEntity.classes',
    ]).isRequired,
    redirectTo: PropTypes.oneOf(['thing', 'person', 'organisation', 'custom'])
        .isRequired,
    label: PropTypes.string,
    id: PropTypes.string,
    idField: PropTypes.string,
};

ClassificationsRenderer.defaultProps = {
    idField: 'id',
};


export default ClassificationsRenderer;
