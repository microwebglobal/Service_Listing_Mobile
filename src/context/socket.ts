import {io} from 'socket.io-client';
import React from 'react';
import {SERVER_BASE} from '@env';

export const socket = io(SERVER_BASE, {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log(`Connected to server: ${socket.id}`);
});
socket.on('disconnect', () => {
  console.log(`Disconnected from server: ${socket.id}`);
});
socket.on('message', (message: string) => {
  console.log('Message from server:', message);
});

export const SocketContext = React.createContext(socket);
