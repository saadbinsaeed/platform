/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Layout from 'app/components/molecules/Layout/Layout';

import ThingChildrenGrid from 'app/components/Entities/Things/ThingChildrenGrid/ThingChildrenGrid';
import { RouterMatchPropTypeBuilder } from 'app/utils/propTypes/common';
/**
 * @class
 * Container that is used to display the Children of a thing
 */
class ThingChildrenTab extends PureComponent<Object, Object> {

    static propTypes = {
        match: RouterMatchPropTypeBuilder({ id: PropTypes.string.isRequired }),
    };

    /**
     * @override
     */
    render(): Object {
        const id = this.props.match.params.id;
        const grid = <ThingChildrenGrid id={id} />;
        return <Layout content={grid} noPadding={true} />;
    }
};

export default ThingChildrenTab;
