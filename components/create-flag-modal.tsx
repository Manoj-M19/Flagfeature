"use client";
import { useAuthStore } from "@/lib/store/auth-store";
import React, { useState } from "react";

interface CreateFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onFlagCreated: (flag: any) => void;
}

export default function CreateFlagModal({
  isOpen,
  onClose,
  projectId,
  onFlagCreated,
}: CreateFlagModalProps) {
  const token = useAuthStore((state) => state.token);
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/flags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key, name, description }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create flag");
        setLoading(false);
        return;
      }

      onFlagCreated(data.flag);
      setKey("");
      setName("");
      setDescription("");
      onClose();
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Create Feature Flag
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="key"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Flag Key *
            </label>
            <input
              id="key"
              type="text"
              value={key}
              onChange={(e) =>
                setKey(e.target.value.toLowerCase().replace(/\\s+/g, "_"))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
              placeholder="new_feature_toggle"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique identifier (lowercase, underscores only)
            </p>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Display Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="New Feature Toggle"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="What does this flag control?"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Flag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
