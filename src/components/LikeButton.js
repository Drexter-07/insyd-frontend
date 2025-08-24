'use client';

import { useState, useEffect } from 'react';
import { postEvent } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';

export const LikeButton = ({ currentUserId, entityId, entityType, initialLikes, isInitiallyLiked }) => {
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  // This hook ensures the button's visual state is always correct
  // when the data from the server (the initial props) changes.
  useEffect(() => {
    setIsLiked(isInitiallyLiked);
    setLikeCount(initialLikes);
  }, [isInitiallyLiked, initialLikes]);

  const handleLikeToggle = async () => {
    if (!currentUserId) {
      alert("Please log in to like posts.");
      return;
    }
    

    setIsLoading(true);

    // Store the original state so we can revert if the API call fails.
    const originalState = { isLiked, likeCount };

    // Perform the "optimistic update" for an instant UI response.
    setIsLiked(prevState => !prevState);
    setLikeCount(prevState => (isLiked ? prevState - 1 : prevState + 1));

    try {
      // Call the backend. The button's job is done.
      await postEvent({
        eventType: 'NEW_LIKE',
        actorId: currentUserId,
        entityId: entityId,
        entityType: entityType,
      });
    } catch (error) {
      console.error("Failed to toggle like:", error);
      alert("Couldn't update like. Please try again.");
      
      // If the API call fails, revert the button to its original state.
      setIsLiked(originalState.isLiked);
      setLikeCount(originalState.likeCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLikeToggle}
      disabled={isLoading}
      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
    >
      <ThumbsUp className={`h-4 w-4 transition-colors ${isLiked ? 'fill-current text-blue-600' : ''}`} />
      {likeCount > 0 && <span>{likeCount}</span>}
      <span className="sr-only">Like</span>
    </Button>
  );
};
