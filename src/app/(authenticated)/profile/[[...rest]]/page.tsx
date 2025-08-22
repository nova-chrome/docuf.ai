import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <UserProfile path="/profile" />
    </div>
  );
}
