const icon = '/images/logo-transparent.svg';

const sendNotification = (options: NotificationOptions, route: () => void) => {
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    } else if (Notification.permission === 'granted') {
        try {
            new Notification('PlayHex', { ...options, icon }).onclick = function() {
                if (route) route();
                focus();
                this.close();
            };
        } catch (e) {
            // TODO check compatibility on mobile. https://stackoverflow.com/questions/29774836/failed-to-construct-notification-illegal-constructor
        }
    }
};

const tags = { game: 'game notifications' };

export { sendNotification, tags };
