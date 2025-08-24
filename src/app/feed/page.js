// src/app/feed/page.js
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getUserById, getAllUsers, getCombinedFeed } from "@/lib/api";

// Import the components we just created
import { ProfileCard } from "@/components/ProfileCard";
import { MainFeed } from "@/components/MainFeed";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import { Skeleton } from "@/components/ui/skeleton";

import { CreatePostWidget } from "@/components/CreatePostWidget";

// A simple loading skeleton for the page
const PageSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
    <div className="md:col-span-1 space-y-4">
      <Skeleton className="h-64 w-full" />
    </div>
    <div className="md:col-span-2 space-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
    <div className="md:col-span-1 space-y-4">
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);

export default function FeedPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // This is the ID of the currently logged-in user

  const [currentUser, setCurrentUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      setError("No user selected. Please go back and select a user.");
      return;
    }

    // MODIFICATION: Switched to parallel fetching for better performance.
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        const [userData, recommendationsData, feedData] = await Promise.all([
          getUserById(userId),
          getAllUsers({ currentUserId: userId }),
          getCombinedFeed({ currentUserId: userId }), // This is the new, correct way
        ]);

        setCurrentUser(userData);
        setRecommendations(recommendationsData);
        setFeedItems(feedData);
        setError(null);
      } catch (err) {
        console.error("Failed to load feed page data:", err);
        setError("Something went wrong. Please check the backend logs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [userId]);

  const handlePostCreated = (newPost) => {
    // This adds the new post to the beginning of the feedItems array
    setFeedItems(prevFeed => [newPost, ...prevFeed]);
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (error) {
    return <p className="text-center text-red-500 p-8">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
      {/* Left Column (No change needed) */}
      <div className="md:col-span-1">
        <ProfileCard user={currentUser} />
      </div>

      {/* MODIFICATION: Pass the currentUserId to enable like functionality */}
      <div className="md:col-span-2">
         {/* --- createPost widget here --- */}
        {currentUser && (
            <CreatePostWidget 
                currentUser={currentUser} 
                onPostCreated={handlePostCreated} 
            />
        )}
         <MainFeed
          feedItems={feedItems}
          currentUserId={parseInt(userId)}
          currentUser={currentUser}
        />
      </div>

      {/* MODIFICATION: Pass the currentUserId to enable follow functionality */}
      <div className="md:col-span-1">
        <RecommendationPanel
          users={recommendations}
          currentUserId={parseInt(userId)}
        />
      </div>
    </div>
  );
}
