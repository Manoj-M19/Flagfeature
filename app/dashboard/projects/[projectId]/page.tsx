"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useSocket } from "@/lib/socket-context";
import CreateFlagModal from "@/components/create-flag-modal";

interface FlagState {
  id: string;
  enabled: boolean;
  environment: {
    id: string;
    name: string;
  };
}

interface Flag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  createdAt: string;
  states: FlagState[];
}

interface Environment {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  environments: Environment[];
  flags: Flag[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { socket, isConnected } = useSocket();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [params.projectId]);

  useEffect(() => {
    if (!socket || !params.projectId) return;

    socket.emit("join-project", params.projectId);

    socket.on("flag-toggled", (updatedFlag: Flag) => {
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          flags: prev.flags.map((f) =>
            f.id === updatedFlag.id ? updatedFlag : f,
          ),
        };
      });
    });

    return () => {
      socket.emit("leave-project", params.projectId);
      socket.off("flag-toggled");
    };
  }, [socket, params.projectId]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${params.projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        router.push("/dashboard");
        return;
      }

      const data = await res.json();
      setProject(data.project);
    } catch (err) {
      console.error("Failed to fetch project:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = async (
    flagId: string,
    environmentId: string,
    enabled: boolean,
  ) => {
    try {
      const res = await fetch(
        `/api/projects/${params.projectId}/flags/${flagId}/toggle`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ environmentId, enabled }),
        },
      );

      if (!res.ok) {
        console.error("Failed to toggle flag");
      }
    } catch (err) {
      console.error("Failed to toggle flag:", err);
    }
  };

  const handleFlagCreated = (newFlag: Flag) => {
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        flags: [newFlag, ...prev.flags],
      };
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 text-gray-500">
          Loading project...
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-indigo-600 hover:text-indigo-700 mb-4"
        >
          ← Back to Dashboard
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
          {isConnected && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Live
            </span>
          )}
        </div>
        <p className="text-gray-600 mt-2">
          {project.description || "No description"}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Feature Flags</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            + New Flag
          </button>
        </div>

        {project.flags.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No flags yet. Create your first feature flag!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Create Your First Flag
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Flag
                  </th>
                  {project.environments.map((env) => (
                    <th
                      key={env.id}
                      className="text-center py-3 px-4 font-semibold text-gray-700 capitalize"
                    >
                      {env.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {project.flags.map((flag) => (
                  <tr
                    key={flag.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{flag.name}</p>
                        <p className="text-sm text-gray-500 font-mono">
                          {flag.key}
                        </p>
                        {flag.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {flag.description}
                          </p>
                        )}
                      </div>
                    </td>
                    {project.environments.map((env) => {
                      const state = flag.states.find(
                        (s) => s.environment.id === env.id,
                      );
                      return (
                        <td key={env.id} className="py-4 px-4 text-center">
                          <button
                            onClick={() =>
                              toggleFlag(flag.id, env.id, !state?.enabled)
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                              state?.enabled ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                state?.enabled
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateFlagModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project.id}
        onFlagCreated={handleFlagCreated}
      />
    </div>
  );
}
