/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'fast-memoize';
import { compose, onlyUpdateForKeys, setPropTypes } from 'recompose';

import List from 'app/components/molecules/List/List';
import ListItem from 'app/components/molecules/List/ListItem';
import { get } from 'app/utils/lo/lo';
import { formatDate } from 'app/utils/date/date';


const buildItems = memoize(comments => (comments || []).map((comment, i) => {
    let text = String(get(comment, 'author.name') || '');
    const createDate = get(comment, 'createDate');
    if (createDate) {
        text += `, ${formatDate(createDate)}`;
    }
    return (
        <ListItem key={i}
            title={<div dangerouslySetInnerHTML={{__html: get(comment, 'message')}} />}
            text={text}
        />
    );
}));

const Comments = ({ comments }: Object) =>
    (comments && comments.length) ? <List>{buildItems(comments)}</List> : 'No comments are available.';

export default compose(
    onlyUpdateForKeys(['comments']),
    setPropTypes({
        comments: PropTypes.arrayOf(PropTypes.object),
    })
)(Comments);
