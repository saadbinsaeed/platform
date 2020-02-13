/* @flow */

/**
 * Render a grid to select one or multiple Users.
 */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import ClassificationLink from 'app/components/Classifications/ClassificationLink/ClassificationLink';
import DataTable from 'app/components/molecules/DataTable/DataTableServer/DataTable';
import { loadClassifications } from 'store/actions/classifications/classificationsActions';
import PersonAvatarRenderer from 'app/components/molecules/Grid/Renderers/Icon/PersonAvatarRenderer';

/**
 * Renders a grid to select one ore more Classes.
 */
class SelectClassesGrid extends PureComponent<Object, Object> {

    static propTypes = {
        loadClassifications: PropTypes.func.isRequired,
        match: PropTypes.string.isRequired,
        selectionMode: PropTypes.string,
        classes: PropTypes.array,
        classesCount: PropTypes.number,
        classesCountMax: PropTypes.number,
        isLoading: PropTypes.bool,
        addingEntities: PropTypes.bool,
        onSelectionChange: PropTypes.func.isRequired,
        selectedRows: PropTypes.any,
        customWhere: PropTypes.array,
        excludeBy: PropTypes.array,
        customColumnDefinitions: PropTypes.array,
        dataTableId: PropTypes.string,
    };

    static defaultProps = {
        isLoading: false,
        addingEntities: false,
        selectionMode: 'multiple',
        customWhere: [],
        customColumnDefinitions: [],
    };

    columnDefinitions: Object[];

    gridSettings: Object;

    /**
     * @param props the Component's properties.
     */
    constructor(props) {
        super(props);
        this.state = { lastUpdateDate: Date.now() };
        this.gridSettings = {
            pageSize: 10,
            filters: {},
            fields: [],
            globalFilter: { value: '' },
        };
        this.columnDefinitions = [
            {
                header: 'Classification URI',
                field: 'uri',
                bodyComponent: ({ data, value }) => <ClassificationLink id={data.id} label={value}/>,
            },
            { header: 'Classification Name', field: 'name' },
            {
                header: 'Created By',
                field: 'createdBy.name',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: {
                    idProperty: 'createdBy.id',
                    imageProperty: 'createdBy.image',
                    nameProperty: 'createdBy.name',
                },
            },
            { header: 'Created Date', field: 'createdDate', type: 'date' },
            {
                header: 'Modified By',
                field: 'modifiedBy.name',
                bodyComponent: PersonAvatarRenderer,
                bodyComponentProps: {
                    idProperty: 'modifiedBy.id',
                    imageProperty: 'modifiedBy.image',
                    nameProperty: 'modifiedBy.name',
                },
            },
            { header: 'Modified Date', field: 'modifiedDate', type: 'date' },
            ...this.props.customColumnDefinitions,
        ];
    }

    componentDidUpdate(prevProps) {
        if (prevProps.addingEntities && !this.props.addingEntities) {
            this.setState({ lastUpdateDate: Date.now() }, () => this.props.onSelectionChange([]));
        }
    }

    /**
     * This function will keep track of the count of selected rows in a grid
     */
    onSelectionChange = (event: Object) => {
        this.props.onSelectionChange(event.data);
    };

    /**
     * @override
     */
    render() {
        const queryParams = { id: this.props.match };
        const {
            customWhere,
            excludeBy,
            isLoading,
            selectionMode,
            isDownloading,
            classes,
            classesCount,
            classesCountMax,
            selectedRows,
            loadClassifications
        } = this.props;
        const { lastUpdateDate } = this.state;
        return (
            <DataTable
                dataKey={'id'}
                dataTableId={this.props.dataTableId}
                key={lastUpdateDate}
                customWhere={customWhere}
                excludeBy={excludeBy}
                gridSettings={this.gridSettings}
                columnDefinitions={this.columnDefinitions}
                loadRows={loadClassifications}
                isLoading={isLoading}
                isDownloading={isDownloading}
                name="select_classes"
                disableCountdown={true}
                disableExport={true}
                value={classes}
                totalRecords={classesCount}
                countMax={classesCountMax}
                onSelectionChange={this.onSelectionChange}
                selectionMode={selectionMode}
                queryParams={queryParams}
                selection={selectedRows}
                savePreferences={true}
            />
        );
    }
}

export default connect(
    state => ({
        classes: state.classifications.list.records,
        classesCount: state.classifications.list.count,
        classesCountMax: state.classifications.list.countMax,
        isLoading: state.classifications.list.isLoading,
        isDownloading: state.classifications.list.isDownloading,
        addingEntities: state.admin.groups.addingEntities.isLoading,
    }),
    { loadClassifications },
)(SelectClassesGrid);
