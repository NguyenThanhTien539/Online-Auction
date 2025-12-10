// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = `${import.meta.env.VITE_API_URL}`; // Phải khớp với URL backend

const useSocketBidding = (productId: number | null) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
 
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);


        if (productId) {
            newSocket.emit('join_bidding_channel', productId);
        }

        return () => {
            newSocket.disconnect();
        };
    }, [productId]); 

    return socket;
};
export default useSocketBidding;