import { create } from "zustand"

interface Project {
    id:string
    name:string
    description:string | null
    createdAt:string
    _count:{
        flags:number
        environments:number
    }
}

interface ProjectsState {
    projects:Project[]
    selectedProject:Project | null
    loading:boolean
    setProjects:(projects:Project[]) => void
    setSelectedProject:(project:Project | null) => void
    addProject:(project:Project) => void
    setLoading:(loading:boolean) => void
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  setProjects: (projects) => set({ projects }),
  setSelectedProject: (project) => set({ selectedProject: project }),
  addProject: (project) => set((state) => ({
    projects: [project, ...state.projects]
  })),
  setLoading: (loading) => set({ loading }),
}))
