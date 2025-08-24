'use client';

import { useState, useEffect } from 'react';
import { postEvent } from '@/lib/api';
import { Button } from '@/components/ui/button';

export const FollowButton = ({ currentUserId, targetUserId, isInitiallyFollowing }) => {
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(isInitiallyFollowing);
  }, [isInitiallyFollowing]);

  const handleFollowToggle = async () => {
    if (!currentUserId) {
      alert("Please log in to follow users.");
      return;
    }

    setIsLoading(true);
    const originalIsFollowing = isFollowing;
    setIsFollowing(!isFollowing);

    try {
      // --- THE FIX IS HERE ---
      // We are now sending the eventType and parameter names that your backend expects.
      const response = await postEvent({
        eventType: 'FOLLOW',         // Changed from 'TOGGLE_FOLLOW'
        actorId: currentUserId,
        recipientId: targetUserId,   // Changed from 'entityId'
      });
      console.log("Backend responded:", response);

    } catch (error) {
      console.error("Failed to toggle follow", error);
      setIsFollowing(originalIsFollowing);
      alert("An error occurred. Please check the console and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUserId === targetUserId) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      onClick={handleFollowToggle}
      disabled={isLoading}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
};
