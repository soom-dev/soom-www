<script lang="ts">
  import { onMount } from 'svelte';
  import type { Diagram, DiagramNode, DiagramEdge } from '../lib/diagrams';

  type NodeState = 'rest' | 'active' | 'completed';

  let {
    diagram,
    playing = false,
    frozen = false,
  }: {
    diagram: Diagram;
    playing?: boolean;
    frozen?: boolean;
  } = $props();

  let nodeStates = $state<NodeState[]>(diagram.nodes.map(() => 'rest'));
  let edgeDrawn = $state<boolean[]>(diagram.edges.map(() => false));
  let pathLengths = $state<number[]>(diagram.edges.map(() => 200));
  let pathEls: SVGPathElement[] = [];
  let timeouts: ReturnType<typeof setTimeout>[] = [];
  let reducedMotion = $state(false);

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    pathEls.forEach((el, i) => {
      if (el) pathLengths[i] = el.getTotalLength();
    });

    if (reducedMotion || frozen) {
      nodeStates = diagram.nodes.map(() => 'completed');
      edgeDrawn = diagram.edges.map(() => true);
    }
  });

  function clearAll() {
    timeouts.forEach((t) => clearTimeout(t));
    timeouts = [];
  }

  function reset() {
    clearAll();
    nodeStates = diagram.nodes.map(() => 'rest');
    edgeDrawn = diagram.edges.map(() => false);
  }

  function animate() {
    reset();

    const maxStep = Math.max(...diagram.nodes.map((n) => n.step));
    const stepDuration = 1200;

    for (let s = 0; s <= maxStep; s++) {
      timeouts.push(
        setTimeout(() => {
          diagram.nodes.forEach((node, i) => {
            if (node.step === s) nodeStates[i] = 'active';
            if (node.step < s) nodeStates[i] = 'completed';
          });

          diagram.edges.forEach((edge, i) => {
            const fromNode = diagram.nodes.find((n) => n.id === edge.from)!;
            const toNode = diagram.nodes.find((n) => n.id === edge.to)!;
            if (toNode.step <= s) edgeDrawn[i] = true;
          });
        }, s * stepDuration),
      );
    }

    timeouts.push(
      setTimeout(() => {
        nodeStates = diagram.nodes.map(() => 'completed');
        edgeDrawn = diagram.edges.map(() => true);
      }, (maxStep + 1) * stepDuration),
    );

    timeouts.push(
      setTimeout(() => {
        if (playing && !reducedMotion) animate();
      }, (maxStep + 1) * stepDuration + 2000),
    );
  }

  $effect(() => {
    if (reducedMotion || frozen) return;
    if (playing) {
      animate();
    } else {
      reset();
    }
    return clearAll;
  });

  function edgePath(edge: DiagramEdge): string {
    const from = diagram.nodes.find((n) => n.id === edge.from)!;
    const to = diagram.nodes.find((n) => n.id === edge.to)!;

    const fromCx = from.x + from.w / 2;
    const fromCy = from.y + from.h / 2;
    const toCx = to.x + to.w / 2;
    const toCy = to.y + to.h / 2;

    const dx = toCx - fromCx;
    const dy = toCy - fromCy;
    const horizontal = Math.abs(dx) > Math.abs(dy);

    let x1: number, y1: number, x2: number, y2: number;

    if (horizontal) {
      x1 = dx > 0 ? from.x + from.w : from.x;
      y1 = fromCy;
      x2 = dx > 0 ? to.x : to.x + to.w;
      y2 = toCy;
    } else {
      x1 = fromCx;
      y1 = dy > 0 ? from.y + from.h : from.y;
      x2 = toCx;
      y2 = dy > 0 ? to.y : to.y + to.h;
    }

    if (Math.abs(y1 - y2) < 5 && Math.abs(x1 - x2) < 300) {
      return `M${x1},${y1} L${x2},${y2}`;
    }

    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    if (horizontal) {
      return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
    }
    return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
  }

  function nodeClass(index: number): string {
    return `diagram-node node-${nodeStates[index]}`;
  }
