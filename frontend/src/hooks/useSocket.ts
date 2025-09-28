import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const VITE_WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

/**
 * A custom React hook to manage a Socket.IO connection.
 * @param namespace - The Socket.IO namespace to connect to (e.g., '/feed').
 * @param eventName - The name of the event to listen for.
 * @returns The latest data received from the listened event.
 */
export const useSocket = <T>(namespace: string, eventName: string): T | null => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    // Establish connection with the backend, including credentials for session auth
    const socket: Socket = io(`${VITE_WS_URL}${namespace}`, {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log(`Socket connected to namespace: ${namespace}`);
    });

    // Listener for the specified event
    socket.on(eventName, (newData: T) => {
      setData(newData);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected from namespace: ${namespace}`);
    });

    // Cleanup function: disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [namespace, eventName]); // Re-run effect if namespace or eventName changes

  return data;
};
