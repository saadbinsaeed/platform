/* @flow */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import Modal from 'app/components/molecules/Modal/Modal';
import DataTableClient from 'app/components/molecules/DataTable/DataTableClient/DataTableClient';
import { loadEventProcesses } from 'store/actions/stream/eventsActions';
import memoize from 'fast-memoize';
import styled from 'styled-components';

const ProcessLinkRenderer = ({ data, value }: Object) => {
    if (!data || !value){
        return null;
    }
    return <Link to={`/abox/process/${data.id}`}>{value}</Link>;
};

const ContentAreaStyle = styled.div`
  overflow: auto;
`;

/**
 * @public
 * Renders process icon with number of processes for the event
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
class ProcessRenderer extends PureComponent<Object, Object> {

    static propTypes = {
        /* props */
        eventId: PropTypes.number.isRequired,
        processInstances: PropTypes.arrayOf(PropTypes.object),
        color: PropTypes.string,
        /* redux */
        loadEventProcesses: PropTypes.func.isRequired,
        processes: PropTypes.arrayOf(PropTypes.object).isRequired,
        isLoading: PropTypes.bool.isRequired,
    };

    columnDefinitions = [
        { header: 'ID', field: 'id', bodyComponent: ProcessLinkRenderer, style: { width: '100px' } },
        { header: 'Process', field: 'name', bodyComponent: ProcessLinkRenderer, style: { width: '400px' } },
        { header: 'Start Time', field: 'createDate', type: 'date' },
        { header: 'Started by', field: 'createdBy.name' },
    ].map(column => ({ ...column, filter: false, sortable: false }));

    messageStyle = { padding: '12px 12px 0px 12px' };

    /**
     *
     */
    constructor(props: Object) {
        super(props);
        this.state = { visible: false };
    }

    getProcessesIds = memoize(processInstances => (processInstances || []).map(({ id }) => id));

    toggleModal = (event: ?Object) => {
        if (event) {
            event.preventDefault();
        }

        const { processInstances, loadEventProcesses } = this.props;
        const { visible } = this.state;
        if (!visible) {
            const processesIds = this.getProcessesIds(processInstances);
            if (processesIds.length > 0) {
                loadEventProcesses(processesIds);
            }
        }
        this.setState({ visible: !visible });
    };

    /**
     * @override
     */
    render() {
        const { eventId, processInstances, color, isLoading, processes } = this.props;
        const ids = this.getProcessesIds(processInstances);
        let message = '';
        const notVisible = ids.length - processes.length;
        if (notVisible > 0 && !isLoading) {
            if (ids.length === 1) {
                message = `You are not allowed to see the process associated to the event.`;
            } else if (processes.length === 0) {
                message = `You are not allowed to see the processes associated to the event.`;
            } else {
                message = `You are not allowed to see ${notVisible} of the ${ids.length} processes associated to the event.`;
            }
        }
        return (
            <Fragment>
                <ButtonIcon icon="abox" type="af" title="No of Processes" alt="No of Processes" size="md" iconColor={color} onClick={this.toggleModal} />
                {ids.length}
                <Modal
                    open={!!ids.length && this.state.visible}
                    onToggle={this.toggleModal}
                    disableBack
                    title={`Processes related to the Event ${eventId}`}
                >
                    <ContentAreaStyle>
                        <DataTableClient
                            dataTableId="hellomyfriend"
                            columnDefinitions={this.columnDefinitions}
                            value={processes}
                            isLoading={isLoading}
                            disableCountdown={true}
                            totalRecords={processes.length}
                        />
                    </ContentAreaStyle>

                    <span style={this.messageStyle}>{message}</span>
                </Modal>
            </Fragment>
        );
    }
}

export default connect(
    state => ( {
        isLoading: state.stream.events.processes.isLoading,
        processes: state.stream.events.processes.list,
    } ),
    { loadEventProcesses }
)(ProcessRenderer);
