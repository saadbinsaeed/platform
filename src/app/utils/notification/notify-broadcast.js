/* @flow */

import readBroadcastMutation from 'graphql/broadcast/readBroadcastMutation';
import { graphql } from 'graphql/client';
import { notify } from './notification';
import { isDefined } from 'app/utils/utils';
import { set } from 'app/utils/immutable/Immutable';
import { getCustomAction, isNewWindowNeeded } from 'app/utils/notification/notificationUtils';

const markBroadcastRead = (id: number) =>
    graphql.mutate({
        mutation: readBroadcastMutation,
        variables: { id },
        fetchPolicy: 'no-cache',
    }).catch((error) => {
        // TODO: do we have to show a toastr?
        console.error(error); // eslint-disable-line no-console
    });


if ('BroadcastChannel' in window) {
    const channel = new window.BroadcastChannel('sw-messages');
    channel.addEventListener('message', (event) => {
        const { action, data: { id } } = event.data || {};
        if (id && action === 'markBroadcastRead') {
            markBroadcastRead(id);
        }
    });
}



export const notifyBroadcasts = (broadcasts: Array<Object>) => {
    broadcasts.filter(
        ({ broadcast }) => broadcast.priority !== 'broadcast'
    ).forEach(({ broadcast: { id, message, priority, actionData, actionType } }) => {
        const title = priority ? `Priority: ${priority}` : 'Message';
        const url = getCustomAction(actionData, actionType);
        const isNewWindow = isNewWindowNeeded(actionType);
        let notificationData = {
            tag: `broadcast_${id}`,
            body: message,
            requireInteraction: true,
            data: { id, closeAction: 'markBroadcastRead', isNewWindow },
            sound: priority,
        };
        if(isDefined(url)){
            notificationData = set(notificationData, 'data.link', url);
        }
        notify(title, notificationData);
    });
};
