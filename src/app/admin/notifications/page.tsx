"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  Filter,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getNotifications,
  markAllAsRead,
  getNotificationTypes,
} from "@/lib/actions/notifications";
import { NotificationCard } from "@/components/admin/NotificationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    const [notifResult, typesResult] = await Promise.all([
      getNotifications(),
      getNotificationTypes(),
    ]);

    if (notifResult.success && notifResult.data) {
      setNotifications(notifResult.data);
    }
    if (typesResult.success && typesResult.data) {
      setAvailableTypes(typesResult.data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    const initData = async () => {
      const [notifResult, typesResult] = await Promise.all([
        getNotifications(),
        getNotificationTypes(),
      ]);

      if (notifResult.success && notifResult.data) {
        setNotifications(notifResult.data);
      }
      if (typesResult.success && typesResult.data) {
        setAvailableTypes(typesResult.data);
      }
      setLoading(false);
      setRefreshing(false);
    };

    initData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    fetchNotifications();
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesType = filterType === "all" || n.type === filterType;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="w-8 h-8 text-[#D4AF37]" />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your system alerts, payment notifications, and updates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="border-gray-200 hover:bg-gray-50"
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={handleMarkAllRead}
              className="bg-[#D4AF37] text-[#1a1a1a] hover:bg-[#B5952F]"
              disabled={unreadCount === 0}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="border-gray-200 bg-white! shadow-sm ring-offset-white">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Types</SelectItem>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}s
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onUpdate={fetchNotifications}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white rounded-xl border border-gray-100 border-dashed"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    No notifications found
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {searchQuery || filterType !== "all"
                      ? "Try adjusting your filters or search query."
                      : "You're all caught up! No new notifications."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
