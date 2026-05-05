<script lang="ts">
  import { onMount } from 'svelte';
  import AnimatedDiagram from './AnimatedDiagram.svelte';
  import { heroDiagram } from '../lib/diagrams';

  let heroEl: HTMLElement | undefined;
  let progress = $state(0);
  let reducedMotion = $state(false);

  const animating = $derived(progress > 0.55);
  const grayscale = $derived(Math.max(0, 1 - progress * 2.5));
  const labelSwap = $derived(progress > 0.4);

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      progress = 1;
      return;
    }

    function onScroll() {
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      const scrollable = heroEl.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      progress = Math.max(0, Math.min(1, -rect.top / scrollable));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<section bind:this={heroEl} class="hero">
  <div class="hero-sticky">
    <div class="hero-content">
      <div class="hero-label-wrap">
        <span class="hero-label static-label" class:faded={labelSwap}>
          Static.
        </span>
        <span class="hero-label hansoom-label" class:visible={labelSwap}>
          Hansoom.
        </span>
      </div>

      <div
        class="hero-diagram"
        style:filter={`grayscale(${grayscale})`}
        style:opacity={0.5 + progress * 0.5}
      >
        <AnimatedDiagram
          diagram={heroDiagram}
          playing={animating}
          frozen={reducedMotion}
        />
      </div>

      <p class="hero-tagline" class:visible={progress > 0.7}>
        Breathe life into your diagrams.
      </p>

      <div class="scroll-hint" class:hidden={progress > 0.1}>
        <span>Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path
            d="M8 4 L8 18 M3 14 L8 19 L13 14"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    height: 200vh;
    position: relative;
  }

  .hero-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-content {
    text-align: center;
    max-width: 800px;
    width: 100%;
    padding: 0 var(--soom-space-xxl);
  }

  .hero-label-wrap {
    position: relative;
    height: 1.2em;
    margin-bottom: var(--soom-space-xl);
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.03em;
  }

  .hero-label {
    position: absolute;
    left: 0;
    right: 0;
    transition: opacity 0.5s ease, transform 0.5s ease;
  }

  .static-label {
    color: var(--soom-text-muted);
    opacity: 1;
    transform: translateY(0);
  }

  .static-label.faded {
    opacity: 0;
    transform: translateY(-20px);
  }

  .hansoom-label {
    color: var(--soom-accent);
    opacity: 0;
    transform: translateY(20px);
  }

  .hansoom-label.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-diagram {
    transition: filter 0.1s linear, opacity 0.1s linear;
    margin: var(--soom-space-xxl) auto;
    max-width: 700px;
  }

  .hero-tagline {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: var(--soom-text-muted);
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    margin-top: var(--soom-space-xl);
  }

  .hero-tagline.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .scroll-hint {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: var(--soom-text-muted);
    font-size: 0.8rem;
    opacity: 0.6;
    transition: opacity 0.4s ease;
    animation: bounce 2s infinite ease-in-out;
  }

  .scroll-hint.hidden {
    opacity: 0;
    pointer-events: none;
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(6px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-label,
    .hero-tagline,
    .hero-diagram {
      transition: none;
    }

    .scroll-hint {
      animation: none;
    }
  }

  @media (max-width: 480px) {
    .hero-content {
      padding: 0 var(--soom-space-lg);
    }
  }
</style>
