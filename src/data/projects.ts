export type ProjectRecord = {
  id: string;
  code: string;
  title: string;
  status: string;
  summary: string;
  architecture: string;
  technologies: string[];
  challenge: string;
  solution: string;
  source?: string;
};

export const PROJECTS: ProjectRecord[] = [
  {
    id: "exp-001",
    code: "EXPERIMENT 001",
    title: "MASSAED",
    status: "DEPLOYED",
    summary:
      "Technician tracking for crews moving between sites. The record follows assignment, location, and handoff without turning the person into a dashboard.",
    architecture:
      "API services write assignment events into MongoDB. Redis holds the live location window. Workers ship from containers on AWS.",
    technologies: ["Node.js", "MongoDB", "Redis", "Docker", "AWS"],
    challenge:
      "Location updates arrived faster than the assignment record could be trusted. Crews saw stale posts during handoff.",
    solution:
      "Split the live position cache from the durable assignment log. The cache expires. The log is the record that other services read.",
    source: "https://github.com/Arya7n",
  },
  {
    id: "exp-007",
    code: "EXPERIMENT 007",
    title: "ORBITAL-07",
    status: "ACTIVE",
    summary:
      "This station. A navigable environment where modules are the pages, and the camera is the router.",
    architecture:
      "Next.js serves the shell. A client-only WebGL scene owns the space. Zustand holds telemetry, module, and camera state. GSAP flies the camera. DOM panels open only after arrival.",
    technologies: ["Next.js", "React", "TypeScript", "Three.js", "GSAP"],
    challenge:
      "A decorative 3D background would leave the content feeling like a normal site. The scene had to stay light enough to fly.",
    solution:
      "One star buffer, shared hull materials, and a quality tier that drops shadows and debris on smaller devices. Panels stay HTML so they remain readable and keyboard accessible.",
    source: "https://github.com/Arya7n/space-station",
  },
];
