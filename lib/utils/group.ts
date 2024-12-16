import type { Database } from '../database.types';

type Group = Database['public']['Tables']['groups']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export function validateGroupName(name: string): boolean {
  return name.trim().length > 0;
}

export function validateGroupDescription(description: string): boolean {
  return description.trim().length > 0;
}

export function validateGroupDestination(destination: string): boolean {
  return destination.trim().length > 0;
}

export function sortGroupMembers(members: Profile[]): Profile[] {
  return [...members].sort((a, b) => 
    a.username.localeCompare(b.username)
  );
}