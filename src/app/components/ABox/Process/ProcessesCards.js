/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import ProcessCard from 'app/components/ABox/Process/ProcessCard';
import Filters from 'app/components/organisms/Filters/Filters';
import VirtualListManaged from 'app/components/molecules/VirtualList/VirtualListManaged';
import ResizableListItem from 'app/components/molecules/VirtualList/ResizableListItem';
import { cancelProcess, loadProcessesCards } from 'store/actions/abox/processActions';
import { addProcessComment } from 'store/actions/messenger/messengerActions';
import { set } from 'app/utils/lo/lo';

const ProcessCardContainer = styled.div`
width: 100%;
max-width: 1024px;
margin: 0 auto;
`;

/**
 *
 */
class ProcessesCards extends PureComponent<Object, Object> {

    /**
     * @const propTypes - describes the properties of the component
     * @const defaultProps - define the defaults values of the properties
     * @const filterDefinitions -definition for columns that we need to display in our grid
     */
    static propTypes = {
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        startIndex: PropTypes.number,
        totalRecords: PropTypes.number,
        loadProcessesCards: PropTypes.func.isRequired,
        addProcessComment: PropTypes.func,
    };

    static defaultProps = {
        isLoading: false
    };

    state = { deleted: {} };

    // $FlowFixMe
    virtualListRef = React.createRef();

    filterDefinitions: Array<Object> = [
        {
            field: 'name',
            type: 'text',
            properties: {
                label: 'Name',
                name: 'name'
            },
        },
        {
            field: 'id',
            type: 'text',
            properties: {
                label: 'Process ID',
                name: 'id'
            },
            condition: '=',
        },
        {
            field: 'createdBy.id',
            type: 'userTypeahead',
            properties: {
                label: 'Created by',
                name: 'createdById',
            },
            condition: '=',
        },
        {
            field: 'createDate',
            type: 'dateTimeRange',
            properties: {
                label: 'Created date',
                name: 'createDate',
            },
        },
        {
            field: 'status.lastUpdate',
            type: 'dateTimeRange',
            properties: {
                label: 'Last updated',
                name: 'statusLastUpdate',
            },
        },
        {
            field: 'processDefinition.name',
            type: 'processTypeTypeahead',
            properties: {
                label: 'Process Type',
                name: 'processDefinitionName',
            },
            condition: '='
        },
    ];
    searchBar = ['name', 'id'];
    defaultOrder = [{field: 'createDate', direction: 'desc'}];


    /**
     *
     */
    cancelProcess = (id) => {
        this.props.cancelProcess(id).then((response) => {
            if (response instanceof Error) return;
            this.setState({ deleted: set(this.state.deleted, id, true) }, this.forceUpdateGrid);
        });
    };


    renderComponent = ({ index, data, resize, style }: Object) => {
        const { deleted } = this.state;
        const id = data && data.id;
        return (
            <ResizableListItem key={index} style={style} index={index} resize={resize} padding={15}>
                {resizeRow =>
                    <ProcessCardContainer>
                        <ProcessCard
                            index={index}
                            data={data}
                            addProcessComment={this.props.addProcessComment}
                            cancelProcess={this.cancelProcess}
                            isDeleted={id && deleted[id]}
                            forceUpdateGrid={this.forceUpdateGrid}
                            resetView={this.resetView}
                            user={this.props.profile}
                            resizeRow={resizeRow}
                        />
                    </ProcessCardContainer>
                }
            </ResizableListItem>
        );
    };

    forceUpdateGrid = () => {
        this.virtualListRef.current && this.virtualListRef.current.forceUpdate();
    };

    resetView = () => {
        this.virtualListRef.current && this.virtualListRef.current.resetView();
    };

    /**
     * @override
     */
    render(): Object {
        const { records, isLoading, totalRecords, startIndex, loadProcessesCards } = this.props;
        return (
            <Filters
                id="ProcessesCards"
                filterDefinitions={this.filterDefinitions}
                defaultOrder={this.defaultOrder}
                searchBar={this.searchBar}
            >
                {(filterBy, orderBy) => (
                    <VirtualListManaged
                        ref={this.virtualListRef}
                        renderComponent={this.renderComponent}
                        itemSize={310}
                        itemCount={totalRecords || 0}
                        loadData={loadProcessesCards}
                        isLoading={isLoading}
                        startIndex={startIndex || 0}
                        filterBy={filterBy}
                        orderBy={orderBy}
                        list={records}
                        maxWidth="1024"
                        title={`${totalRecords >= 1000 ? '999+' : totalRecords } Processes`}
                    />
                )}
            </Filters>
        );
    }
}

export default connect(state => ({
    isLoading: state.abox.processesCards.isLoading,
    startIndex: state.abox.processesCards.startIndex,
    records: state.abox.processesCards.records,
    totalRecords: state.abox.processesCards.count,
    profile: state.user.profile,
}), {
    loadProcessesCards,
    cancelProcess,
    addProcessComment,
})(ProcessesCards);
