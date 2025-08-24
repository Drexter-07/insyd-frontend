// src/components/ProfileCard.jsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, MapPin, Briefcase } from "lucide-react";

export function ProfileCard({ user }) {
  if (!user) return null; // Don't render if no user data yet

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.name}`} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600 space-y-2">
        <div className="flex items-center">
          <Briefcase className="w-4 h-4 mr-2" />
          <span>{user.job_role}</span>
        </div>
        {user.company_name && (
          <div className="flex items-center">
            <Building className="w-4 h-4 mr-2" />
            <span>{user.company_name}</span>
          </div>
        )}
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{user.city}</span>
        </div>
      </CardContent>
    </Card>
  );
}