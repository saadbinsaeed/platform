/* @flow */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Label from '../Label/Label';
import HeaderActions from 'app/components/atoms/HeaderActions/HeaderActions';
import { ChildrenProp } from 'app/utils/propTypes/common';

const ListGroupName = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    opacity: 0.6;
`;

const ListGroupLabel = styled(Label)`
    margin: 0;
`;
/**
 * If items in a list are grouped. Use this to split by title
 */
const ListGroup = (props: Object) => {
    const { name, actions } = props;
    return (
        <ListGroupName>
            <ListGroupLabel>{name}</ListGroupLabel> <HeaderActions>{actions}</HeaderActions>
        </ListGroupName>
    );
};

ListGroup.propTypes = {
    name: PropTypes.string,
    actions: ChildrenProp,
};

export default ListGroup;
