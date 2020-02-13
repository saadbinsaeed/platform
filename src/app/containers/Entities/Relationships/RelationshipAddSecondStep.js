/* @flow */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import VirtualListManaged from 'app/components/molecules/VirtualList/VirtualListManaged';
import Filters, { Content } from 'app/components/organisms/Filters/Filters';
import memoize from 'memoize-one';
import { loadRelationshipAddEntities } from 'store/actions/entities/relationshipsActions';
import EntityListItem from 'app/containers/Entities/common/EntityListItem';
import { involvementConditions } from 'app/utils/static/filter-conditions';
import { PRIORITY_OPTIONS } from 'app/config/aboxConfig';
import { createEvent } from 'app/utils/http/event';

const ListContainer = styled.div`
    flex-grow: 1;
`;

const HiddenInput = styled.input`
    position: absolute;
    opacity: 0;
    width: 0px;
    height: 0px;
    margin-left: 50%;
    top: 10rem;
`;

const Container = styled.div`
    height: calc(100vh - 94px);
    > * {
        min-height: 100%;
    }
`;
const StyledFilters = styled(Filters)`
    > *:first-child {
        padding-top: 0;
        padding-bottom: 0;
        margin-top: 0;
        margin-bottom: 0;
        background: #343a45;
        box-shadow: 0 2px 1px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.1);
        z-index: 1;
        input {
            padding: 0;
            line-height: 32px;
        }
    }
    ${Content} {
        display: flex;
    }
`;

const StyledEntityListItem = styled(EntityListItem)`
    cursor: pointer;
    background: ${({ selected }) => (selected ? 'rgba(30, 168, 207, 0.2)' : '#343a45')};
`;

/**
 *  RelationshipAddFirstStep view
 */
