export interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  step: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Diagram {
  id: string;
  title: string;
  subtitle: string;
  viewBox: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

const N = { w: 120, h: 44 };

export const heroDiagram: Diagram = {
  id: 'hero',
  title: '',
  subtitle: '',
  viewBox: '0 0 700 100',
  nodes: [
    { id: 'define', label: 'Define', x: 20, y: 28, ...N, step: 0 },
    { id: 'parse', label: 'Parse', x: 200, y: 28, ...N, step: 1 },
    { id: 'animate', label: 'Animate', x: 380, y: 28, w: 130, h: 44, step: 2 },
    { id: 'share', label: 'Share', x: 570, y: 28, ...N, step: 3 },
  ],
  edges: [
    { from: 'define', to: 'parse' },
    { from: 'parse', to: 'animate' },
    { from: 'animate', to: 'share' },
  ],
};

export const tourDiagrams: Diagram[] = [
  {
    id: 'simple-flow',
    title: 'Sequential Flows',
    subtitle: 'Visualize step-by-step processes with smooth, timed animations that reveal each stage.',
    viewBox: '0 0 700 100',
    nodes: [
      { id: 'request', label: 'Request', x: 20, y: 28, ...N, step: 0 },
      { id: 'validate', label: 'Validate', x: 190, y: 28, ...N, step: 1 },
      { id: 'process', label: 'Process', x: 360, y: 28, ...N, step: 2 },
      { id: 'respond', label: 'Respond', x: 530, y: 28, ...N, step: 3 },
    ],
    edges: [
      { from: 'request', to: 'validate' },
      { from: 'validate', to: 'process' },
      { from: 'process', to: 'respond' },
    ],
  },
  {
    id: 'parallel',
    title: 'Parallel Branching',
    subtitle: 'Fork, fan-out, and join — concurrent paths animate simultaneously.',
    viewBox: '0 0 560 230',
    nodes: [
      { id: 'input', label: 'Input', x: 220, y: 6, ...N, step: 0 },
      { id: 'auth', label: 'Auth', x: 30, y: 93, w: 100, h: 44, step: 1 },
      { id: 'cache', label: 'Cache', x: 230, y: 93, w: 100, h: 44, step: 1 },
      { id: 'log', label: 'Log', x: 430, y: 93, w: 100, h: 44, step: 1 },
      { id: 'merge', label: 'Merge', x: 220, y: 180, ...N, step: 2 },
    ],
    edges: [
      { from: 'input', to: 'auth' },
      { from: 'input', to: 'cache' },
      { from: 'input', to: 'log' },
      { from: 'auth', to: 'merge' },
      { from: 'cache', to: 'merge' },
      { from: 'log', to: 'merge' },
    ],
  },
  {
    id: 'ai-agent',
    title: 'AI Agent Loops',
    subtitle: 'Cyclic flows with feedback — perfect for LLM agent and ReAct patterns.',
    viewBox: '0 0 600 210',
    nodes: [
      { id: 'user', label: 'User', x: 20, y: 6, w: 100, h: 44, step: 0 },
      { id: 'parse', label: 'Parse', x: 170, y: 6, w: 100, h: 44, step: 1 },
      { id: 'think', label: 'LLM', x: 320, y: 6, w: 100, h: 44, step: 2 },
      { id: 'act', label: 'Act', x: 470, y: 6, w: 100, h: 44, step: 3 },
      { id: 'respond', label: 'Respond', x: 470, y: 93, w: 110, h: 44, step: 4 },
      { id: 'output', label: 'Output', x: 470, y: 170, w: 100, h: 44, step: 5 },
    ],
    edges: [
      { from: 'user', to: 'parse' },
      { from: 'parse', to: 'think' },
      { from: 'think', to: 'act' },
      { from: 'act', to: 'respond' },
      { from: 'respond', to: 'output' },
    ],
  },
  {
    id: 'microservice',
    title: 'Microservice Architectures',
    subtitle: 'Map service topologies with routed edges and grouped clusters.',
    viewBox: '0 0 640 230',
    nodes: [
      { id: 'gateway', label: 'Gateway', x: 20, y: 6, ...N, step: 0 },
      { id: 'auth', label: 'Auth', x: 200, y: 6, w: 100, h: 44, step: 1 },
      { id: 'router', label: 'Router', x: 370, y: 6, w: 110, h: 44, step: 2 },
      { id: 'users', label: 'Users', x: 290, y: 93, w: 110, h: 44, step: 3 },
      { id: 'orders', label: 'Orders', x: 460, y: 93, w: 110, h: 44, step: 3 },
      { id: 'store', label: 'Store', x: 370, y: 180, w: 110, h: 44, step: 4 },
    ],
    edges: [
      { from: 'gateway', to: 'auth' },
      { from: 'auth', to: 'router' },
      { from: 'router', to: 'users' },
      { from: 'router', to: 'orders' },
      { from: 'users', to: 'store' },
      { from: 'orders', to: 'store' },
    ],
  },
  {
    id: 'ml-pipeline',
    title: 'ML Pipelines',
    subtitle: 'End-to-end data flows — from ingestion through training to production deployment.',
    viewBox: '0 0 870 100',
    nodes: [
      { id: 'ingest', label: 'Ingest', x: 20, y: 28, w: 100, h: 44, step: 0 },
      { id: 'clean', label: 'Clean', x: 180, y: 28, w: 100, h: 44, step: 1 },
      { id: 'train', label: 'Train', x: 340, y: 28, w: 100, h: 44, step: 2 },
      { id: 'eval', label: 'Evaluate', x: 500, y: 28, ...N, step: 3 },
      { id: 'deploy', label: 'Deploy', x: 680, y: 28, w: 110, h: 44, step: 4 },
    ],
    edges: [
      { from: 'ingest', to: 'clean' },
      { from: 'clean', to: 'train' },
      { from: 'train', to: 'eval' },
      { from: 'eval', to: 'deploy' },
    ],
  },
];
