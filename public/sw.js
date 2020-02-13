/* eslint-disable no-restricted-globals */

//self.addEventListener('install', (event) => console.log('[sw] installed.'));
//self.addEventListener('activate', (event) => console.log('[sw] activated.'));
//self.addEventListener('message', (event) => console.log(`[sw] received message: ${event.data}`));

self.addEventListener('install', event => {
    event.waitUntil(
        self.skipWaiting()
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim()
    );
});

const channel = new BroadcastChannel('sw-messages');

const getWindowClient = async clients => {
    await clients.claim(); // if it is first load of service worker tab that loaded it needs to be claimed and on windows 'activate' hook doesn't work
    const windows = await clients.matchAll({ type: 'window' });
    const client = windows && Array.isArray(windows) && windows.find(({ frameType }) => frameType === 'top-level');
    if (!client) {
        throw new Error('window client not found.');
    }
    return client;
};

const onClose = async event => {
    const data = event.notification.data || {};
    const { closeAction } = data;
    if (closeAction) {
        channel.postMessage({
            source: 'sw',
            event: 'notificationclose',
            action: closeAction,
            data: data
        });
    }
};

self.addEventListener('notificationclose', onClose);

self.addEventListener('notificationclick', async event => {
    event.notification.close();
    const data = event.notification.data || {};
    const { link, isNewWindow } = data;

    if (link) {
        event.waitUntil(
            (async () => {
                try {
                    const client = await getWindowClient(self.clients);
                    if (isNewWindow) {
                        await client.openWindow(link);
                    } else {
                        await client.focus();
                        await client.navigate(link);
                    }
                } catch (e) {
                    await self.clients.openWindow(link);
                }
            })()
        );
    }
    // in windows if u just click on notification it doesnt trigger close even (only clicking on arrow triggers that)
    if (navigator.platform.toLowerCase().includes('win')) {
        event.waitUntil(onClose(event));
    }
    if (event.action) {
        channel.postMessage({
            source: 'sw',
            event: 'notificationclick',
            action: event.action,
            data: data
        });
    }
});
