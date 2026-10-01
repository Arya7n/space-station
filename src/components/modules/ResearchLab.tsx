"use client";

import { PROJECTS } from "@/data/projects";
import { audio } from "@/lib/audio/audioManager";
import { useStationStore } from "@/store/stationStore";

export function ResearchLab() {
  const projectId = useStationStore((state) => state.projectId);
  const setProjectId = useStationStore((state) => state.setProjectId);
  const project = PROJECTS.find((item) => item.id === projectId);

  if (!project) {
    return (
      <div className="space-y-3">
        <p className="text-muted font-mono text-[10px] tracking-[0.18em]">
          RESEARCH TERMINALS
        </p>
        {PROJECTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="border-line hover:border-accent block w-full border px-3 py-3 text-left"
            onClick={() => {
              audio.play("click");
              setProjectId(item.id);
            }}
          >
            <span className="text-muted block font-mono text-[10px] tracking-[0.16em]">
              {item.code}
            </span>
            <span className="mt-2 block font-mono text-[12px] tracking-[0.14em]">
              {item.title}
            </span>
            <span className="text-muted mt-1 block font-mono text-[10px]">
              {item.status}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <article className="space-y-4 font-mono text-[11px] leading-6">
      <button
        type="button"
        className="text-muted tracking-[0.16em]"
        onClick={() => setProjectId(null)}
      >
        BACK TO TERMINALS
      </button>
      <p className="text-muted tracking-[0.18em]">{project.code}</p>
      <h3 className="text-[13px] tracking-[0.16em]">{project.title}</h3>
      <p className="text-muted">STATUS: {project.status}</p>
      <p>{project.summary}</p>
      <p>
        <span className="text-muted">ARCHITECTURE</span>
        <span className="mt-1 block">{project.architecture}</span>
      </p>
      <p>
        <span className="text-muted">TECHNOLOGIES</span>
        <span className="mt-1 block">{project.technologies.join("  /  ")}</span>
      </p>
      <p>
        <span className="text-muted">CHALLENGE</span>
        <span className="mt-1 block">{project.challenge}</span>
      </p>
      <p>
        <span className="text-muted">SOLUTION</span>
        <span className="mt-1 block">{project.solution}</span>
      </p>
      <div className="border-line text-muted border px-3 py-6 text-center tracking-[0.16em]">
        PLATE 01 — NO IMAGE ON FILE
      </div>
      {project.source ? (
        <a
          className="border-line hover:border-accent inline-block border px-3 py-2 tracking-[0.16em]"
          href={project.source}
          target="_blank"
          rel="noreferrer"
        >
          SOURCE
        </a>
      ) : null}
    </article>
  );
}
