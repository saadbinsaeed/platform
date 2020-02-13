/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import memoize from 'memoize-one';

import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import { loadClassificationEntities } from 'store/actions/classifications/classificationsActions';
import ThingLink from 'app/components/atoms/Link/ThingLink';
import PeopleLink from 'app/components/atoms/Link/PeopleLink';
import OrganisationsLink from 'app/components/atoms/Link/OrganisationsLink';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { loadClassificationsDropDownForGrid } from 'store/actions/grid/gridActions';
import ClassificationsRenderer
    from 'app/components/molecules/Grid/Renderers/ClassificationsRenderer/ClassificationsRenderer';
import EntityAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/EntityAvatarRenderer';
import { CLASSIFICATION_ENTITIES_DATA_TABLE } from 'app/config/dataTableIds';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';

const EntityLinkRenderer = (props: Object) => {
    switch (props.data.type) {
        case 'thing':
            return <ThingLink {...props} id={props.value}>{props.value}</ThingLink>;
        case 'person':
            return <PeopleLink {...props} id={props.value}>{props.value}</PeopleLink>;
        case 'organisation':
            return <OrganisationsLink {...props} id={props.value}>{props.value}</OrganisationsLink>;
        default:
            return <span>{props.value}</span>;
    }
};

/**
 * Container that is used to display the Entities tab of the Groups & Permissions details view.
 */
class ClassificationEntitiesTab extends PureComponent<Object, Object> {

    static propTypes = {
        loadClassificationEntities: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        records: PropTypes.array,
        count: PropTypes.number,
        countMax: PropTypes.number,
        classification: PropTypes.object.isRequired,
        userProfile: PropTypes.object,
    };

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);
        this.state = { selectedRowsCount: 0, selectedRows: [] };

        this.loadClassificationDropdown();
    }

    buildColumnDefinitions = memoize((classifications, isAdmin) => {
        const columns = [
            {
                header: 'Name',
                field: 'name',
                bodyComponent: EntityAvatarRenderer,
                imageProperty: 'image',
                nameProperty: 'name',
            },
            {
                header: 'Classifications',
                field: 'classificationUris',
                filterMatchMode: '=',
                sortable: false,
                bodyComponent: props => <ClassificationsRenderer {...props} valueField="classes"
                    label={'name'}
                    redirectTo={props.data.type}
                />,
                renderValue: ({ data }) => data && (data.classes || []).map(({ name }) => name).join(', '),
                options: (classifications || []).map(({ name, uri }) => ({ value: uri, label: name })),
                style: { minWidth: '450px' },
            },
            {
                header: 'Id',
                field: 'id',
                type: 'number',
                bodyComponent: EntityLinkRenderer,
                filterMatchMode: '=',
                style: { width: '100px' },
            },
            { header: 'Type', field: 'type', style: { width: '200px' } },
        ];
        if (isAdmin) {
            columns.push({
                header: 'Active',
                field: 'active',
                type: 'boolean',
                sortable: false,
                bodyComponent: BooleanRenderer,
                bodyComponentProps: { isTrue: value => value === true },
                renderValue: ({ value }) => value === true ? 'Active' : 'Inactive',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                ],
                style: { width: '100px', textAlign: 'center' },
            });
        }
        return columns;
    });

    gridSettings = {
        pageSize: 10,
        filters: {},
        sort: [],
        globalFilter: { value: '' },
    };

    /**
     * componentDidUpdate - description
     *
     * @return {type}  description
     */
    componentDidUpdate(prevProps) {
        const prevCls = prevProps.classification || {};
        const newCls = this.props.classification || {};
        if (prevCls.uri !== newCls.uri) {
            this.loadClassificationDropdown();
        }
    }

    /**
     * load filter option for dropdown
     */
    loadClassificationDropdown = () => {
        const cls = this.props.classification || {};
        if (cls.uri) {
            const filterBy = [
                { field: 'entities.classes.uri', op: '=', value: cls.uri },
            ];
            if (!this.props.userProfile.isAdmin) {
                filterBy.push({ field: 'entities.active', op: '=', value: true });
                filterBy.push({ field: 'active', op: '=', value: true });
            }
            this.props.loadClassificationsDropDownForGrid({
                page: 1,
                itemsPerPage: 1000,
                filterBy,
            });
        }

    };

    /**
     * @override
     */
    render() {
        const { classification, classifications, userProfile: { isAdmin } } = this.props;
        if (!classification.uri) {
            return null;
        }
        const customWhere = [
            { field: 'classes.uri', op: '=', value: classification.uri },
        ];
        if (!isAdmin) {
            customWhere.push({ field: 'active', op: '=', value: true });
        }
        const records = this.props.records || [];
        return (
            <ContentArea>
                <DataTable
                    dataTableId={CLASSIFICATION_ENTITIES_DATA_TABLE}
                    savePreferences={true}
                    customWhere={customWhere}
                    columnDefinitions={this.buildColumnDefinitions(classifications, isAdmin)}
                    loadRows={this.props.loadClassificationEntities}
                    gridSettings={this.gridSettings}
                    isLoading={this.props.isLoading}
                    isDownloading={this.props.isDownloading}
                    totalRecords={this.props.count}
                    countMax={this.props.countMax}
                    name="classification_entities_list"
                    disableCountdown={true}
                    value={records}
                    dataKey={'id'}
                    selectionMode="multiple"
                />
            </ContentArea>
        );
    }

}

export default connect(
    state => ({
        isLoading: state.classifications.entities.isLoading || state.grid.dropdowns.classifications.isLoading,
        isDownloading: state.classifications.entities.isDownloading,
        records: state.classifications.entities.records,
        count: state.classifications.entities.count,
        countMax: state.classifications.entities.countMax,
        classification: state.classifications.details.data || {},
        classifications: state.grid.dropdowns.classifications.records,
        userProfile: state.user.profile,
    }),
    {
        loadClassificationEntities,
        loadClassificationsDropDownForGrid,
    },
)(ClassificationEntitiesTab);
