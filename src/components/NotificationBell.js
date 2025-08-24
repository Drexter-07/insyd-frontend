'use client';

import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from './ui/button';
import { NotificationList } from './NotificationList';

export const NotificationBell = ({ userId }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {/* You can add a notification count badge here later */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
          <div className="p-3 border-b">
              <h4 className="font-medium leading-none">Notifications</h4>
          </div>
          <NotificationList userId={userId} />
      </PopoverContent>
    </Popover>
  );
};
