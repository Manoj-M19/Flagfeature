"use client";

import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/api-keys", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setApiKeys(data.apiKeys);
      }
    } catch (error) {
      console.error("Failed to fetch API Keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newKeyName }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewlyCreatedKey(data.apiKey.key);
        setNewKeyName("");
        fetchApiKeys();
      }
    } catch (error) {
      console.error("Failed to create API key:", error);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this API key? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/api-keys/${keyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchApiKeys();
      }
    } catch (err) {
      console.error("Failed to delete API key:", err);
    }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-indigo-600 hover:text-indigo-700 mb-4"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-gray-900">API Keys</h2>
        <p className="text-gray-600 mt-2">
          Manage API keys for SDK integration
        </p>
      </div>

      {/* New key created alert */}
      {newlyCreatedKey && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                API Key Created Successfully!
              </h3>
              <p className="text-sm text-green-700 mb-3">
                Make sure to copy your API key now. You won't be able to see it
                again!
              </p>
              <div className="bg-white border border-green-300 rounded p-3 font-mono text-sm break-all">
                {newlyCreatedKey}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => copyToClipboard(newlyCreatedKey)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setNewlyCreatedKey(null)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Create New API Key
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="API Key Name (e.g., Production Key)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && createApiKey()}
          />
          <button
            onClick={createApiKey}
            disabled={!newKeyName.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Key
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your API Keys</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : apiKeys.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No API keys yet. Create one to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Last Used
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {key.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {key.key}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {key.lastUsed
                        ? new Date(key.lastUsed).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => deleteApiKey(key.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
