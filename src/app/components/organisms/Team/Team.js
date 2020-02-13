import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import TeamMembersList from './TeamMembersList/TeamMembersList';
import AddTeamMember from './AddTeamMember/AddTeamMember';
import TeamChangeAssignee from './ChangeAssignee/ChangeAssignee';

/**
 * Team Index Route for dealing with teams on processes
 */
class Team extends PureComponent<Object> {
    static propTypes = {
        match: PropTypes.shape({
            url: PropTypes.string,
        }),
    };

    /**
     * Render our routes
     */
    render() {
        const { match } = this.props;
        // console.log('match', match);
        return (
            <Switch>
                <Route path={`${ match.url }/add-person`} component={AddTeamMember} />
                <Route path={`${ match.url }/change-assignee`} component={TeamChangeAssignee} />
                <Route path={`${ match.url }/`} exact component={TeamMembersList} />
            </Switch>
        );
    }
}

export default withRouter( Team );
