/* @flow */

import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isMobile } from 'react-device-detect';

import GroupEntitiesGrid from 'app/containers/Admin/GroupsAndPermissions/Details/Tabs/GroupEntitiesTab/GroupEntitiesGrid';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import FooterBar from 'app/components/molecules/FooterBar/FooterBar';
import TextIcon from 'app/components/molecules/TextIcon/TextIcon';
import Layout from 'app/components/molecules/Layout/Layout';
import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import ButtonIcon from 'app/components/molecules/ButtonIcon/ButtonIcon';
import { get } from 'app/utils/lo/lo';
import history from 'store/History';
import GroupTabEdit from 'app/containers/Admin/GroupsAndPermissions/Details/GroupTabEdit';
import { bind } from 'app/utils/decorators/decoratorUtils';

/**
 * Container that is used to display the Entities tab of the Groups & Permissions details view.
 */
class GroupEntitiesTab extends PureComponent<Object, Object> {
    static propTypes = {
        group: PropTypes.object,
        selectedEntities: PropTypes.array,
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired, type: PropTypes.string.isRequired }),
        userProfile: PropTypes.object.isRequired
    };

    canEdit: boolean;
    id: string;

    static defaultProps = {
        leftNavOpen: !isMobile
    };
    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            menuToggled: false,
            visible: false,
        };
        const { group, match } = this.props;
        this.id = String(get(match, 'params.id'));
        const { permissions, isAdmin } = props.userProfile;
        const permissionsSet = new Set(permissions || []);
        this.canEdit = group && group.id !== 1 && (isAdmin || permissionsSet.has('admin.group.edit'));
    }

    @bind
    toggleMenu(){
        this.setState(prevState => ({ menuToggled: !prevState.menuToggled }));
    };

    goTo = type => (e) => {
        e.preventDefault();
        history.push(`/groups/${this.id}/entities/${type}/add`);
    };

    @bind
    showDialog(){
        this.setState({ visible: true });
    };

    @bind
    closeDialog(){
        this.setState({ visible: false });
    };

    /**
     * @override
     */
    render() {
        const groupId = this.props.match.params.id;
        const entityType = this.props.match.params.type;
        const { selectedEntities = [] } = this.props;
        let organisationAction = null,
            thingAction = null,
            peopleAction = null,
            processDefAction = null,
            customEntityAction = null;
        if (this.canEdit) {
            organisationAction = (
                <ButtonIcon icon="plus" onClick={this.goTo('organisation')}/>
            );
            customEntityAction = (
                <ButtonIcon icon="plus" onClick={this.goTo('custom')}/>
            );
            thingAction = (
                <ButtonIcon icon="plus" onClick={this.goTo('thing')}/>
            );
            peopleAction = (
                <ButtonIcon icon="plus" onClick={this.goTo('person')}/>
            );
            processDefAction = (
                <ButtonIcon icon="plus" onClick={this.goTo('proc_def')}/>
            );
        }
        const grid = <GroupEntitiesGrid groupId={groupId} entityType={entityType} toggleMenu={this.toggleMenu} showMenuButton={this.canEdit} />;
        return (
            <Fragment>
                <Layout
                    isToggled={this.state.menuToggled}
                    leftNavOpen={this.props.leftNavOpen}
                    noPadding
                    leftSidebar={
                        this.canEdit ? (
                            <Menu>
                                <MenuItem
                                    name="Things"
                                    to={{ pathname: `/groups/${this.id}/entities/thing`, state: { leftNavOpen: true } }}
                                    className={entityType === 'thing' ? 'active' : ''}
                                    actions={thingAction}
                                />
                                <MenuItem
                                    name="People"
                                    to={{ pathname: `/groups/${this.id}/entities/person`, state: { leftNavOpen: true } }}
                                    className={entityType === 'person' ? 'active' : ''}
                                    actions={peopleAction}
                                />
                                <MenuItem
                                    name="Organisations"
                                    to={{ pathname: `/groups/${this.id}/entities/organisation`, state: { leftNavOpen: true } }}
                                    className={entityType === 'organisation' ? 'active' : ''}
                                    actions={organisationAction}
                                />
                                <MenuItem
                                    name="Custom Entities"
                                    to={{ pathname: `/groups/${this.id}/entities/custom`, state: { leftNavOpen: true } }}
                                    className={entityType === 'custom' ? 'active' : ''}
                                    actions={customEntityAction}
                                />

                                <MenuItem
                                    name="Process Definitions"
                                    to={{ pathname: `/groups/${this.id}/entities/proc_def`, state: { leftNavOpen: true } }}
                                    className={entityType === 'proc_def' ? 'active' : ''}
                                    actions={processDefAction}
                                />
                            </Menu>
                        ) : null
                    }
                    content={grid}
                />
                <FooterBar>
                    <div>
                        {selectedEntities.length > 0 && this.canEdit && (
                            <TextIcon icon="pencil" label="Edit" onClick={this.showDialog} count={selectedEntities.length} color="secondary" />
                        )}
                    </div>
                    <GroupTabEdit groupId={groupId} selectedRow={selectedEntities} closeDialog={this.closeDialog} open={this.state.visible} />
                </FooterBar>
            </Fragment>
        );
    }
}

export default connect(state => ({
    selectedEntities: state.admin.groups.group.selectedEntities,
    group: state.admin.groups.group.details,
    userProfile: state.user.profile
}))(GroupEntitiesTab);
