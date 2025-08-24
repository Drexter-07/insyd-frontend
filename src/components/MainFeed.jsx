// src/components/MainFeed.jsx
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import { LikeButton } from "./LikeButton";
import { CommentSection } from './CommentSection';

// A sub-component for displaying a single article
function ArticleCard({ item, currentUserId, currentUser }) {
     // --- Add state to toggle the comment section ---
    const [showComments, setShowComments] = useState(false);
    return (
        <Card className="mb-6">
            <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                    <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${item.author_name}`} />
                        <AvatarFallback>{item.author_name ? item.author_name.charAt(0) : 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{item.author_name}</p>
                        <p className="text-xs text-gray-500">{item.author_job_role}</p>
                    </div>
                </div>
                <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700">{item.content}</p>
            </CardContent>
            <CardFooter className="flex space-x-2">
                <LikeButton
                    currentUserId={currentUserId}
                    entityId={item.id}
                    entityType="post"
                    initialLikes={item.likeCount || 0}
                    isInitiallyLiked={item.isLikedByCurrentUser || false}
                />
                 <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
                    <MessageCircle className="w-4 h-4 mr-2" /> Comment
                </Button>
            </CardFooter>
            {showComments && (
                <CardContent>
                    <CommentSection 
                        articleId={item.id} 
                        currentUserId={currentUserId}
                        currentUser={currentUser}
                    />
                </CardContent>
            )}
        </Card>
    );
}
// A sub-component for displaying a single job posting
function JobCard({ item }) {
    return (
        <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardHeader>
                <CardDescription>Job Opening</CardDescription>
                <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <p className="font-semibold">{item.company_name}</p>
                <p className="text-sm text-gray-600">{item.location}</p>
            </CardContent>
            <CardFooter>
                <Button>Apply Now</Button>
            </CardFooter>
        </Card>
    );
}

export function MainFeed({ feedItems, currentUserId, currentUser }) {
    if (!feedItems) return <p>Loading feed...</p>;
    if (feedItems.length === 0) return <p>The feed is empty.</p>;

    return (
        <div>
            {feedItems.map(item => {
                if (item.type === 'article') {
                    return <ArticleCard key={`article-${item.id}`} item={item} currentUserId={currentUserId} currentUser={currentUser} />;
                }
                if (item.type === 'job') {
                    return <JobCard key={`job-${item.id}`} item={item} />;
                }
                return null;
            })}
        </div>
    );
}
