import Link from "@docusaurus/Link";
import React from "react";
import styles from "../css/projects.module.css";

const projects: Project[] = [
  {
    title: "DiskCraft V1",
    description:
      "Easy to use and open source billing system for Pterodactyl and Qemu VPS's",
    repo: "DiskCraft/DiskCraft",
    link: "/diskcraft",
  },
  {
    title: "DiskCraft V1.5",
    description:
      "Easy to use and open source billing system for Pterodactyl and Qemu VPS's",
    repo: "DiskCraft/diskcraft1.5",
    link: "/diskcraft/getting-started-I",
  },
];

function Project(project: Project) {
  return (
    <div className={styles.project}>
      <div className={styles.flex}>
        <Link className={styles.projectGitHub} to={`https://github.com/${project.repo}`}>
          {project.title}
        </Link>
        <p>{project.description}</p>
      </div>
      <div>
        <Link className="button button--primary" to={project.link}>
          Go
        </Link>
      </div>
    </div>
  );
}

export default function Projects(): JSX.Element {
  return (
    <section className={styles.projects}>
      <div className={styles.projectsContainer}>
        {projects.map((project, index) => (
          <Project key={index} {...project} />
        ))}
      </div>
    </section>
  );
}

interface Project {
  title: string;
  description: string;
  repo: string;
  link: string;
}
