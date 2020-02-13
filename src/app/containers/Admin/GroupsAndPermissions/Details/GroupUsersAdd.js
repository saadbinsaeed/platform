/* @flow */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from 'app/components/atoms/Button/Button';
import SelectUsersGrid from 'app/containers/Common/SelectionGrids/SelectUsersGrid';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import { addUsersToGroup } from 'store/actions/admin/groupsActions';
import history from 'store/History';
import PageTemplate from 'app/components/templates/PageTemplate';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import Text from 'app/components/atoms/Text/Text';
import ContentArea from 'app/components/molecules/PageContent/ContentArea';
import { GROUP_USERS_ADD_DATA_TABLE } from 'app/config/dataTableIds';
import { bind } from 'app/utils/decorators/decoratorUtils';

/**
 * Renders the view to add Groups and Permissions.
 */
class GroupUsersAdd extends Component<Object, Object> {
    static propTypes = {
        addUsersToGroup: PropTypes.func.isRequired,
        addGroupUserLoading: PropTypes.bool,
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired }),
    };

    /**
     * @param props the Component's properties
     */
    constructor(props) {
        super(props);

        this.state = { selectedRows: [] };
    }

    /**
     * Creates a new group using the form's data
     */
    @bind
    addUsers(event) {
        event.preventDefault();
        const selectedUsers = this.state.selectedRows;
        const groupId = this.props.match.params.id;
        if (selectedUsers) {
            this.props.addUsersToGroup({ groupId, userIds: selectedUsers.map(({ id }) => id) })
                .then ((response) => {
                    if (!(response instanceof Error)){
                        this.redirectBack();
                    }
                });
        }
    };

    /**
     * @param selectedRows
     */
    @bind
    onSelectionChange(selectedRows: Object[]) {
        this.setState({ selectedRows: selectedRows || [] });
    };

    /**
     * redirect back to users tab
     */
    @bind
    redirectBack() {
        const id = this.props.match.params.id;
        if (!id) {
            return null;
        }
        history.push(`/groups/${id}/users`);
    };

    /**
     * @override
     */
    render(): Object {
        const counter = this.state.selectedRows.length;
        return (
            <PageTemplate title="Add users" icon="account-add">
                <ContentArea>
                    <SelectUsersGrid
                        dataTableId={GROUP_USERS_ADD_DATA_TABLE}
                        onSelectionChange={this.onSelectionChange}
                        selectedItems={this.state.selectedRows}
                        groupId={this.props.match.params.id}
                    />
                </ContentArea>
                <FooterBar>
                    <div>
                        <Button
                            disabled={counter === 0 || this.props.addGroupUserLoading}
                            loading={false}
                            type="submit"
                            color="primary"
                            onClick={this.addUsers}
                        >
                            {counter <= 1 ? 'Add user' : 'Add users'}
                        </Button>
                        <Text>
                            {' '}
                            {counter} {counter === 1 ? 'user selected.' : 'users selected.'}{' '}
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
        addGroupUserLoading: state.admin.groups.addGroupUser.isLoading,
    }),
    {
        addUsersToGroup,
    },
)(GroupUsersAdd);
