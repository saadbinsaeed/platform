/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Layout from 'app/components/molecules/Layout/Layout';


import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
import OrganisationChildrenGrid
    from 'app/components/Entities/Organisations/OrganisationChildrenGrid/OrganisationChildrenGrid';
/**
 * @class
 * Container that is used to display the Children of a thing
 */
class OrganisationChildrenTab extends Component<Object, Object> {

    static propTypes = {
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired }),
    };

    /**
     * @override
     */
    render(): Object {
        const id = this.props.match.params.id;
        const grid = <OrganisationChildrenGrid id={id} />;
        return <Layout content={grid} noPadding={true} />;
    }
};

export default OrganisationChildrenTab;
