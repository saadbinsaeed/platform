/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import RelationshipsTab from 'app/containers/Entities/Relationships/RelationshipsTab';
import { CUSTOM_ENTITIES_RELATIONSHIPS_DATA_TABLE } from 'app/config/dataTableIds';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';

/**
* Renders the relationships of a Custom Enitity.
 */
class CustomEntityRelationship extends PureComponent<Object, Object> {

    static propTypes = {
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired }),
        toggleMenu: PropTypes.func
    };
    /**
     * @override
     */
    render() {
        const id = this.props.match.params.id;
        const section = this.props.match.url.match(/([^/]*)\/*$/)[1];
        return <RelationshipsTab
            entityId={id}
            entityType={'custom'}
            section={section}
            gridIdPrefix={CUSTOM_ENTITIES_RELATIONSHIPS_DATA_TABLE}
            toggleMenu={this.props.toggleMenu}
        />;
    }
}

export default CustomEntityRelationship;
