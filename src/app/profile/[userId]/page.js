'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getUserById, getFeedByUserId, getNotifications } from '@/lib/api';

// UI Components from Shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';

// Icons from lucide-react
import { Briefcase, MapPin, Mail, Sparkles, FileText, Building } from 'lucide-react';

// --- Reusable Card for rendering feed items ---
const ActivityCard = ({ item }) => {
    const isJob = item.type === 'job';

    return (
        <Card className="mb-4">
            <CardHeader>
                <div className="flex items-center space-x-3">
                     {isJob ? <Building className="h-5 w-5 text-gray-500" /> : <FileText className="h-5 w-5 text-gray-500" />}
                    <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        {isJob && <p className="text-sm text-muted-foreground">{item.company_name} • {item.location}</p>}
                    </div>
                </div>
            </CardHeader>
            {item.content && (
                 <CardContent>
                    {/* --- CHANGE #1: Changed <p> to <div> --- */}
                    <div className="text-sm text-gray-700 line-clamp-3">{item.content}</div>
                 </CardContent>
            )}
        </Card>
    );
};


// --- The main Profile Page Component ---
export default function UserProfilePage() {
    const params = useParams();
    const { userId } = params;

    const [user, setUser] = useState(null);
    const [feed, setFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                const [userData, feedData] = await Promise.all([
                    getUserById(userId),
                    getFeedByUserId(userId)
                ]);

                setUser(userData);
                setFeed(feedData);
                setError(null);
            } catch (err) {
                console.error("Failed to load profile data:", err);
                setError("Could not load user profile. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-6xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500 p-8">{error}</p>;
    }

    if (!user) {
        return <p className="text-center p-8">User not found.</p>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-6xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* --- LEFT COLUMN: User Info --- */}
                <aside className="md:col-span-1 space-y-6">
                    {/* Main Profile Card */}
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="w-24 h-24 mb-4">
                                <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-md text-muted-foreground">{user.job_role}</p>
                            {user.company_name && <p className="text-sm text-gray-600">at {user.company_name}</p>}
                            <p className="text-sm text-gray-500 mt-1">{user.city}</p>

                            <div className="flex space-x-2 mt-4">
                                <Button>Follow</Button>
                                <Button variant="outline">Message</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* About Card */}
                    {user.profile_summary && (
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* --- CHANGE #2: Changed <p> to <div> --- */}
                                <div className="text-sm text-gray-700">{user.profile_summary}</div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Details</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-3">
                            <div className="flex items-center text-sm">
                                <Sparkles className="h-4 w-4 mr-3 text-gray-500" />
                                <span>{user.specialization}</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-3 text-gray-500" />
                                <span>{user.email}</span>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* --- RIGHT COLUMN: User Activity --- */}
                <main className="md:col-span-2">
                    <Card>
                        <CardHeader>
                           <CardTitle>Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                           {feed.length > 0 ? (
                                feed.map((item) => <ActivityCard key={`${item.type}-${item.id}`} item={item} />)
                            ) : (
                                <p className="text-center text-gray-500 py-8">This user hasn&apos;t posted anything yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}