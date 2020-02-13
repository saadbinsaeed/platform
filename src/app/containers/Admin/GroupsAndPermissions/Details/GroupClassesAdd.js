/* @flow */

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import SelectClassesGrid from 'app/containers/Common/SelectionGrids/SelectClassesGrid';
import { addEntitiesToGroup } from 'store/actions/admin/groupsActions';
import Button from 'app/components/atoms/Button/Button';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import history from 'store/History';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import PageTemplate from 'app/components/templates/PageTemplate';
import Text from 'app/components/atoms/Text/Text';
import Immutable from 'app/utils/immutable/Immutable';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import LabelListRenderer from '../../../../components/molecules/Grid/Renderers/LabelListRenderer/LabelListRenderer';
import BooleanRenderer from 'app/components/molecules/Grid/Renderers/BooleanRenderer/BooleanRenderer';
import { capitalizeFirstLetter } from 'app/utils/utils';
import { GROUP_CLASSIFICATIONS_ADD_DATA_TABLE } from 'app/config/dataTableIds';
import { bind, memoize } from 'app/utils/decorators/decoratorUtils';

/**
 * Renders the view to add Groups and Permissions.
 */
class GroupClassesAdd extends PureComponent<Object, Object> {
    static propTypes = {
        addEntitiesToGroup: PropTypes.func.isRequired,
        addingEntities: PropTypes.bool,
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired }),
    };

    state: Object = Immutable({
        selectedRows: [],
        selectedRowsCount: 0,
    });

    /**
     * Adds an the selected Entities to the group
     */
    @bind
    addClasses(event) {
        event.preventDefault();
        const { id: groupId } = this.props.match.params;
        this.props.addEntitiesToGroup(groupId, 'classification', this.state.selectedRows)
            .then ((response) => {
                if (!(response instanceof Error)){
                    this.redirectBack();
                }
            });
    };

    /**
     * @param selectedRows
     */
    @bind
    onSelectionChange(selectedRows: Object[]) {
        this.setState(
            Immutable({
                selectedRows,
                selectedRowsCount: selectedRows.length,
            }),
        );
    };

    /**
     * redirect back to classification tab
     */
    @bind
    redirectBack() {
        const id = this.props.match.params.id;
        if (!id) {
            return null;
        }
        history.push(`/groups/${id}/classifications`);
    };

    @bind
    @memoize()
    buildCustomWhere(id, isAdmin) {
        const customWhere = [
            { field: 'abstract', op: '<>', value: true },
        ];
        if (!isAdmin) {
            customWhere.push({ field: 'active', op: '=', value: true });
        }
        return customWhere;
    }

    @bind
    @memoize()
    buildExcludeBy(id) {
        return [{ field: 'entityGroups.group.id', op: '=', value: id }];
    }

    /**
     * @override
     */
    render(): Object {
        const { userProfile: { isAdmin } } = this.props;
        const counter = this.state.selectedRowsCount;
        const customWhere = this.buildCustomWhere(this.props.match.params.id, isAdmin);
        const excludeBy = this.buildExcludeBy(this.props.match.params.id);
        const customColumnDefinitions = [
            {
                header: 'Abstract',
                field: 'abstract',
                sortable: false,
                bodyComponent: BooleanRenderer,
                renderValue: ({ value }) => value ? 'Abstract' : 'Non-abstract',
                type: 'boolean',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Abstract', value: true },
                    { label: 'Non-abstract', value: false },
                ],
                style: { width: '150px', textAlign: 'center' },
            },
            {
                header: 'Applies To',
                field: 'applicableOn',
                sortable: false,
                bodyComponent: ({ value, ...rest }) => (
                    <LabelListRenderer {...rest} value={value && value.filter(Boolean)
                        .map(v => v === 'custom' ? 'Custom Entity' : capitalizeFirstLetter(v))}
                    />),
                options: [
                    { label: 'Thing', value: 'thing' },
                    { label: 'Person', value: 'person' },
                    { label: 'Organisation', value: 'organisation' },
                    { label: 'Custom Entity', value: 'custom' },
                    { label: 'Group', value: 'group' },
                    { label: 'Process', value: 'process' },
                    { label: 'Relationship', value: 'relationship' },
                ],
                renderValue: ({ value }) => value && value.filter(Boolean)
                    .map(v => v === 'custom' ? 'Custom Entity' : capitalizeFirstLetter(v))
                    .join(','),
                filterMatchMode: '=',
            },
        ];
        if (isAdmin) {
            customColumnDefinitions.unshift({
                header: 'Active',
                field: 'active',
                bodyComponent: BooleanRenderer,
                sortable: false,
                renderValue: ({ value }) => value ? 'Active' : 'Inactive',
                type: 'boolean',
                options: [
                    { label: 'All', value: '' },
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false },
                ],
                style: { width: '100px', textAlign: 'center' },
            });
        }
        return (
            <PageTemplate title="Add Classes">
                <ContentArea>
                    <SelectClassesGrid
                        dataTableId={GROUP_CLASSIFICATIONS_ADD_DATA_TABLE}
                        onSelectionChange={this.onSelectionChange}
                        match={this.props.match.params.id}
                        selectedRows={this.state.selectedRows}
                        selectionMode={'multiple'}
                        customWhere={customWhere}
                        excludeBy={excludeBy}
                        customColumnDefinitions={customColumnDefinitions}
                    />
                </ContentArea>
                <FooterBar>
                    <div>
                        <Button
                            disabled={counter === 0 || this.props.addingEntities}
                            loading={false}
                            type="submit"
                            color="primary"
                            onClick={this.addClasses}
                        >
                            {counter <= 1 ? 'Add Class' : 'Add Classes'}
                        </Button>
                        <Text>
                            {' '}
                            {counter} {counter === 1 ? 'class selected.' : 'classes selected.'}{' '}
                        </Text>
                    </div>
                    <Button type="button" onClick={this.redirectBack}>
                        Cancel
                    </Button>
                </FooterBar>
            </PageTemplate>
        );
    }
}

export default connect(
    state => ({
        savingGroup: state.admin.groups.group.savingGroup,
        addingEntities: state.admin.groups.addingEntities.isLoading,
        userProfile: state.user.profile,
    }),
    {
        addEntitiesToGroup,
    }
)(GroupClassesAdd);
