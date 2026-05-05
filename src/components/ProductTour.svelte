<script lang="ts">
  import { onMount } from 'svelte';
  import AnimatedDiagram from './AnimatedDiagram.svelte';
  import { tourDiagrams } from '../lib/diagrams';

  let containerEl: HTMLElement | undefined;
  let currentPanel = $state(0);
  let panOffset = $state(0);
  let reducedMotion = $state(false);

  const panels = tourDiagrams;

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) return;

    function onScroll() {
      if (!containerEl) return;
      const rect = containerEl.getBoundingClientRect();
      const scrollable = containerEl.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const exact = progress * (panels.length - 1);
      currentPanel = Math.min(Math.floor(exact), panels.length - 1);
      panOffset = exact - currentPanel;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  });

  function isActive(index: number): boolean {
    return Math.abs(currentPanel + panOffset - index) < 0.8;
  }
</script>

<section
  bind:this={containerEl}
  class="product-tour"
  style:height={`${panels.length * 100}vh`}
>
  <div class="tour-sticky">
    <div class="tour-header">
      <h2>What you can animate</h2>
      <div class="tour-dots">
        {#each panels as _, i}
          <span class="dot" class:active={currentPanel === i}></span>
        {/each}
      </div>
    </div>

    {#if reducedMotion}
      <div class="tour-panels-static">
        {#each panels as panel}
          <div class="panel-static">
            <h3>{panel.title}</h3>
            <p>{panel.subtitle}</p>
            <div class="panel-diagram">
              <AnimatedDiagram diagram={panel} frozen={true} />
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div
        class="tour-track"
        style:transform={`translateX(-${(currentPanel + panOffset) * (100 / panels.length)}%)`}
      >
        {#each panels as panel, i}
          <div class="panel">
            <div class="panel-text">
              <h3>{panel.title}</h3>
              <p>{panel.subtitle}</p>
            </div>
            <div class="panel-diagram">
              <AnimatedDiagram diagram={panel} playing={isActive(i)} />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .product-tour {
    position: relative;
  }

  .tour-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .tour-header {
    text-align: center;
    padding: var(--soom-space-xxl) var(--soom-space-xxl) var(--soom-space-lg);
    flex-shrink: 0;
  }

  .tour-header h2 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700;
    color: var(--soom-text);
    margin-bottom: var(--soom-space-md);
  }

  .tour-dots {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--soom-text-muted);
    opacity: 0.3;
    transition: opacity 0.3s ease, background 0.3s ease;
  }

  .dot.active {
    opacity: 1;
    background: var(--soom-accent);
  }

  .tour-track {
    display: flex;
    flex: 1;
    width: 500%;
    transition: transform 0.05s linear;
  }

  .panel {
    width: 20%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 var(--soom-space-xxl);
    gap: var(--soom-space-xl);
  }

  .panel-text {
    text-align: center;
    max-width: 500px;
  }

  .panel-text h3 {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    font-weight: 700;
    color: var(--soom-text);
    margin-bottom: var(--soom-space-sm);
  }

  .panel-text p {
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: var(--soom-text-muted);
    line-height: 1.6;
  }

  .panel-diagram {
    width: 100%;
    max-width: 700px;
    padding: var(--soom-space-xxl);
    background: var(--soom-bg);
    border-radius: var(--soom-rounded-md);
    border: 1px solid var(--soom-edge-stroke-rest);
    background-image: radial-gradient(var(--soom-grid-dot) 1px, transparent 1px);
    background-size: 24px 24px;
  }

  .tour-panels-static {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--soom-space-xl);
    padding: var(--soom-space-xl);
    overflow-y: auto;
    flex: 1;
  }

  .panel-static {
    padding: var(--soom-space-xl);
    background: var(--soom-controls-bg);
    border-radius: var(--soom-rounded-md);
    border: 1px solid var(--soom-edge-stroke-rest);
  }

  .panel-static h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--soom-text);
    margin-bottom: var(--soom-space-xs);
  }

  .panel-static p {
    font-size: 0.9rem;
    color: var(--soom-text-muted);
    margin-bottom: var(--soom-space-md);
  }

  @media (prefers-reduced-motion: reduce) {
    .tour-track {
      transition: none;
    }

    .dot {
      transition: none;
    }
  }

  @media (max-width: 480px) {
    .panel {
      padding: 0 var(--soom-space-lg);
    }

    .panel-diagram {
      padding: var(--soom-space-lg);
    }
  }
</style>
