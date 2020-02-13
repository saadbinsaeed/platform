/* @flow */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'fast-memoize';

import { eventStartProcess, EVENT_START_PROCESS } from 'store/actions/stream/eventsActions';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Button from 'app/components/atoms/Button/Button';
import Modal from 'app/components/molecules/Modal/Modal';
import Checkbox from 'app/components/atoms/CheckBox/CheckBox';
import { set } from 'app/utils/lo/lo';

/**
 * Renders the button and the dialog to start one or more processes related to this event.
 */
class EventStartProcess extends Component<Object, Object> {

    static propTypes = {
        /* props */
        eventId: PropTypes.number.isRequired,
        processDefinitions: PropTypes.arrayOf(PropTypes.object).isRequired,
        postAction: PropTypes.func,
        color: PropTypes.string,
        /* redux */
        eventStartProcess: PropTypes.func.isRequired,
        lastActionType: PropTypes.string,
        lastActionError: PropTypes.bool,
    };

    state: {
        visible: boolean,
        processes: Object,
    };

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);
        this.state = { visible: false, processes: {} };
        (this: Object).showDialog = this.showDialog.bind( this );
        (this: Object).startProcess = this.startProcess.bind( this );
        (this: Object).closeDialog = this.closeDialog.bind( this );
        (this: Object).handleChange = this.handleChange.bind( this );
    }

    /**
     * @override
     * @param nextProps the next props
     * @param nextState the next state
     * @return {boolean} true if the component have to call the render function.
     */
    shouldComponentUpdate(nextProps, nextState) {
        const { eventId, processDefinitions } = nextProps;
        const { visible, processes } = nextState;
        const props = this.props;
        const state = this.state;
        return props.eventId !== eventId || props.processDefinitions !== processDefinitions || state.visible !== visible || state.processes !== processes;
    }

    /**
     * @override
     * @param nextProps the propertiesd that the Component will receive.
     */
    componentWillReceiveProps(nextProps) {
        if ( !nextProps.lastActionError && nextProps.lastActionType === EVENT_START_PROCESS) {
            this.closeDialog();
        }
    }

    /**
     * Shows the dialog
     */
    showDialog(event: ?Object) {
        if (event) {
            event.preventDefault();
        }
        this.setState({ visible: true });
    }

    /**
     * Toggle checkbox
     */
    handleChange(event) {
        const name = event.target.name;
        this.setState(set(this.state, `processes.${name}`, !this.state.processes[name]));
    }

    /**
     * starts the processes related to this event
     */
    startProcess() {
        const processes = this.state.processes;
        const promises = Object.keys(processes).map((startMessage) => {
            if (!processes[startMessage]) {
                return null;
            }
            return this.props.eventStartProcess( startMessage, { eventId: this.props.eventId } );
        }).filter(promise => promise);
        if (promises.length) {
            Promise.all(promises).then(() => { this.props.postAction && this.props.postAction(); });
        }
    }

    /**
     * Close the dialog
     */
    closeDialog() {
        this.setState({ visible: false });
    }

    buildCheckboxes = memoize((processDefinitions, processes) => processDefinitions.map(def => (
        <Checkbox
            key={def.start_message}
            name={def.start_message}
            label={def.process_name}
            type="checkbox"
            checked={processes[def.start_message]}
            onChange={this.handleChange}
        />
    )));

    /**
     * @override
     * @return {XML}
     */
    render() {
        const { processes, visible } = this.state;
        const { eventId, processDefinitions, color } = this.props;
        const startProcessDisabled = !Object.keys(processes).find(key => processes[key] );
        const checkboxes = this.buildCheckboxes(processDefinitions, processes);
        const title = `Start new process for Event ${eventId}`;
        return (
            <Fragment>
                <ButtonIcon icon="processes" type="af" size="lg" alt="Start Process" title="Start Process" iconColor={color} onClick={this.showDialog} />
                {
                    visible ?
                        <Modal open disableBack title={title} onToggle={this.closeDialog}>
                            <div>
                                {checkboxes}
                                <br />
                                <Button color="primary" onClick={this.startProcess} disabled={startProcessDisabled}>Start process</Button>
                                <Button onClick={this.closeDialog}>Cancel</Button>
                            </div>
                        </Modal>
                        : null
                }
            </Fragment>
        );
    }
}

export default connect (
    state => ({
        lastActionType: state.global.lastActionType,
        lastActionError: state.global.lastActionError,
    }),
    {
        eventStartProcess
    }
)( EventStartProcess );
