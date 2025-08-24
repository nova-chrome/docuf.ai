import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <UserProfile path="/profile" />
    </div>
  );
}
