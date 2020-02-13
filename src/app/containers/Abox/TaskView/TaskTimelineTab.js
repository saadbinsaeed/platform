/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Changelog from 'app/components/organisms/Changelog/Changelog';
import { get } from 'app/utils/lo/lo';
import { loadTaskChangelog } from 'store/actions/abox/taskActions';
import { bind } from 'app/utils/decorators/decoratorUtils';

/**
 * Render the Task's changelog tab.
 */
class TaskTimelineTab extends PureComponent<Object, Object> {

    static propTypes = {
        id: PropTypes.string.isRequired,
        loadTaskChangelog: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        startIndex: PropTypes.number.isRequired,
        changelog: PropTypes.arrayOf(PropTypes.object),
        count: PropTypes.number,
    };

    static translations = {
        'children': 'subtask',
    };

    @bind
    loadData(options: Object) {
        return this.props.loadTaskChangelog(this.props.id, options);
    }

    render() {
        const { isLoading, startIndex, changelog, count} = this.props;
        return (
            <Changelog
                entityType="task"
                isLoading={isLoading}
                startIndex={startIndex}
                changelog={changelog}
                count={count}
                translations={TaskTimelineTab.translations}
                loadData={this.loadData}
            />
        );
    }
}

export default connect(
    state => ({
        isLoading: state.abox.task.changelog.isLoading || false,
        changelog: get(state, 'abox.task.changelog.data.changes'),
        startIndex: get(state, 'abox.task.changelog.data.startIndex') || 0,
        count: get(state, 'abox.task.changelog.data.count'),
    }),
    { loadTaskChangelog }
)(TaskTimelineTab);