export class RelationshipAddSecondStep extends PureComponent<Object, Object> {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        entityId: PropTypes.string.isRequired,
        type1: PropTypes.string.isRequired,
        isAdmin: PropTypes.bool,
        value: PropTypes.object
    };

    static defaultProps = {
        isAdmin: false,
        value: {}
    };

    virtualListRef = React.createRef();

    searchBar = ['name', 'id'];

    defaultFilters = {};

    defaultOrder = [{ field: 'name', direction: 'asc' }];

    buildFilterDefinitions = memoize((type: string, isAdmin: boolean = false) => {
        const filters = [];
        if (type === 'process') {
            filters.push(
                ...[
                    {
                        field: 'name',
                        type: 'text',
                        properties: {
                            label: 'Name',
                            name: 'name'
                        }
                    },
                    {
                        field: 'id',
                        type: 'text',
                        properties: {
                            label: 'ID',
                            name: 'id'
                        },
                        condition: '='
                    },
                    {
                        field: 'createdBy.id',
                        type: 'userTypeahead',
                        properties: {
                            label: 'Created By',
                            name: 'createdById'
                        },
                        condition: '='
                    },
                    {
                        field: 'createDate',
                        type: 'dateTimeRange',
                        properties: {
                            label: 'Create Date',
                            name: 'createDate'
                        }
                    },
                    {
                        field: 'endDate',
                        type: 'dateTimeRange',
                        properties: {
                            label: 'End date',
                            name: 'endDate'
                        }
                    },
                    {
                        field: 'status.lastUpdate',
                        type: 'dateTimeRange',
                        properties: {
                            label: 'Update Date',
                            name: 'statusLastUpdate'
                        }
                    }
                ]
            );
        } else if (type === 'task') {
            filters.push(
                ...[
                    {
                        field: 'assignee.id',
                        type: 'userTypeahead',
                        properties: {
                            label: 'Assignee',
                            name: 'assigneeId'
                        },
                        condition: '='
                    },

                    {
                        field: 'involvement',
                        type: 'typeahead',
                        properties: {
                            label: 'My involvement',
                            name: 'involvement',
                            options: involvementConditions
                        },
                        sort: false
                    },
                    {
                        field: 'name',
                        type: 'text',
                        properties: {
                            label: 'Name',
                            name: 'name'
                        }
                    },
                    {
                        field: 'id',
                        type: 'text',
                        properties: {
                            label: 'ID',
                            name: 'id'
                        },
                        condition: '='
                    },
                    {
                        field: 'endDate',
                        type: 'typeahead',
                        properties: {
                            label: 'Status',
                            name: 'status',
                            options: [{ value: 'is null', label: 'Open' }, { value: 'is not null', label: 'Closed' }]
                        },
                        sort: false
                    },
                    {
                        field: 'priority',
                        type: 'typeahead',
                        properties: {
                            label: 'Priority',
                            name: 'priority',
                            options: PRIORITY_OPTIONS
                        },
                        condition: '='
                    },
                    {
                        field: 'startDate',
                        type: 'dateTimeRange',
                        properties: {
                            label: 'Create Date',
                            name: 'startDate'
                        }
                    },
                    {
                        field: 'bpmnVariables.startDate',
                        type: 'dateTimeRange',
                        properties: {
                            label: 'Start Date',
                            name: 'bpmnVariablesStartDate'
                        }
                    },
                    {
                        field: 'dueDate',
                        type: 'dateTimeRange',
                        properties: {
                            label: 'Due Date',
                            name: 'dueDate'
                        }
                    },
                    {
                        field: 'endDate',
                        type: 'dateTimeRange',
                        properties: {
                            label: 'End Date',
                            name: 'endDate'
                        }
                    },
                    {
                        field: 'taskStatus.lastUpdate',
                        type: 'dateTimeRange',
                        properties: {
                            label: 'Update Date',
                            name: 'taskStatusLastUpdate'
                        }
                    }
                ]
            );
        } else {
            filters.push(
                ...[
                    {
                        field: 'id',
                        type: 'number',
                        properties: {
                            label: 'ID',
                            name: 'id'
                        },
                        condition: '='
                    },
                    {
                        field: 'name',
                        type: 'text',
                        properties: {
                            label: 'Name',
                            name: 'name'
                        }
                    },
                    {
                        field: 'description',
                        type: 'text',
                        properties: {
                            label: 'Description',
                            name: 'description'
                        }
                    }
                ]
            );
            if (isAdmin) {
                filters.push({
                    field: 'active',
                    type: 'boolean',
                    properties: {
                        label: 'Active',
                        name: 'active'
                    },
                    condition: '='
                });
            }
            filters.push(
                ...[
                    {
                        field: 'createdDate',
                        type: 'dateTimeRange',
                        properties: {
                            label: 'Create Date',
                            name: 'createdDate'
                        }
                    },
                    {
                        field: 'createdBy.id',
                        type: 'userTypeahead',
                        properties: {
                            label: 'Created By',
                            name: 'createdById'
                        },
                        condition: '='
                    },
                    {
                        field: 'modifiedDate',
                        type: 'dateTimeRange',
                        properties: {
                            label: 'Modified Date',
                            name: 'modifiedDate'
                        }
                    },
                    {
                        field: 'modifiedBy.id',
                        type: 'userTypeahead',
                        properties: {
                            label: 'Modified By',
                            name: 'modifiedById'
                        },
                        condition: '='
                    }
                ]
            );
        }
        return filters;
    });

    updateList = () => {
        if (this.virtualListRef && this.virtualListRef.current) {
            this.virtualListRef.current.forceUpdate();
        }
    };

    onClick = (event: Object, entity2: Object) => {
        event.preventDefault();
        this.props.onChange(createEvent('change', { name: 'entity2', value: entity2 }));
        this.updateList();
    };

    renderComponent = ({ style, index, data }: { style: Object, index: number, data: Object }) => (
        <div style={style} key={index}>
            <StyledEntityListItem
                data={data}
                title="Click to select"
                type={this.props.value && this.props.value.type2}
                onClick={e => this.onClick(e, data)}
                selected={this.props.value && this.props.value.entity2 && this.props.value.entity2.id === data.id}
            />
        </div>
    );

    loadEntities = memoize((options) => {
        const {
            entityId,
            type1,
            value: { type2, relationDefinition },
            isAdmin
        } = this.props;
        const nType1 = type1 === 'custom' ? 'customEntity' : type1;
        const excludeBy = [...(options.excludeBy || [])];
        const filterBy = [...(options.filterBy || [])];
        const relationshipsKey = type2 === 'process' ? 'relations' : 'relationships';
        if (type1 === type2) {
            filterBy.push({ field: 'id', op: '<>', value: entityId });
        }
        if (!isAdmin && !['task', 'process'].includes(type2)) {
            filterBy.push({ field: 'active', op: '=', value: true });
        }
        if (['task', 'process'].includes(type2)) {
            filterBy.push({ or: [
                { field: 'endDate', op: '>', value: moment().subtract(2, 'months').toISOString() },
                { field: 'endDate', op: 'is null' },
            ] });
        }
        excludeBy.push(
            { or: [
                { field: `${relationshipsKey}.${nType1}1.id`, op: '=', value: entityId },
                { field: `${relationshipsKey}.${nType1}2.id`, op: '=', value: entityId },
            ] },
            { field: `${relationshipsKey}.relationDefinition.id`, op: '=', value: relationDefinition.id },
        );
        return this.props.loadRelationshipAddEntities({ ...options, filterBy, excludeBy }, type2);
    });


    render() {
        const {
            totalRecords,
            isLoading,
            startIndex,
            records,
            isAdmin,
            value: { type2, entity2 }
        } = this.props;
        return (
            <Container>
                <StyledFilters
                    id={`RelationshipsAddFilters/${type2}`}
                    filterDefinitions={this.buildFilterDefinitions(type2, isAdmin)}
                    searchBar={this.searchBar}
                    defaultFilters={this.defaultFilters}
                    defaultOrder={this.defaultOrder}
                >
                    {(filterBy, orderBy) => (
                        <ListContainer>
                            {!entity2 && (
                                <HiddenInput
                                    name="fake_entity2"
                                    type="text"
                                    required
                                    value=""
                                    onChange={this.props.onChange}
                                    onInvalid={e => e.target.setCustomValidity('Please select any record.')}
                                />
                            )}
                            <VirtualListManaged
                                ref={this.virtualListRef}
                                renderComponent={this.renderComponent}
                                itemSize={84}
                                itemCount={totalRecords || 0}
                                loadData={this.loadEntities}
                                isLoading={isLoading}
                                startIndex={startIndex || 0}
                                filterBy={filterBy}
                                orderBy={orderBy}
                                list={records}
                                maxWidth="1024"
                            />
                        </ListContainer>
                    )}
                </StyledFilters>
            </Container>
        );
    }
}

export default connect(
    state => ({
        isLoading: state.entities.relationshipsAdd.isLoading,
        startIndex: state.entities.relationshipsAdd.startIndex,
        records: state.entities.relationshipsAdd.records,
        totalRecords: state.entities.relationshipsAdd.count
    }),
    {
        loadRelationshipAddEntities
    }
)(RelationshipAddSecondStep);
