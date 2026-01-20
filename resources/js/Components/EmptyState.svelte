<script lang="ts">
  import { inertia } from '@inertiajs/svelte';

  export let icon: any;
  export let title: string;
  export let description: string;
  export let actionText: string | undefined = undefined;
  export let actionUrl: string | undefined = undefined;
  export let iconColor: string = 'text-gray-400';
  export let iconBgColor: string = 'bg-gray-100 dark:bg-gray-700';
</script>

<div class="flex flex-col items-center justify-center py-12 px-4 text-center">
  <div class="w-20 h-20 rounded-full {iconBgColor} flex items-center justify-center mb-6">
    <svelte:component this={icon} class="w-10 h-10 {iconColor}" />
  </div>
  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
  <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md">{description}</p>
  {#if actionText && actionUrl}
    <a href={actionUrl} use:inertia class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition shadow-sm hover:shadow">
      {actionText}
    </a>
  {/if}
</div>
