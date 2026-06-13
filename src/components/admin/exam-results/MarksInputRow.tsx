"use client";

import {
  Hash,
  User,
  Plus,
  CheckCircle,
  Ban,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MarksInputRowProps {
  indexNumber: string;
  studentName: string;
  marks: string;
  isBlocked: boolean;
  isCheckingIndex: boolean;
  indexWarning: string;
  isEditing: boolean;
  onIndexChange: (value: string) => void;
  onStudentNameChange: (value: string) => void;
  onMarksChange: (value: string) => void;
  onAddOrUpdate: () => void;
  onClear: () => void;
}

export function MarksInputRow({
  indexNumber,
  studentName,
  marks,
  isBlocked,
  isCheckingIndex,
  indexWarning,
  isEditing,
  onIndexChange,
  onStudentNameChange,
  onMarksChange,
  onAddOrUpdate,
  onClear,
}: MarksInputRowProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <Label className="text-gray-700 ml-1 flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#D4AF37]" />
            Index No
          </Label>
          <div className="relative">
            <Input
              placeholder="e.g., 111200"
              value={indexNumber}
              onChange={(e) => onIndexChange(e.target.value)}
              disabled={isBlocked}
              className={`h-12 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 ${
                isBlocked
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500 bg-red-50"
                  : indexWarning && !isBlocked
                    ? "border-amber-400 focus:border-amber-500 focus:ring-amber-500"
                    : "border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              }`}
            />
            {isCheckingIndex && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <Label className="text-gray-700 ml-1 flex items-center gap-2">
            <User className="w-4 h-4 text-[#D4AF37]" />
            Student Name
          </Label>
          <Input
            placeholder="Enter student name"
            value={studentName}
            onChange={(e) => onStudentNameChange(e.target.value)}
            disabled={isBlocked}
            className={`h-12 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 ${
              isBlocked ? "bg-red-50 border-red-300" : "border-gray-300"
            } focus:border-[#D4AF37] focus:ring-[#D4AF37]`}
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <Label className="text-gray-700 ml-1">Marks (0-100)</Label>
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="e.g., 75"
            value={marks}
            onChange={(e) => onMarksChange(e.target.value)}
            disabled={isBlocked}
            className={`h-12 rounded-xl bg-white text-gray-900 focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-400 ${
              isBlocked ? "bg-red-50 border-red-300" : "border-gray-300"
            }`}
          />
        </div>

        <div className="flex gap-2 items-end">
          <Button
            onClick={onAddOrUpdate}
            disabled={isBlocked}
            className={`h-12 px-6 font-bold rounded-xl shadow-lg transition-all gap-2 whitespace-nowrap ${
              isBlocked
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:opacity-90 text-[#1a1a1a] shadow-[#D4AF37]/20"
            }`}
          >
            {isBlocked ? (
              <>
                <Ban className="w-4 h-4" />
                Cannot Add
              </>
            ) : isEditing ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Update Mark
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Marks
              </>
            )}
          </Button>
          {isEditing && (
            <Button
              onClick={onClear}
              variant="outline"
              className="h-12 px-4 rounded-xl border-gray-300"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {indexWarning && (
        <div className="flex gap-4">
          <div className="flex-1">
            <p
              className={`text-xs flex items-start gap-1 px-3 py-1.5 rounded-lg border ${
                isBlocked
                  ? "text-red-600 bg-red-50 border-red-200"
                  : "text-amber-600 bg-amber-50 border-amber-200"
              }`}
            >
              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>{indexWarning}</span>
            </p>
          </div>
          <div className="flex-1" />
          <div
            className="flex gap-2"
            style={{ width: isEditing ? "176px" : "136px" }}
          />
        </div>
      )}
    </div>
  );
}
