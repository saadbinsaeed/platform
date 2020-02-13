// @flow

import React, { PureComponent } from 'react';
import styled from 'styled-components';
import ListItem from 'app/components/molecules/List/ListItem';
import EntityLink from 'app/components/atoms/Link/EntityLink';
import EntityAvatar from 'app/components/atoms/Avatar/EntityAvatar';
import Avatar from 'app/components/molecules/Avatar/Avatar';

const ListItemStyled = styled(ListItem)`
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    @media (max-width: 1100px ) {
        padding-right: 2rem;
    }
`;

/**
 * A single entity item
 */
class EntityListItem extends PureComponent<Object, Object> {
    render() {
        const { data: { name, id }, type, selected, ...rest } = this.props;
        return (
            <ListItemStyled
                {...rest}
                component={this.renderAvatar()}
                title={<EntityLink id={id} type={type}>{name || 'No Name'}</EntityLink>}
                subTitle={<EntityLink id={id} type={type}>#{id}</EntityLink>}
                raised
            />
        );
    }
    renderAvatar() {
        const { selected, type, data } = this.props;
        if (selected) {
            const { name } = data;
            return <Avatar name={name} alt={name} iconName="check" width="40px" height="40px" lineHeight="40px" />;
        }
        return (
            <EntityAvatar data={data} type={type} />
        );
    }
}

export default EntityListItem;
