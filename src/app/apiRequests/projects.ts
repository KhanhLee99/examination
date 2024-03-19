import http from "@/lib/http";

export interface ProjectType {
  id: number;
  project_name: string;
  project_domain: string;
  last_accessed: string;
  license_use: {
    license_type: string;
    libraries: string[];
  }[];
}

interface ProjectsListType {
  count: number;
  results: ProjectType[];
}

const projectsApiRequest = {
  getProjects: () => http.get<ProjectsListType>("/projects"),
};

export default projectsApiRequest;
