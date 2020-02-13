// @flow
import { isDefined } from 'app/utils/utils';

const ACTIONS_ARRAY = ['navigate', 'pentahoReport', 'sendTaskMessage']; // In future if we have other actions that needs a new window we will add them here

export const getCustomAction = (actionData: string | number, actionType: string) => {
    if (!isDefined(actionData) || !isDefined(actionType)) return null;
    const serverURL = window.location.origin;
    if (actionType === 'sendTaskMessage') {
        const [ type, id ] = String(actionData).split(',').map(str => str.trim());
        if (type && id) {
            return `/#/activity-actions/${type}/${id}`;
        }
        return null;
    }
    return {
        openTask: `/#/abox/task/${actionData}`,
        openProcess: `/#/abox/process/${actionData}`,
        navigate: actionData,
        openEntity: `/#/entity/${actionData}`,
        pentahoReport: `${serverURL}/pentaho/api/repos/${actionData}/generatedContent`
    }[actionType];
};

export const isNewWindowNeeded = (actionType: string) => {
    return ACTIONS_ARRAY.includes(actionType);
};
