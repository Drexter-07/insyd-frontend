// src/components/RecommendationPanel.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// --- CHANGE #1: Import the new FollowButton ---
import { FollowButton } from "./FollowButton";

// --- CHANGE #2: Accept 'currentUserId' as a prop ---
export function RecommendationPanel({ users, currentUserId }) {
  if (!users || users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.job_role}</p>
              </div>
            </div>
            {/* --- CHANGE #3: Replace the old Button with the new FollowButton --- */}
            <FollowButton
              currentUserId={currentUserId}
              targetUserId={user.id}
              // Your backend needs to provide this. For now, it will default to false.
              isInitiallyFollowing={user.isFollowing || false}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