</script>

<svg
  viewBox={diagram.viewBox}
  xmlns="http://www.w3.org/2000/svg"
  class="animated-diagram"
  role="img"
  aria-label={diagram.title || 'Animated flowchart diagram'}
>
  <defs>
    <marker
      id={`arrow-${diagram.id}`}
      viewBox="0 0 10 7"
      refX="10"
      refY="3.5"
      markerWidth="8"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M0,0 L10,3.5 L0,7" fill="var(--soom-edge-stroke-active)" />
    </marker>
    <marker
      id={`arrow-rest-${diagram.id}`}
      viewBox="0 0 10 7"
      refX="10"
      refY="3.5"
      markerWidth="8"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M0,0 L10,3.5 L0,7" fill="var(--soom-edge-stroke-rest)" />
    </marker>
  </defs>

  {#each diagram.edges as edge, i}
    <path
      bind:this={pathEls[i]}
      d={edgePath(edge)}
      class="diagram-edge"
      class:drawn={edgeDrawn[i]}
      stroke-dasharray={pathLengths[i]}
      stroke-dashoffset={edgeDrawn[i] ? 0 : pathLengths[i]}
      marker-end={edgeDrawn[i]
        ? `url(#arrow-${diagram.id})`
        : `url(#arrow-rest-${diagram.id})`}
    />
  {/each}

  {#each diagram.nodes as node, i}
    <g class={nodeClass(i)}>
      <rect
        x={node.x}
        y={node.y}
        width={node.w}
        height={node.h}
        rx="8"
        ry="8"
      />
      <text
        x={node.x + node.w / 2}
        y={node.y + node.h / 2}
        dominant-baseline="central"
        text-anchor="middle"
      >
        {node.label}
      </text>
    </g>
  {/each}
</svg>

<style>
  .animated-diagram {
    width: 100%;
    height: auto;
    max-height: 60vh;
  }

  .diagram-edge {
    fill: none;
    stroke: var(--soom-edge-stroke-rest);
    stroke-width: 2;
    transition:
      stroke-dashoffset 0.6s ease-out,
      stroke 0.3s ease;
  }

  .diagram-edge.drawn {
    stroke: var(--soom-edge-stroke-active);
  }

  .diagram-node rect {
    fill: transparent;
    stroke: var(--soom-edge-stroke-rest);
    stroke-width: 1.5;
    transition:
      fill 0.4s ease,
      stroke 0.3s ease,
      opacity 0.4s ease,
      filter 0.4s ease;
    filter: drop-shadow(-4px 6px 10px var(--soom-shadow-rest));
    opacity: 0.4;
  }

  .diagram-node text {
    fill: var(--soom-text);
    font-family: var(--soom-font);
    font-size: 14px;
    font-weight: 700;
    transition:
      fill 0.3s ease,
      opacity 0.4s ease;
    opacity: 0.4;
  }

  .node-active rect {
    fill: var(--soom-accent);
    stroke: var(--soom-accent);
    opacity: 1;
    filter: drop-shadow(-6px 10px 16px var(--soom-shadow-active));
  }

  .node-active text {
    fill: #fff;
    opacity: 1;
  }

  .node-completed rect {
    fill: var(--soom-completed-fill);
    stroke: var(--soom-completed-fill);
    opacity: 0.85;
    filter: drop-shadow(-4px 7px 12px var(--soom-shadow-completed));
  }

  .node-completed text {
    fill: var(--soom-bg);
    opacity: 0.85;
  }

  @media (prefers-reduced-motion: reduce) {
    .diagram-edge {
      transition: none;
      stroke-dashoffset: 0 !important;
      stroke: var(--soom-edge-stroke-active);
    }

    .diagram-node rect,
    .diagram-node text {
      transition: none;
    }
  }
</style>
