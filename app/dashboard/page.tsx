"use client";

import CreateProjectModal from "@/components/create-project-modal";
import { useAuthStore } from "@/lib/store/auth-store";
import { useProjectsStore } from "@/lib/store/projects-store";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const { projects, setProjects, loading, setLoading } = useProjectsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalFlags = projects.reduce((sum, p) => sum + p._count.flags, 0);
  const totalEnvs = projects.reduce((sum, p) => sum + p._count.environments, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || "User"}!
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your feature flags and projects
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {projects.length}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {projects.length === 0
              ? "Create your first project"
              : "Active projects"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Feature Flags
          </h3>
          <p className="text-3xl font-bold text-indigo-600">{totalFlags}</p>
          <p className="text-sm text-gray-500 mt-2">Across all projects</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Environments
          </h3>
          <p className="text-3xl font-bold text-indigo-600">{totalEnvs}</p>
          <p className="text-sm text-gray-500 mt-2">Total environments</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Projects</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            + New Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No projects yet. Create your first project to get started!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-md transition"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  {project.name}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description || "No description"}
                </p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>{project._count.flags} flags</span>
                  <span>{project._count.environments} envs</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
