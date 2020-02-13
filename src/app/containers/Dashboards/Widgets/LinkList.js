/* @flow */
import React from 'react';
import { pure } from 'recompose';

import Link from 'app/components/atoms/Link/Link';
import ListItem from 'app/components/molecules/List/ListItem';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';

const LinkList = ({ list, type }: Object): Array<Object> => (list || []).map(
    ({ id, name }: Object) => (
        <ListItem
            key={id}
            title={name || 'No Name'}
            actions={
                <Link to={`/abox/${type}/${id}`}>
                    <ButtonIcon icon="arrow-right" size="sm" />
                </Link>
            }
            small
        />
    )
);

export default pure(LinkList);
