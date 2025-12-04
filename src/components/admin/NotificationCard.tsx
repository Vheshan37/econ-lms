"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
    Bell,
    CreditCard,
    Building2,
    AlertTriangle,
    UserPlus,
    Check,
    Trash2,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { markAsRead, deleteNotification } from "@/lib/actions/notifications";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
    notification: any;
    onUpdate: () => void;
}

export function NotificationCard({ notification, onUpdate }: NotificationCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const getIcon = () => {
        switch (notification.type) {
            case "payment": return <CreditCard className="w-5 h-5 text-green-500" />;
            case "company": return <Building2 className="w-5 h-5 text-blue-500" />;
            case "system": return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case "student": return <UserPlus className="w-5 h-5 text-purple-500" />;
            default: return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPriorityColor = () => {
        switch (notification.priority) {
            case "urgent": return "border-l-4 border-l-red-500";
            case "high": return "border-l-4 border-l-orange-500";
            case "normal": return "border-l-4 border-l-blue-500";
            default: return "border-l-4 border-l-gray-300";
        }
    };

    const handleMarkAsRead = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await markAsRead(notification.id);
        onUpdate();
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(true);
        await deleteNotification(notification.id);
        onUpdate();
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={cn(
                "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md cursor-pointer",
                getPriorityColor(),
                !notification.isRead && "bg-blue-50/50"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="p-4">
                <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 bg-gray-50 rounded-lg">
                        {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className={cn("font-semibold text-gray-900", !notification.isRead && "font-bold")}>
                                {notification.title}
                            </h3>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p className={cn("text-sm text-gray-600 line-clamp-2", isExpanded && "line-clamp-none")}>
                            {notification.message}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 ml-2">
                        {!notification.isRead && (
                            <button
                                onClick={handleMarkAsRead}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Mark as read"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-gray-100"
                        >
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Type:</span>
                                    <span className="ml-2 font-medium capitalize">{notification.type}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Priority:</span>
                                    <span className={cn("ml-2 font-medium capitalize",
                                        notification.priority === "urgent" ? "text-red-600" :
                                            notification.priority === "high" ? "text-orange-600" :
                                                "text-gray-900"
                                    )}>
                                        {notification.priority}
                                    </span>
                                </div>
                                {notification.metadata && (
                                    <div className="col-span-2 mt-2 bg-gray-50 p-3 rounded-lg font-mono text-xs text-gray-600 overflow-x-auto">
                                        {JSON.stringify(notification.metadata, null, 2)}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
