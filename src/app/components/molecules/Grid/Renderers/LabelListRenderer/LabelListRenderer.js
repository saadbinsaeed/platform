/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { get } from 'app/utils/lo/lo';
import Tag from 'app/components/atoms/Tag/Tag';


const StyledLink = styled(Link)`
    text-decoration: none;
`;

const LabelListRenderer = ({ value, label, redirectTo, id }: Object) => {
    if (!value || !value.length) {
        return null;
    }
    if (label) {
        return value.filter(cl => cl).map((cl, i) => {
            const text = get(cl, label) || get(cl, 'uri');
            const identifier = id ? String(get(cl, id)) : cl.id;
            const linkTo = {
                entity: `classifications/${identifier}/about`,
                thing: `things/${identifier}/about`,
                group: `groups/${identifier}/general`,
                organisation: `organisations/${identifier}/about`,
                custom: `custom-entities/${identifier}/about`
            }[redirectTo];
            return (
                text &&
                (redirectTo ? (
                    <Tag key={i} color={cl.color}>
                        <StyledLink to={`/${linkTo}`}> {text} </StyledLink>
                    </Tag>
                ) : (
                    <Tag key={i} color={cl.color}>
                        {' '}
                        {text}{' '}
                    </Tag>
                ))
            );
        });
    }
    return value.filter(cl => cl).map((cl, i) => {
        return <Tag key={i}> {cl} </Tag>;
    });
};
LabelListRenderer.propTypes = {
    value: PropTypes.any,
    label: PropTypes.string,
    id: PropTypes.string,
};

export default LabelListRenderer;
