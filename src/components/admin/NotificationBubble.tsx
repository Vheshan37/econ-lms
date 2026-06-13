"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getUnreadCount } from "@/lib/actions/notifications";

export function NotificationBubble() {
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCount = async () => {
      const result = await getUnreadCount();
      if (result.success && result.count !== undefined) {
        setUnreadCount(result.count);
      }
    };

    // Initial fetch
    fetchCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => router.push("/admin/notifications")}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#D4AF37] rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#B5952F] transition-colors"
    >
      <div className="relative">
        <Bell className="w-6 h-6 text-[#1a1a1a]" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-[#1a1a1a]"
            >
              <span className="text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
