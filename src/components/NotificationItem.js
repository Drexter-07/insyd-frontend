'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellRing, ThumbsUp, MessageSquare, Briefcase } from 'lucide-react';

// A helper function to get an icon based on the notification type
const getIconForType = (type) => {
    switch (type) {
        case 'NEW_FOLLOWER':
            return <BellRing className="h-5 w-5 text-blue-500" />;
        case 'NEW_LIKE': // Assuming you might add this event type
            return <ThumbsUp className="h-5 w-5 text-red-500" />;
        case 'NEW_COMMENT':
            return <MessageSquare className="h-5 w-5 text-green-500" />;
        case 'NEW_ARTICLE':
        case 'NEW_JOB':
            return <Briefcase className="h-5 w-5 text-purple-500" />;
        default:
            return <BellRing className="h-5 w-5 text-gray-500" />;
    }
};

export const NotificationItem = ({ notification }) => {
    return (
        <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-md">
            <div className="mt-1">
                {getIconForType(notification.event_type)}
            </div>
            <div className="flex-1">
                <p className="text-sm">
                    <span className="font-semibold">{notification.actor_name}</span>
                    {' '}
                    {notification.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                </p>
            </div>
        </div>
    );
};
