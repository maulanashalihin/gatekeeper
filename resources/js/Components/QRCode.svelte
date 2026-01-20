<script lang="ts">
  import { onMount } from 'svelte';
  import QRCode from 'qrcode';

  interface Props {
    data: string;
    size?: number;
    renderScale?: number;
    margin?: number;
    className?: string;
    darkColor?: string;
    lightColor?: string;
  }

  let {
    data,
    size = 200,
    renderScale = 4, // Render at 4x resolution by default for sharp resizing
    margin = 2,
    className = '',
    darkColor = '#000000',
    lightColor = '#ffffff'
  }: Props = $props();

  let canvasRef = $state<HTMLCanvasElement>();
  let loading = $state(true);
  let error = $state(false);

  onMount(async () => {
    try {
      if (canvasRef) {
        await QRCode.toCanvas(canvasRef, data, {
          width: size * renderScale,
          margin: margin * renderScale,
          color: {
            dark: darkColor,
            light: lightColor
          },
          errorCorrectionLevel: 'H'
        });
      }
      loading = false;
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      error = true;
      loading = false;
    }
  });
</script>

<div class={className}>
  {#if error}
    <div class="flex items-center justify-center">
      <div class="text-center">
        <div class="text-3xl mb-2">❌</div>
        <p class="text-xs text-red-600 dark:text-red-400">Failed to load QR code</p>
      </div>
    </div>
  {:else}
    <canvas
      bind:this={canvasRef}
      class="w-full h-full object-contain {loading ? 'hidden' : 'block'}"
      style="width: {size}px; height: {size}px;"
    ></canvas>
    {#if loading}
      <div class="flex items-center justify-center">
        <div class="text-center">
          <div class="text-3xl mb-2">🎫</div>
          <p class="text-xs text-gray-600 dark:text-gray-400">Loading QR code...</p>
        </div>
      </div>
    {/if}
  {/if}
</div>
