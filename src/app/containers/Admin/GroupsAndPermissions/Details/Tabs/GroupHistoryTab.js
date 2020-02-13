/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import produce from 'immer';

import Changelog from 'app/components/organisms/Changelog/Changelog';
import { get, set } from 'app/utils/lo/lo';
import { loadGroupChangelog } from 'store/actions/admin/groupsActions';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

/**
 * Render the Task's changelog tab.
 */
class GroupHistoryTab extends PureComponent<Object, Object> {

    static propTypes = {
        id: PropTypes.string.isRequired,
        loadGroupChangelog: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        startIndex: PropTypes.number.isRequired,
        changelog: PropTypes.arrayOf(PropTypes.object),
        count: PropTypes.number,
    };

    @bind
    loadData(options: Object) {
        return this.props.loadGroupChangelog(Math.ceil(this.props.id), options);
    }

    @bind
    @memoize()
    normalizeChanges(changelog) {
        const normalizedList = [];
        (changelog || []).forEach((log) => {
            const entities = get(log, 'changes[0].item.entities') || [];
            if(entities.length > 1) {
                const change = get(log, 'changes[0]');
                const logPermission = set(log, 'changes', []);
                entities.forEach((permission, index) => {
                    logPermission.changes.push(set(change, 'item.entities[0]', permission));
                });
                normalizedList.push(logPermission);
            } else if (get(log, 'changes[0].path[0]') === 'users') {
                let change = set(log, 'changes', []);
                change = set(change, 'changes[0]', {...log.changes[0], item: [], path: ['group.users']});
                if(log.changes.length > 1) {
                    log.changes.forEach(({ item }) => {
                        change.changes[0].item.push(item.id);
                    });
                } else {
                    change = set(change, 'changes[0]', {...log.changes[0], path: ['user']});
                }
                normalizedList.push(change);
            } else {
                const nextLog = produce(log, (draftLog) => {
                    draftLog.changes.forEach((ch, i) => {
                        if(get(ch, 'path[0]') === 'classificationUris') {
                            draftLog.changes[i].path[0] = 'group.classificationUris';
                        }
                    });
                });

                normalizedList.push(nextLog);
            }
        });
        return normalizedList;
    }

    /**
     * @override
     */
    render() {
        const { isLoading, startIndex, changelog, count} = this.props;
        return (
            <Changelog
                entityType="group"
                isLoading={isLoading}
                startIndex={startIndex}
                changelog={this.normalizeChanges(changelog)}
                count={count}
                loadData={this.loadData}
            />
        );
    }
}

export default connect(
    state => ({
        isLoading: state.admin.groups.changelog.isLoading,
        changelog: get(state, 'admin.groups.changelog.data.changes'),
        startIndex: get(state, 'admin.groups.changelog.data.startIndex') || 0,
        count: get(state, 'admin.groups.changelog.data.count'),
    }),
    { loadGroupChangelog }
)(GroupHistoryTab);
