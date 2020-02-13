/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'app/components/atoms/Button/Button';

/**
 * Renders the subrow to display the data related to the event
 */
class EventData extends Component<Object, Object> {

    static propTypes = {
        streamId: PropTypes.string,
        alarmId: PropTypes.number,
        siteId: PropTypes.string,
        siteName: PropTypes.string,
        impact: PropTypes.string,
    };

    state: {
        visibleData: boolean,
        visibleId: boolean,
    };

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super ( props );
        this.state = {
            visibleData: false,
            visibleId: true
        };
        (this: Object).showData = this.showData.bind( this );
    }

    /**
     * changes the state to show/hide the data.
     */
    showData() {
        this.setState({
            visibleData: !this.state.visibleData,
            visibleId: !this.state.visibleId
        });
    }

    /**
     * @override
     * @return {XML}
     */
    render(): Object {
        const { streamId, alarmId, siteId, siteName, impact } = this.props;
        return (
            <div>
                {this.state.visibleId ? <Button onClick={this.showData}>{streamId}</Button> : null }
                {this.state.visibleData ?
                    <div onClick={this.showData} role="button" tabIndex={0}>
                        <div>
                            <b>Alarm Id: </b> {alarmId} | <b>Site Id: </b> {siteId}
                        </div>
                        <div>
                            <b>Site Name: </b> {siteName} | <b>Impact: </b> {impact}
                        </div>
                    </div>
                    : null}
            </div>
        );
    }
}

export default EventData;
