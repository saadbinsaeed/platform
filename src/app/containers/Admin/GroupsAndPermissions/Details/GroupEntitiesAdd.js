/* @flow */

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import SelectEntitiesGrid from 'app/containers/Common/SelectionGrids/SelectEntitiesGrid';
import Button from 'app/components/atoms/Button/Button';
import Immutable from 'app/utils/immutable/Immutable';

import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import { addEntitiesToGroup } from 'store/actions/admin/groupsActions';
import history from 'store/History';
import PageTemplate from 'app/components/templates/PageTemplate';
import Text from 'app/components/atoms/Text/Text';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { GROUP_ENTITIES_ADD_DATA_TABLE } from 'app/config/dataTableIds';
import { bind } from 'app/utils/decorators/decoratorUtils';

/**
 * Renders the view to add Groups and Permissions.
 */
class GroupUsersAdd extends PureComponent<Object, Object> {
    static propTypes = {
        addEntitiesToGroup: PropTypes.func.isRequired,
        addingEntities: PropTypes.bool,
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired }),
    };

    state: Object = Immutable({
        selectedRowsCount: 0,
        selectedRows: [],
    });

    /**
     * Adds an the selected Entities to the group
     */
    @bind
    addEntities(event) {
        event.preventDefault();
        const { type: entityType, id: groupId } = this.props.match.params;
        this.props.addEntitiesToGroup(groupId, entityType, this.state.selectedRows)
            .then ((response) => {
                if (!(response instanceof Error)){
                    history.push(`/groups/${groupId}/entities/${entityType}`);
                }
            });
    };

    /**
     * @param selectedRows
     */
    @bind
    onSelectionChanged(selectedRows) {
        this.setState(
            Immutable({
                selectedRows,
                selectedRowsCount: selectedRows.length,
            }),
        );
    };

    /**
     * @override
     */
    render(): Object {
        const counter = this.state.selectedRowsCount;
        const { type, id } = this.props.match.params;
        let title = null;
        const singular = {
            proc_def: 'Add Process Definition',
            person: 'Add Person',
            organisation: 'Add Organisation',
            thing: 'Add Thing',
            custom: 'Add Custom Entity',
        };
        const singleSelected = {
            proc_def: 'Process Definition selected.',
            person: 'Person selected.',
            organisation: 'Organisation selected.',
            thing: 'Thing selected.',
            custom: 'Custom Entity selected.',
        };
        const multiSelected = {
            proc_def: 'Process Definitions selected.',
            person: 'People selected.',
            organisation: 'Organisations selected.',
            thing: 'Things selected.',
            custom: 'Custom Entities selected.',
        };
        if (type === 'proc_def') {
            title = 'Add Process Definitions';
        }
        if (type === 'person') {
            title = 'Add People';
        }
        if (type === 'organisation') {
            title = 'Add Organisations';
        }
        if (type === 'thing') {
            title = 'Add Things';
        }
        if (type === 'custom') {
            title = 'Add Custom Entities';
        }
        return (
            <PageTemplate title={title}>
                <ContentArea>
                    <SelectEntitiesGrid
                        dataTableId={GROUP_ENTITIES_ADD_DATA_TABLE}
                        entityType={type}
                        onSelectionChanged={this.onSelectionChanged}
                        groupId={id}
                    />
                </ContentArea>
                <FooterBar>
                    <div>
                        <Button
                            disabled={counter === 0 || this.props.addingEntities}
                            loading={false}
                            type="submit"
                            color="primary"
                            onClick={this.addEntities}
                        >
                            {counter <= 1 ? singular[type] : title}
                        </Button>
                        <Text>
                            {' '}
                            {counter} {counter === 1 ? singleSelected[type] : multiSelected[type]}{' '}
                        </Text>
                    </div>
                    <Button type="button" onClick={() => history.push(`/groups/${id}/entities/${type}`)}>
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
    }),
    {
        addEntitiesToGroup,
    },
)(GroupUsersAdd);
