/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Changelog from 'app/components/organisms/Changelog/Changelog';
import { get } from 'app/utils/lo/lo';
import { bind } from 'app/utils/decorators/decoratorUtils';
import { loadUserChangelog } from 'store/actions/admin/userManagementAction';

/**
 * Render the User's changelog tab.
 */
class UserHistory extends PureComponent<Object, Object> {

    static propTypes = {
        user: PropTypes.object.isRequired,
        loadUserChangelog: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        startIndex: PropTypes.number.isRequired,
        changelog: PropTypes.arrayOf(PropTypes.object),
        count: PropTypes.number,
    };

    @bind
    loadData(options: Object) {
        const { user } = this.props;
        return this.props.loadUserChangelog(user.login, user.id, options);
    }

    render() {
        const { isLoading, startIndex, changelog, count} = this.props;
        return (
            <Changelog
                entityType="user"
                isLoading={isLoading}
                startIndex={startIndex}
                changelog={changelog}
                count={count}
                loadData={this.loadData}
            />
        );
    }
}

export default connect(
    state => ({
        isLoading: state.admin.users.changelog.isLoading,
        changelog: get(state, 'admin.users.changelog.data.changes'),
        startIndex: get(state, 'admin.users.changelog.data.startIndex') || 0,
        count: get(state, 'admin.users.changelog.data.count'),
    }),
    { loadUserChangelog }
)(UserHistory);
