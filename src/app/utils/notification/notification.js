/* @flow */

import { isBrowser } from 'react-device-detect';

import { get } from 'app/utils/lo/lo';

// $FlowFixMe
import audioSrc from 'media/sounds/notification.mp3';
// $FlowFixMe
import lowSrc from 'media/sounds/low.mp3';
// $FlowFixMe
import lowestSrc from 'media/sounds/lowest.mp3';
// $FlowFixMe
import mediumSrc from 'media/sounds/medium.mp3';
// $FlowFixMe
import highSrc from 'media/sounds/high.mp3';
// $FlowFixMe
import highestSrc from 'media/sounds/highest.mp3';

// $FlowFixMe
const defaultAudio = new Audio(audioSrc);
// $FlowFixMe
const low = new Audio(lowSrc);
// $FlowFixMe
const lowest = new Audio(lowestSrc);
// $FlowFixMe
const medium = new Audio(mediumSrc);
// $FlowFixMe
const high = new Audio(highSrc);
// $FlowFixMe
const highest = new Audio(highestSrc);

const audioMap = {
    default: defaultAudio,
    low,
    lowest,
    medium,
    high,
    highest
};


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        window.navigator.serviceWorker.register('sw.js').then((registration) => {
            // Registration was successful
        }, (error) => {
            // registration failed :(
            console.error('serviceWorker registration failed: ', error); // eslint-disable-line no-console
        });
    });
}


const tags = new Set();
const showNotification = async (worker, title, options) => {
    if (!window.Notification || window.Notification.permission === 'denied') {
        return Promise.resolve({ permission: 'denied' });
    }
    if (window.Notification.permission === 'granted') {
        const tag = get(options, 'tag');
        if (!tag || !tags.has(tag)) {
            tags.add(tag);
            return worker.showNotification(title, options);
        } else {
            return Promise.resolve({ duplicate: true });
        }
    } else {
        await window.Notification.requestPermission();
        return showNotification(worker, title, options);
    }
};

/**
 * Notifies the user using a service worker registration (https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification).
 *
 * @param title the title of the notification.
 * @param options the notification options (https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification)
 */
const notify = async (title: string, options: Object) => {
    const worker = await window.navigator.serviceWorker.register('sw.js');
    await window.navigator.serviceWorker.ready;
    const { sound, ...notificationOptions } = options;
    const nofiticationOptions = {
        icon: './notifications/icon-default.png',
        badge: './notifications/badge.png',
        requireInteraction: false,
        ...notificationOptions,
    };
    const response = await showNotification(worker, title, nofiticationOptions);
    if (isBrowser && get(response, 'permission') !== 'denied' && !get(response, 'duplicate')) {
        audioMap[sound || 'default'].play().catch();
    }
};

export { notify };
