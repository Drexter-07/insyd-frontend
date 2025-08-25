'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import { NotificationList } from './NotificationList';
import { getUserById, getNotifications, markNotificationsRead } from '@/lib/api';
// --- CHANGE #1: Import the useSocket hook ---
import { useSocket } from '@/context/SocketContext';

export function Navbar() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  // --- CHANGE #2: Get the socket instance from our context ---
  const socket = useSocket();

  // This useEffect still fetches the initial unread count on page load
  useEffect(() => {
    if (userId) {
      getUserById(userId).then(setCurrentUser);
      // Fetch the initial count
      getNotifications(userId).then(notifications => {
        setUnreadCount(notifications.filter(n => !n.is_read).length);
      });
    }
  }, [userId]);

  // --- CHANGE #3: This is the new REAL-TIME listener ---
  // It completely replaces the old polling logic.
  useEffect(() => {
    // We only set up the listener if the socket connection is established
    if (!socket) return;

    // This function runs every time the server pushes a 'new_notification' event
    const handleNewNotification = (notification) => {
      console.log('Real-time notification received from server:', notification);
      // We just increment the count, making the red dot appear instantly
      setUnreadCount(prevCount => prevCount + 1);
    };

    // Set up the listener for the 'new_notification' event
    socket.on('new_notification', handleNewNotification);

    // Cleanup function: It's crucial to remove the listener when the component
    // is no longer on screen to prevent memory leaks.
    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket]); // This effect re-runs only if the socket instance changes

  // This function marks notifications as read when the popover is opened
  const handleOpenNotifications = async () => {
    if (unreadCount > 0) {
      try {
        await markNotificationsRead(userId);
        setUnreadCount(0); // Update the UI instantly
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  
  const userName = currentUser ? currentUser.name : 'User';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-14 flex items-center">
            <div className="mr-4 hidden md:flex">
                <Link href={`/?userId=${userId || ''}`} className="mr-6 flex items-center space-x-2">
                    <span className="font-bold">insyd</span>
                </Link>
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center justify-end space-x-4">
                {userId && (
                    <Popover onOpenChange={(isOpen) => { if (isOpen) handleOpenNotifications(); }}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0">
                            <div className="p-3 border-b"><h4 className="font-medium leading-none">Notifications</h4></div>
                            <NotificationList userId={parseInt(userId)} />
                        </PopoverContent>
                    </Popover>
                )}
                {userId && (
                    // We pass the userId as a query param so the profile page knows who is viewing it
                    <Link href={`/profile/${userId}?userId=${userId}`} passHref>
                        <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${userName}`} alt={userName} />
                            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Link>
                )}
            </div>
        </div>
    </header>
  );
}
