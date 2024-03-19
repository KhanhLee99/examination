"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import projectsApiRequest, { ProjectType } from "./apiRequests/projects";

export default function Home() {
  const [projects, setProjects] = useState<ProjectType[]>([]);

  useEffect(() => {
    const isAuth = Boolean(localStorage.getItem("access_token"));
    if (!isAuth) {
      redirect("/login");
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      await projectsApiRequest
        .getProjects()
        .then((res) => {
          if (res.status === 200) {
            setProjects(res.payload.results);
          }
          console.log("res", res);
        })
        .catch((err) => console.log("err", err));
    };

    fetchProjects();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Project Name
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Project Domain</div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">Last Accessed</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 &&
              projects.map((project) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {project.project_name}
                  </th>
                  <td className="px-6 py-4">{project.project_domain}</td>
                  <td className="px-6 py-4">{project.last_accessed}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
