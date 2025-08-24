'use client';

import { useEffect, useState } from 'react';
import { getNotifications } from '@/lib/api';
import { NotificationItem } from './NotificationItem';
import { Skeleton } from './ui/skeleton';

export const NotificationList = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        };

        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                const data = await getNotifications(userId);
                // Your backend needs to join with the Users table to get actor_name
                setNotifications(data);
            } catch (err) {
                setError("Could not load notifications.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="space-y-3 p-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        );
    }

    if (error) {
        return <p className="p-4 text-sm text-red-500">{error}</p>;
    }

    return (
        <div>
            {notifications.length > 0 ? (
                notifications.map(notif => (
                    <NotificationItem key={notif.id} notification={notif} />
                ))
            ) : (
                <p className="p-4 text-sm text-center text-gray-500">You have no new notifications.</p>
            )}
        </div>
    );
};
