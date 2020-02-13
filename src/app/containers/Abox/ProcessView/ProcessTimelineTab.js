/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Changelog from 'app/components/organisms/Changelog/Changelog';
import { get } from 'app/utils/lo/lo';
import { loadProcessChangelog } from 'store/actions/abox/processActions';

/**
 * Render the Process's changelog tab.
 */
class ProcessTimelineTab extends PureComponent<Object, Object> {

    static propTypes = {
        id: PropTypes.string.isRequired,
        loadProcessChangelog: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        startIndex: PropTypes.number.isRequired,
        changelog: PropTypes.arrayOf(PropTypes.object),
        count: PropTypes.number,
    };

    static translations = {
        'children': 'subprocess',
    };

    loadData = (options: Object) => {
        return this.props.loadProcessChangelog(this.props.id, options);
    }

    /**
     * @override
     */
    render() {
        const { isLoading, startIndex, changelog, count} = this.props;
        return (
            <Changelog
                entityType="process"
                isLoading={isLoading}
                startIndex={startIndex}
                changelog={changelog}
                count={count}
                translations={ProcessTimelineTab.translations}
                loadData={this.loadData}
            />
        );
    }
}

export default connect(
    state => ({
        isLoading: state.abox.process.changelog.isLoading || false,
        changelog: get(state, 'abox.process.changelog.data.changes'),
        startIndex: get(state, 'abox.process.changelog.data.startIndex') || 0,
        count: get(state, 'abox.process.changelog.data.count'),
    }),
    { loadProcessChangelog }
)(ProcessTimelineTab);
