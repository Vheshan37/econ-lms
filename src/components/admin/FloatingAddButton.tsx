"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface FloatingAddButtonProps {
  onClick: () => void;
  label?: string;
}

/**
 * Floating Action Button (FAB) for mobile admin pages.
 * Sits above the bottom navigation bar and only appears on mobile (md:hidden).
 * On desktop, the header Add button is used instead.
 */
export function FloatingAddButton({ onClick, label }: FloatingAddButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="md:hidden fixed right-4 bottom-20 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B5952F] shadow-lg shadow-[#D4AF37]/40 flex items-center justify-center cursor-pointer active:shadow-md transition-shadow"
      aria-label={label || "Add new"}
    >
      <Plus className="w-7 h-7 text-[#1a1a1a] stroke-[2.5]" />
    </motion.button>
  );
}
