/* @flow */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadClassificationsDropDownForGrid } from 'store/actions/grid/gridActions';
import { CUSTOM_ENTITIES_CHILDREN_DATA_TABLE } from 'app/config/dataTableIds';
import LabelListRenderer from 'app/components/molecules/Grid/Renderers/LabelListRenderer/LabelListRenderer';
import TreeDataTable from 'app/components/molecules/DataTable/DataTableClient/TreeDataTable';
import { loadCustomEntityChildren } from 'store/actions/entities/customEntitiesActions';
import Immutable from 'app/utils/immutable/Immutable';
import { formatDate } from 'app/utils/date/date';
import Link from 'app/components/atoms/Link/Link';
import styled from 'styled-components';
import Icon from 'app/components/atoms/Icon/Icon';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import Layout from 'app/components/molecules/Layout/Layout';
import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';

/**
 * Renders a link to navigate to the specified Custom Entity
 *
 * @param {Object} props - the Component's properties
 * @return {ReactDOM} - return a JSX Element
 */
const ChildLinkRenderer = ({ data, value }: Object) => {
    if (!value) {
        return null;
    }
    return <Link to={`/custom-entities/${data.id}/summary`}>{value}</Link>;
};

const StyledIcon = styled(Icon)`
    color: ${({ color }) => color || 'white'};
`;

/**
 * Shows the Custom Entity Children grid view.
 */
class CustomEntityChildrenGrid extends Component<Object, Object> {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        loadCustomEntityChildren: PropTypes.func.isRequired,
        children: PropTypes.array,
    };

    columnDefs: Object[];

    loadParams: Object;

    state = {
        list: [],
    };

    gridSettings = {
        pageSize: 10,
        filters: {},
        sort: [],
        globalFilter: { value: '' },
    };

    buildColumnDefinitions = () => {
        return [
            {
                header: 'Entity Name',
                field: 'name',
                sortable: false,
                bodyComponent: ({ data, value }) => <ChildLinkRenderer data={data} value={value}/>,
            },
            {
                header: 'Entity ID',
                field: 'id',
                type: 'number',
                sortable: false,
                bodyComponent: ({ value }) => <Link to={`/custom-entities/${value}`}>{value}</Link>,
                style: { width: '120px' },
            },
            {
                header: 'Icon',
                field: 'iconName',
                bodyComponent: ({ data, value }) => (value ? <StyledIcon
                    title={value}
                    name={value}
                    color={data && data.iconColor}
                /> : <div/>),
                filter: false,
                sortable: false,
                style: { width: '100px', textAlign: 'center' },
            },
            {
                header: 'Entity Status',
                field: 'active',
                type: 'boolean',
                sortable: false,
                bodyComponent: BooleanRenderer,
                renderValue: ({ value }) => (value ? 'Active' : 'Inactive'),
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' },
                ],
                style: { width: '180px', textAlign: 'center' },
            },
            {
                header: 'Classifications',
                field: 'classesUris',
                sortable: false,
                bodyComponent: LabelListRenderer,
                bodyComponentProps: { label: 'name', redirectTo: 'entity' },
                bodyComponentDataMap: { value: 'classes' },
                style: { width: '300px' },
                options: (this.props.classifications || []).map(({ uri, name }) => ({ value: uri, label: name })),
            },
            {
                header: 'Added By',
                field: 'createdByName',
                sortable: false,
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: { idProperty: 'createdBy.id', imageProperty: 'createdBy.image', nameProperty: 'createdBy.name' },
            },
            {
                header: 'Date Added',
                field: 'createdDate',
                type: 'date',
                sortable: false,
                renderValue: ({ value }) => formatDate(value),
            },
            {
                header: 'Modified By',
                field: 'modifiedByName',
                sortable: false,
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: { idProperty: 'modifiedBy.id', imageProperty: 'modifiedBy.image', nameProperty: 'modifiedBy.name' },
            },
            {
                header: 'Date Modified',
                field: 'modifiedDate',
                type: 'date',
                sortable: false,
                renderValue: ({ value }) => formatDate(value),
            },
        ];
    };

    /**
     * @override
     */
    componentDidMount() {
        this.props.loadClassificationsDropDownForGrid({
            filterBy: [
                { field: 'active', op: '=', value: true },
                { field: 'applicableOn', op: '=', value: 'custom' },
            ],
        });
        this.props.loadCustomEntityChildren(this.props.match.params.id);
    }

    /**
     * @override
     */
    componentDidUpdate(prevProps: Object) {
        const children = this.props.children || [];
        if (prevProps.children !== children) {
            const { id } = this.props;
            if (children.length && children[0].parent.id) {
                if (children[0].parent.id === Number(id)) {
                    this.setState({
                        list: Immutable(this.buildFlatList(children, id, [])),
                    });
                } else {
                    this.setState({
                        list: Immutable(this.buildFlatList(children, children[0].parent.id, [...this.state.list])),
                    });
                }
            }
        }
    }

    /**
     *
     */
    buildFlatList(records, parentId, accumulator = []) {
        accumulator.push(
            ...records.map(record => ({
                ...record,
                children: undefined,
                parentId,
                classesUris: (record.classes || []).map(cl => cl.uri).join(','),
                createdByName: record.createdBy && record.createdBy.name,
                modifiedByName: record.modifiedBy && record.modifiedBy.name,
            })),
        );
        records.filter(record => record.children)
            .forEach(record => this.buildFlatList(record.children, record.id, accumulator));
        return accumulator;
    }

    /**
     * Loads the nephews of the node with the specified id (if any)
     */
    loadChildren = (id) => {
        this.props.loadCustomEntityChildren(id);
    };

    /**
     * @override
     */
    render(): Object {
        const { isLoading, classificationsLoading } = this.props;
        const { list } = this.state;
        const { gridSettings } = this;
        const TreeDataTableElement = (
            <TreeDataTable
                dataTableId={CUSTOM_ENTITIES_CHILDREN_DATA_TABLE}
                savePreferences={true}
                gridSettings={gridSettings}
                columnDefinitions={this.buildColumnDefinitions()}
                isLoading={isLoading || classificationsLoading}
                data={list}
                disableExport={true}
                selectionMode="single"
                dataKey="id"
                metaKeySelection={false}
                loadChildren={this.loadChildren}
                disableExpandAll
            />
        );
        return <Layout content={TreeDataTableElement} noPadding={true}/>;
    }
}

export default connect(
    (state: Object, ownProps: Object) => ({
        id: ownProps.match.params.id,
        children: state.entities.customEntities.children.data,
        isLoading: state.entities.customEntities.children.isLoading,
        classificationsLoading: state.grid.dropdowns.classifications.isLoading,
        classifications: state.grid.dropdowns.classifications.records,
    }),
    { loadCustomEntityChildren, loadClassificationsDropDownForGrid },
)(CustomEntityChildrenGrid);
