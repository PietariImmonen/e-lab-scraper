"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth/firebase/actions";
const Page = () => {
  return (
    <div>
      <Button onClick={() => signOut()}>Dashboard</Button>
    </div>
  );
};
export default Page;
