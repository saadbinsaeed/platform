/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Menu from 'app/components/molecules/Menu/Menu';
import MenuHeader from 'app/components/molecules/Menu/MenuHeader';
import FilterItemGroup from 'app/components/molecules/FilterItemGroup/FilterItemGroup';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import Immutable, { set } from 'app/utils/immutable/Immutable';

/**
 * FilterContent
 */
class SituationalAwarenessFilters extends PureComponent<Object, Object> {

    static propTypes = {
        onChange: PropTypes.func,
    };

    /**
     * Set default state
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            view: Immutable({
                mttr: {},
                cause: {},
                priority: {},
                process: {},
                entities: {},
            }),
            group: ''
        };
    }
    /**
     * handleFiltersViewChange
     */
    handleViewChange = (event: Object) => {
        const { name, value } = event.target;
        this.setState({ view: set(this.state.view, name, value) }, this.onChange);
    };
    /**
     * Pass onChange event out
     */
    onChange = () => {
        this.props.onChange && this.props.onChange(this.state);
    };
    /**
     * Render
     */
    render() {
        return (
            <Menu>
                <MenuHeader>Filter Fields</MenuHeader>
                <FilterItemGroup name="MTTR Bucket" value={this.state.view.mttr}>
                    <Checkbox name="mttr.0" checked={this.state.view.mttr[0] || false} label="Not identified" onChange={this.handleViewChange} />
                    <Checkbox name="mttr.1" checked={this.state.view.mttr[1] || false} label="< 2 Hours" onChange={this.handleViewChange} />
                    <Checkbox name="mttr.2" checked={this.state.view.mttr[2] || false} label="2 - 6 Hours" onChange={this.handleViewChange} />
                    <Checkbox name="mttr.3" checked={this.state.view.mttr[3] || false} label="6 - 12 Hours" onChange={this.handleViewChange} />
                    <Checkbox name="mttr.4" checked={this.state.view.mttr[4] || false} label="12 - 24 Hours" onChange={this.handleViewChange} />
                    <Checkbox name="mttr.5" checked={this.state.view.mttr[5] || false} label="> 24 Hours" onChange={this.handleViewChange} />
                </FilterItemGroup>
                <FilterItemGroup name="Root Cause" value={this.state.view.cause}>
                    <Checkbox name="cause.na" checked={this.state.view.cause.na || false} label="Not identified" onChange={this.handleViewChange} />
                    <Checkbox name="cause.others" checked={this.state.view.cause.others || false} label="Others" onChange={this.handleViewChange} />
                    <Checkbox name="cause.environmental" checked={this.state.view.cause.environmental || false} label="Environmental" onChange={this.handleViewChange} />
                    <Checkbox name="cause.active" checked={this.state.view.cause.active || false} label="Active" onChange={this.handleViewChange} />
                    <Checkbox name="cause.planned_activity" checked={this.state.view.cause.planned_activity || false} label="Planned activity" onChange={this.handleViewChange} />
                    <Checkbox name="cause.error" checked={this.state.view.cause.error || false} label="Error" onChange={this.handleViewChange} />
                    <Checkbox name="cause.power" checked={this.state.view.cause.power || false} label="Power" onChange={this.handleViewChange} />
                    <Checkbox name="cause.access" checked={this.state.view.cause.access || false} label="Access" onChange={this.handleViewChange} />
                    <Checkbox name="cause.cascaded" checked={this.state.view.cause.cascaded || false} label="Cascaded" onChange={this.handleViewChange} />
                    <Checkbox name="cause.warning" checked={this.state.view.cause.warning || false} label="Warning" onChange={this.handleViewChange} />
                </FilterItemGroup>
                <FilterItemGroup name="Priority" value={this.state.view.priority}>
                    <Checkbox name="priority.p1" checked={this.state.view.priority.p1 || false} label="P1" onChange={this.handleViewChange} />
                    <Checkbox name="priority.p2" checked={this.state.view.priority.p2 || false} label="P2" onChange={this.handleViewChange} />
                    <Checkbox name="priority.p3" checked={this.state.view.priority.p3 || false} label="P3" onChange={this.handleViewChange} />
                    <Checkbox name="priority.p4" checked={this.state.view.priority.p4 || false} label="P4" onChange={this.handleViewChange} />
                </FilterItemGroup>
                <FilterItemGroup name="Processes" value={this.state.view.process}>
                    <Checkbox name="process.na" checked={this.state.view.process.na || false} label="Not identified" onChange={this.handleViewChange} />
                    <Checkbox name="process.reduce_image" checked={this.state.view.process.reduce_image || false} label="Reduce image" onChange={this.handleViewChange} />
                    <Checkbox name="process.unauthorised_access_alarm" checked={this.state.view.process.unauthorised_access_alarm || false} label="Unauthorised Access Alarm" onChange={this.handleViewChange} />
                    <Checkbox name="process.customer_service_chat" checked={this.state.view.process.customer_service_chat || false} label="Customer Service Chat" onChange={this.handleViewChange} />
                    <Checkbox name="process.affectli_to_do" checked={this.state.view.process.affectli_to_do || false} label="Affectli To Do" onChange={this.handleViewChange} />
                    <Checkbox name="process.security_incident" checked={this.state.view.process.security_incident || false} label="Unauthorised Access Alarm" onChange={this.handleViewChange} />
                </FilterItemGroup>
                <FilterItemGroup name="Entities" value={this.state.view.entities}>
                    <Checkbox name="entities.general" checked={this.state.view.entities.general || false} label="General" onChange={this.handleViewChange} />
                    <Checkbox name="entities.things" checked={this.state.view.entities.things || false} label="Things" onChange={this.handleViewChange} />
                    <Checkbox name="entities.people" checked={this.state.view.entities.people || false} label="People" onChange={this.handleViewChange} />
                    <Checkbox name="entities.organisations" checked={this.state.view.entities.organisations || false} label="Organisations" onChange={this.handleViewChange} />
                </FilterItemGroup>
            </Menu>
        );
    }
}

export default SituationalAwarenessFilters;
