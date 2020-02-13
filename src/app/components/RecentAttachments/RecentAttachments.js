/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import List from 'app/components/molecules/List/List';
import ListItem from 'app/components/molecules/List/ListItem';
import Icon from 'app/components/atoms/Icon/Icon';

/**
 * This component shows recent attachments.
 */
export default class RecentAttachments extends PureComponent<Object,Object> {

    static propTypes = {
        recentAttachments: PropTypes.array
    };

    /**
     * Lifecycle hook: Executed on component render.
     * @returns {XML}
     */
    render(): Object {
        let rows = 'There are no recent attachments.';
        if (this.props.recentAttachments && this.props.recentAttachments.length > 0){
            const rowItems = this.props.recentAttachments.map ( ( m, index ) =>
                <ListItem
                    key={index}
                    component={<Icon name="file" />}
                    title={<a target="_blank" rel="noopener noreferrer" href={m.url}>{ m.name }</a>}
                />
            );
            rows = <List> {rowItems} </List>;
        }

        return (<Fragment>{rows}</Fragment>);
    }
}
