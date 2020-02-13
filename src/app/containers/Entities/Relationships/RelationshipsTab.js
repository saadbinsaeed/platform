/* @flow */

import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';

import { fetchEntityRelationships, deleteRelationship } from 'store/actions/entities/relationshipsActions';
import RelationshipsGrid from 'app/components/Entities/Relationships/RelationshipsGrid';
import { allTypesProps } from 'app/utils/propTypes/common';

/**
 * Renders the view to shoe the relationships of an entity.
 */
class RelationshipsTab extends PureComponent<Object, Object> {

    static propTypes = {
        dataTableId: PropTypes.string.isRequired,

        baseUri: PropTypes.string.isRequired,
        entityId: PropTypes.string.isRequired,
        type1: allTypesProps.isRequired,
        type2: allTypesProps.isRequired,

        fetchEntityRelationships: PropTypes.func.isRequired,
        deleteRelationship: PropTypes.func.isRequired,

        isLoading: PropTypes.bool.isRequired,
        records: PropTypes.array,
        recordsCount: PropTypes.number,

        leftNavOpen: PropTypes.bool,
        userProfile: PropTypes.object,
    };

    static defaultProps = {
        leftNavOpen: !isMobile,
    };

    constructor(props) {
        super(props);
        this.state = {
            menuToggled: this.props.leftNavOpen,
        };
    }

    toggleMenu = () => {
        this.setState(prevState => ({ menuToggled: !prevState.menuToggled }));
    };

    /**
     * This function will be used to apply filters according to section
     */
    loadRows = (options: Object): Promise<Object> => {
        const { entityId, type1, type2, userProfile: { isAdmin } } = this.props;
        return this.props.fetchEntityRelationships(entityId, type1, type2, options, isAdmin);
    };

    /**
     * @override
     */
    render() {
        const { baseUri, entityId, type1, type2, userProfile: { isAdmin } } = this.props;
        return <RelationshipsGrid
            type1={type1}
            type2={type2}
            entityId={entityId}
            dataTableId={`${this.props.dataTableId}/${type2}`}
            loadRows={this.loadRows}
            deleteRelationship={this.props.deleteRelationship}
            isLoading={this.props.isLoading}
            isDownloading={this.props.isDownloading}
            records={this.props.records}
            totalRecords={this.props.recordsCount}
            countMax={this.props.countMax}
            canEdit={true}
            isAdmin={isAdmin}
            toggleMenu={this.toggleMenu}
            baseUri={baseUri}
        />;
    }
}

export default connect(
    state => ({
        isLoading: state.entities.relationships.isLoading,
        isDownloading: state.entities.relationships.isDownloading,
        records: state.entities.relationships.records,
        recordsCount: state.entities.relationships.count,
        recordsCountMax: state.entities.relationships.countMax,
        userProfile: state.user.profile,
    }),
    {
        fetchEntityRelationships,
        deleteRelationship,
    },
)(RelationshipsTab);
