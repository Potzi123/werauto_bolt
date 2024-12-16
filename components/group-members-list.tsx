"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Bus, UserMinus } from "lucide-react";
import type { Database } from "@/lib/database.types";

type GroupMemberWithProfile = {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
  status: 'driver' | 'passenger' | 'bus';
};

interface GroupMembersListProps {
  members: GroupMemberWithProfile[];
  groupName: string;
}

export function GroupMembersList({ members, groupName }: GroupMembersListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'driver':
        return <Car className="h-4 w-4" />;
      case 'bus':
        return <Bus className="h-4 w-4" />;
      default:
        return <UserMinus className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'driver':
        return 'bg-green-100 text-green-800';
      case 'bus':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members of {groupName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.profile.id}
              className="flex items-center justify-between p-3 bg-background rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getStatusIcon(member.status)}
                </div>
                <div>
                  <p className="font-medium">{member.profile.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.profile.location || 'No location set'}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(member.status)}>
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}