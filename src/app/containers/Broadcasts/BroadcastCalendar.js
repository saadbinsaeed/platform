/* @flow */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import memoize from 'fast-memoize';

import { showToastr } from 'store/actions/app/appActions';
import { fetchBroadcastsCalendar } from 'store/actions/broadcasts/broadcastsActions';
import PageTemplate from 'app/components/templates/PageTemplate';
import Calendar from 'app/components/molecules/Calendar/Calendar';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';

/**
 * Displays the broadcasts in a calendar view.
 */
class BroadcastCalendar extends PureComponent<Object, Object> {

    static propTypes = {
        fetchBroadcastsCalendar: PropTypes.func,
        showToastr: PropTypes.func,
        records: PropTypes.array,
        history: PropTypes.object,
        userProfile: PropTypes.object,
    };

    /**
     * Fetch broadcasts on mount
     */
    componentDidMount() {
        this.fetchBroadcastsOfMonth(new Date());
    }

    fetchBroadcastsOfMonth(date) {
        const firstOfTheMonth = moment(date).date(1).hour(0).minute(0).second(0).millisecond(1);
        const firstOfTheNextMonth = moment(firstOfTheMonth).add(1, 'month');
        this.props.fetchBroadcastsCalendar({
            where: [
                { field: 'startDate', op: '<', value: firstOfTheNextMonth },
                { field: 'expireDate', op: '>', value: firstOfTheMonth},
                { field: 'priority', op: '=', value: 'broadcast' }
            ],
        });
    }

    /**
     * Load our broadcast edit dialog via the URL
     */
    loadBroadcastUrl = ({ id }) => {
        const permissions = this.props.userProfile.permissions;
        const isAdmin = this.props.userProfile.isAdmin;
        const permissionsSet = new Set(permissions || []);
        const canEdit = isAdmin || permissionsSet.has('broadcast.edit');
        if (canEdit) {
            this.props.history.push(`/broadcasts/edit/${id}`);
        } else {
            this.props.showToastr({ severity: 'info', detail: 'You don\'t have permission to edit !' });
        }
    };

    onNavigate = (data) => {
        this.fetchBroadcastsOfMonth(data);
    }

    buildEvents = memoize(broadcasts =>
        (broadcasts || []).map(item => ({
            id: item.id,
            title: (item.message ? item.message : 'No message set'),
            start: new Date(item.startDate),
            end: new Date(item.expireDate),
        })).filter(({ start, end }) => start instanceof Date && end instanceof Date && start < end)
    );

    /**
     * @override
     */
    render(): Object {
        const { broadcasts } = this.props;
        return (
            <PageTemplate title="Broadcast Calendar" overflowHidden>
                <ContentArea>
                    <Calendar
                        calendarId={'broadcast'}
                        isLoading={this.props.isLoading}
                        onNavigate={this.onNavigate}
                        popup
                        events={this.buildEvents(broadcasts)}
                        showMultiDayTimes
                        onSelectEvent={this.loadBroadcastUrl}
                        {...this.props}
                    />
                </ContentArea>
            </PageTemplate>
        );
    }
}

const mapStateToProps = state => ({
    broadcasts: state.broadcasts.calendar.data,
    isLoading: state.broadcasts.calendar.isLoading,
    userProfile: state.user.profile,
});

export default connect(mapStateToProps, { fetchBroadcastsCalendar, showToastr })(BroadcastCalendar);
