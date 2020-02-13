/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { connect } from 'react-redux';

import Changelog from 'app/components/organisms/Changelog/Changelog';
import { get } from 'app/utils/lo/lo';
import { loadEntityChangelog } from 'store/actions/entities/entitiesActions';

/**
 * Render the Thing's changelog tab.
 */
class EntityTimeline extends PureComponent<Object, Object> {

    static propTypes = {
        entityId: PropTypes.string,
        entityType: PropTypes.string,
        isLoading: PropTypes.bool,
        changelog: PropTypes.arrayOf(PropTypes.object),
    };

    loadData = (options: Object) => {
        return this.props.loadEntityChangelog(this.props.entityId, options);
    }

    cleanUpChanges = memoize((changelog) => {
        return changelog && changelog.map((entry) => {
            if (!entry.changes || entry.changes.length < 1) {
                return entry;
            }
            const changes = entry.changes.filter(({ path }) => {
                if (!path || path.lenth > 2) {
                    return true;
                }
                const property = path.join('.');
                if (property !== 'modifiedDate' && property !== 'locationInfo.geom') {
                    return true;
                }
                return false;
            });
            return { ...entry, changes: changes.length >= 1 ? changes : entry.changes };
        });
    })

    /**
     * @override
     */
    render() {
        const { isLoading, startIndex, changelog, count, entityType} = this.props;
        return (
            <Changelog
                entityType={entityType}
                isLoading={isLoading}
                startIndex={startIndex}
                changelog={this.cleanUpChanges(changelog)}
                count={count}
                loadData={this.loadData}
            />
        );
    }
}

export default connect(
    state => ({
        isLoading: state.entities.common.changelog.isLoading || false,
        changelog: get(state, 'entities.common.changelog.data.changes'),
        startIndex: get(state, 'entities.common.changelog.data.startIndex') || 0,
        count: get(state, 'entities.common.changelog.data.count'),
    }),
    { loadEntityChangelog }
)(EntityTimeline);
