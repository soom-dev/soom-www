<script lang="ts">
  import { onMount } from 'svelte';

  let dark = $state(true);

  onMount(() => {
    dark = document.documentElement.getAttribute('data-theme') !== 'light';
  });

  function toggle() {
    dark = !dark;
    const theme = dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('soom-theme', theme);
  }
</script>

<button
  onclick={toggle}
  aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
  type="button"
>
  {dark ? '☀️' : '🌙'}
</button>

<style>
  button {
    position: fixed;
    top: 12px;
    right: 16px;
    z-index: 30;
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    background: rgba(128, 128, 128, 0.3);
    border: none;
    color: var(--soom-text);
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    line-height: 1;
  }

  button:hover {
    background: rgba(128, 128, 128, 0.5);
  }

  button:focus-visible {
    outline: 2px solid var(--soom-accent);
    outline-offset: 2px;
  }
</style>
