"use client";

import { useSession } from "next-auth/react";
import { useLogout } from "@/hooks/use-logout";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const logout = useLogout();
  const router = useRouter();

  if (status === "loading") {
    return <Loader />;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-full max-w-lg text-center"
      >
        <h1 className="text-3xl font-bold mb-4">
          Welcome back, {session.user?.name || "User"} 👋
        </h1>
        <p className="text-neutral-400 mb-6">Email: {session.user?.email}</p>
        <div className="flex justify-center">
          <Button
            onClick={() => logout.mutate()}
            className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl"
          >
            Log Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
