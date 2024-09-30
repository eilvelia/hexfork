import { io, Socket } from 'socket.io-client';
import { HexClientToServerEvents, HexServerToClientEvents } from '../../shared/app/HexSocketEvents';
import * as CustomParser from '@shared/app/socketCustomParser';
import { defineStore } from 'pinia';
import useAuthStore from './authStore';
import { watch, ref } from 'vue';

const useSocketStore = defineStore('socketStore', () => {
    const socket: Socket<HexServerToClientEvents, HexClientToServerEvents> = io({
        parser: CustomParser,
        autoConnect: false, // connect once player is logged in at least as guest
    });

    const joinRoom = (room: string) => socket.emit('joinRoom', room);
    const leaveRoom = (room: string) => socket.emit('leaveRoom', room);

    const connected = ref(false);

    /*
     * Reconnect socket when logged in player changed
     */
    const reconnectSocket = (): void => {
        socket.disconnect().connect();
    };

    const authStore = useAuthStore();

    watch(() => authStore.loggedInPlayer, reconnectSocket);

    socket.on('connect', () => {
        connected.value = true;
    });

    socket.on('disconnect', () => {
        connected.value = false;
    });

    return {
        socket,
        connected,
        joinRoom,
        leaveRoom,
        reconnectSocket,
    };
});

export default useSocketStore;
