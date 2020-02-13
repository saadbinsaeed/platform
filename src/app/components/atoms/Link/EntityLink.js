/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys, compose, setPropTypes } from 'recompose';
import ThingLink from 'app/components/atoms/Link/ThingLink';
import PersonLink from 'app/components/atoms/Link/PeopleLink';
import OrganisationLink from 'app/components/atoms/Link/OrganisationsLink';
import CustomEntityLink from 'app/components/atoms/Link/CustomEntityLink';
import TaskLink from 'app/components/atoms/Link/TaskLink';
import ProcessLink from 'app/components/atoms/Link/ProcessLink';

const EntityLink = ((props: Object) => {
    const { type, ...restProps } = props;
    if (type === 'thing') {
        return (<ThingLink {...restProps} />);
    } else if (type === 'person') {
        return (<PersonLink {...restProps} />);
    } else if (type === 'organisation') {
        return (<OrganisationLink {...restProps} />);
    } else if (type === 'custom') {
        return (<CustomEntityLink {...restProps} />);
    } else if (type === 'task') {
        return (<TaskLink {...restProps} />);
    } else if (type === 'process') {
        return (<ProcessLink {...restProps} />);
    }
    return null;
});

export default compose(onlyUpdateForKeys(['id']), setPropTypes({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    type: PropTypes.oneOf(['thing', 'person', 'organisation', 'custom', 'task', 'process']).isRequired,
}))(EntityLink);
