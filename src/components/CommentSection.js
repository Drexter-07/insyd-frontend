'use client';

import { useState, useEffect } from 'react';
import { getCommentsForArticle, createComment } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { LikeButton } from './LikeButton'; // We'll reuse the LikeButton for comments!

// A single comment component
const Comment = ({ comment, currentUserId }) => (
    <div className="flex items-start space-x-3 py-3">
        <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${comment.author_name}`} />
            <AvatarFallback>{comment.author_name ? comment.author_name.charAt(0) : 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <div className="bg-gray-100 rounded-lg px-3 py-2">
                <p className="font-semibold text-sm">{comment.author_name}</p>
                <p className="text-sm text-gray-800">{comment.content}</p>
            </div>
            <div className="flex items-center space-x-2 mt-1">
                <LikeButton
                    currentUserId={currentUserId}
                    entityId={comment.id}
                    entityType="comment"
                    initialLikes={comment.likeCount || 0}
                    isInitiallyLiked={comment.isLikedByCurrentUser || false}
                />
                <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
            </div>
        </div>
    </div>
);

// The main component for the whole section
export const CommentSection = ({ articleId, currentUserId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const fetchedComments = await getCommentsForArticle(articleId, currentUserId);
                setComments(fetchedComments);
            } catch (error) {
                console.error("Could not fetch comments");
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [articleId, currentUserId]);

    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        setIsPosting(true);
        try {
            await createComment({
                actorId: currentUserId,
                entityId: articleId,
                content: newComment,
            });
            // For an instant update, we can create a temporary comment object
            const tempComment = {
                id: Date.now(), // Temporary key
                content: newComment,
                created_at: new Date().toISOString(),
                author_name: currentUser.name,
                author_job_role: currentUser.job_role,
                likeCount: 0,
                isLikedByCurrentUser: false,
            };
            setComments(prevComments => [...prevComments, tempComment]);
            setNewComment('');
        } catch (error) {
            alert("Failed to post comment.");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="pt-4 border-t">
            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-3/4" />
                </div>
            ) : (
                comments.map(comment => <Comment key={comment.id} comment={comment} currentUserId={currentUserId} />)
            )}
            <div className="flex items-start space-x-3 pt-4">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${currentUser?.name}`} />
                    <AvatarFallback>{currentUser?.name ? currentUser.name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-2"
                    />
                    <Button size="sm" onClick={handlePostComment} disabled={isPosting}>
                        {isPosting ? 'Posting...' : 'Post Comment'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
