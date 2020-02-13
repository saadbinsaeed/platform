/* @flow */

import React from 'react';
import PropTypes from 'prop-types';
import { onlyUpdateForKeys, compose, setPropTypes } from 'recompose';
import { get } from 'app/utils/lo/lo';
import Avatar from 'app/components/molecules/Avatar/Avatar';
import AboxCircularProgressBar from 'app/components/atoms/CircularProgressBar/AboxCircularProgressBar';
import ProcessIcon from 'app/components/atoms/Icon/ProcessIcon';

const EntityAvatar = ((props: Object) => {
    const { type, data } = props;
    if (type === 'task') {
        const { priority, endDate, variable = {} } = data;
        const completion = get(variable, 'completion', 0);
        return (
            <AboxCircularProgressBar
                size={40}
                percentage={completion}
                priority={priority}
                disabled={!!endDate}
            />
        );
    } else if (type === 'process') {
        const { endDate,  variables = {}, processDefinition = {} } = data;
        const priority = get(variables, 'priority', 3);
        const icon = get(processDefinition, 'deployedModel.modelData.icon', 'arrange-bring-to-front');
        return (
            <ProcessIcon
                name={icon}
                disabled={endDate}
                priority={priority}
                noMargin={true}
            />
        );
    }
    const { image, name, iconName, iconColor } = data;
    return (
        <Avatar src={image} name={name} alt={name} iconName={iconName} iconColor={iconColor} width="40px" height="40px" lineHeight="40px" />
    );
});

export default compose(onlyUpdateForKeys(['id']), setPropTypes({
    data: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['thing', 'person', 'organisation', 'custom', 'task', 'process']).isRequired,
}))(EntityAvatar);
