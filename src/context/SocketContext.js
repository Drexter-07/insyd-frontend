'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSearchParams } from 'next/navigation';

// 1. Create the context
const SocketContext = createContext();

// 2. Create a custom hook to easily use the context
export function useSocket() {
    return useContext(SocketContext);
}

// 3. Create the Provider component that will wrap your application
export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');

    useEffect(() => {
        if (userId) {
            // Connect to your backend's WebSocket server
            // Ensure the URL matches your backend's address (e.g., http://localhost:4000)
            const newSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
                // We can pass the userId in the query for initial connection
                query: { userId }
            });

            setSocket(newSocket);

            // When the socket connects, register the user with the backend
            newSocket.on('connect', () => {
                newSocket.emit('register', userId);
            });

            // Cleanup function to disconnect the socket when the component unmounts
            return () => {
                newSocket.disconnect();
            };
        }
    }, [userId]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
