import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echoInstance = null;

export function initEcho(token) {
    if (echoInstance || !token) return echoInstance;

    window.Pusher = Pusher;

    echoInstance = new Echo({
        broadcaster: 'pusher',
        // key: import.meta.env.VITE_PUSHER_APP_KEY,
        // cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
        key: "292a7ed58b7243ae2d0f",
        cluster: 'us2',
        forceTLS: true,
        encrypted: true,
        // authEndpoint: 'https://trueque-backend-production.up.railway.app/broadcasting/auth',
        authEndpoint: 'http://localhost:8000/broadcasting/auth',
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });

    return echoInstance;
}

export function disconnectEcho() {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
}
