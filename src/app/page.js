'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllUsers } from '@/lib/api';

export default function UserSelectionPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getAllUsers();
                setUsers(fetchedUsers);
            } catch (err) {
                setError('Failed to load users. Please make sure the backend is running.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Helper component for a single skeleton card
    const UserCardSkeleton = () => (
        <Card className="w-48 h-48 flex flex-col items-center justify-center p-6 border rounded-lg">
            <Skeleton className="w-20 h-20 rounded-full mb-4" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-32" />
        </Card>
    );

    // This condition ensures the skeleton is rendered on the initial server render
    // and for a brief moment on the client before data is available.
    if (isLoading) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">Welcome to Insyd</h1>
                    <p className="text-lg text-gray-600 mb-8">Select a user to view the feed</p>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                    {/* We render a static number of skeletons for consistent DOM structure */}
                    <UserCardSkeleton />
                    <UserCardSkeleton />
                    <UserCardSkeleton />
                </div>
            </main>
        );
    }

    // Now, with the data loaded, we check for errors or empty state
    if (error) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="text-center">
                    <p className="text-red-500 font-bold">{error}</p>
                </div>
            </main>
        );
    }

    if (users.length === 0) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">Welcome to Insyd</h1>
                    <p className="text-lg text-gray-600 mb-8">No users found. Please add some to your database.</p>
                </div>
            </main>
        );
    }

    // Finally, render the full content
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-2">Welcome to Insyd</h1>
                <p className="text-lg text-gray-600 mb-8">Select a user to view the feed</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
                {users.map(user => (
                    <Link key={user.id} href={`/feed?userId=${user.id}`} passHref>
                        <Card className="w-48 h-48 flex flex-col items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors">
                            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                <Avatar className="w-20 h-20 mb-4">
                                    <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-500 truncate w-full">{user.job_role}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </main>
    );
}

