/* @flow */

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import Layout from 'app/components/molecules/Layout/Layout';
import Icon from 'app/components/atoms/Icon/Icon';
import Menu from 'app/components/molecules/Menu/Menu';
import MenuItem from 'app/components/molecules/Menu/MenuItem';
import RelationshipsGrid from './RelationshipsGrid';

/**
 * @class
 * Container that is used to display the Relationship of an entity
 */
class RelationshipsView extends PureComponent<Object, Object> {

    /**
     * @const {Object} propTypes - describes the properties of the Component
     * @const {Object} defaultProps - defines the default values of the properties of the Component
     */
    static propTypes: Object = {
        entityId: PropTypes.string.isRequired,
        gridIdPrefix: PropTypes.string.isRequired,
        loadEntityRelationships: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isDownloading: PropTypes.bool.isRequired,
        deleteRelationship: PropTypes.func,
        records: PropTypes.array,
        totalRecords: PropTypes.number,
        countMax: PropTypes.number,
        canEdit: PropTypes.bool,
        section: PropTypes.oneOf(['relationships', 'organisations', 'people', 'things', 'children', 'custom']),
        entityType: PropTypes.oneOf(['thing', 'organisation', 'person', 'process', 'task', 'custom']),
    };

    static defaultProps = {
        leftNavOpen: !isMobile,
    };

    /**
     * @param props the Component's properties
     */
    constructor(props: Object) {
        super(props);
        this.state = {
            gridChange: 'relationships',
            menuToggled: !isMobile,
        };
        (this: Object).deleteRelationship = this.deleteRelationship.bind(this);
    }

    deleteRelationship(data: Object) {
        this.props.deleteRelationship(data.id);
    }

    toggleMenu = () => {
        this.setState(prevState => ({ menuToggled: !prevState.menuToggled }));
    };

    render() {
        const { section, entityId, entityType, gridIdPrefix, canEdit } = this.props;

        const baseUri = {
            thing: 'things',
            organisation: 'organisations',
            person: 'people',
            process: 'abox/process',
            task: 'abox/task',
            custom: 'custom-entities',
        }[entityType];
        const availableSections = ['relationships', 'organisations', 'people', 'things', 'custom'];

        if (!entityId || availableSections.indexOf(section) === -1) {
            return null;
        }
        const layoutExt = { height: '100%' };
        const grid = (
            <RelationshipsGrid
                dataTableId={`${gridIdPrefix}/${section}`}
                loadMethod={this.props.loadEntityRelationships}
                lastActionType={this.props.lastActionType}
                deleteMethod={this.deleteRelationship}
                isLoading={this.props.isLoading}
                isDownloading={this.props.isDownloading}
                records={this.props.records}
                totalRecords={this.props.totalRecords}
                countMax={this.props.countMax}
                section={section}
                canEdit={canEdit}
                toggleMenu={this.toggleMenu}
            />
        );

        let organisationsAction = null, peopleActions = null, thingsActions = null, customActions = null;
        if (canEdit) {
            organisationsAction =
                <Link
                    to={{
                        pathname: `/${baseUri}/${entityId}/relationships/organisations/add`,
                        state: { modal: true },
                    }}
                ><Icon name="plus"/></Link>;
            peopleActions =
                <Link
                    to={{
                        pathname: `/${baseUri}/${entityId}/relationships/people/add`,
                        state: { modal: true },
                    }}
                ><Icon name="plus"/></Link>;
            thingsActions =
                <Link
                    to={{
                        pathname: `/${baseUri}/${entityId}/relationships/things/add`,
                        state: { modal: true },
                    }}
                ><Icon name="plus"/></Link>;
            customActions =
                <Link
                    to={{
                        pathname: `/${baseUri}/${entityId}/relationships/custom/add`,
                        state: { modal: true },
                    }}
                ><Icon name="plus"/></Link>;
        }

        return (
            <Layout
                layoutStyle={layoutExt}
                isToggled={this.state.menuToggled}
                leftNavOpen={this.props.leftNavOpen}
                noPadding
                leftSidebar={
                    <Menu>
                        <MenuItem
                            name="Things"
                            to={{
                                pathname: `/${baseUri}/${entityId}/relationships/things`,
                                state: { leftNavOpen: true },
                            }}
                            actions={thingsActions}
                            className={section === 'things' ? 'active' : ''}
                        />
                        <MenuItem
                            name="People"
                            to={{
                                pathname: `/${baseUri}/${entityId}/relationships/people`,
                                state: { leftNavOpen: true },
                            }}
                            actions={peopleActions}
                            className={section === 'people' ? 'active' : ''}
                        />
                        <MenuItem
                            name="Organisations"
                            to={{
                                pathname: `/${baseUri}/${entityId}/relationships/organisations`,
                                state: { leftNavOpen: true },
                            }}
                            actions={organisationsAction}
                            className={section === 'organisations' ? 'active' : ''}
                        />
                        <MenuItem
                            name="Custom Entities"
                            to={{
                                pathname: `/${baseUri}/${entityId}/relationships/custom`,
                                state: { leftNavOpen: true },
                            }}
                            actions={customActions}
                            className={section === 'custom' ? 'active' : ''}
                        />
                    </Menu>
                }
                content={grid}
            />
        );
    }
}

export default RelationshipsView;
