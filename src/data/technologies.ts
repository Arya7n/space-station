export type StationSystem = {
  id: string;
  label: string;
  online: string;
};

export const STATION_SYSTEMS: StationSystem[] = [
  { id: "node", label: "NODE.JS", online: "RUNTIME STABLE" },
  { id: "react", label: "REACT", online: "INTERFACE LINKED" },
  { id: "next", label: "NEXT.JS", online: "ROUTING ONLINE" },
  { id: "mongo", label: "MONGODB", online: "DOCUMENT STORE ONLINE" },
  { id: "postgres", label: "POSTGRESQL", online: "RELATIONAL STORE ONLINE" },
  { id: "redis", label: "REDIS", online: "CACHE SYSTEM ONLINE" },
  { id: "docker", label: "DOCKER", online: "CONTAINER NETWORK ONLINE" },
  { id: "aws", label: "AWS", online: "UPLINK ESTABLISHED" },
  { id: "k8s", label: "KUBERNETES", online: "CLUSTER STATUS NOMINAL" },
  { id: "nest", label: "NESTJS", online: "SERVICE MESH ONLINE" },
  { id: "go", label: "GO", online: "COMPILED SERVICES ONLINE" },
];
