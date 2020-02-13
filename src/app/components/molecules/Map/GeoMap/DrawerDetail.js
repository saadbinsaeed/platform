// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure, setPropTypes  } from 'recompose';
import List from 'app/components/molecules/List/List';
import ListItem from 'app/components/molecules/List/ListItem';

const DrawerDetail = ({ info }) => <List>{ [] || info.map(item => <ListItem title={item.id} />) }</List>;

export default compose(pure, setPropTypes({
    info: PropTypes.array.isRequired,
}))(DrawerDetail);
