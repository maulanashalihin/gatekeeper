<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let color: string = '#6366f1';
  export let text: string | undefined = undefined;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
</script>

<div class="flex flex-col items-center justify-center gap-3">
  <div class="animate-spin {sizeClasses[size]}" style="border-top-color: {color}; border-right-color: transparent; border-bottom-color: transparent; border-left-color: {color}; border-style: solid; border-width: 2px; border-radius: 50%;"></div>
  {#if text}
    <p class="text-sm text-gray-600 dark:text-gray-400">{text}</p>
  {/if}
</div>
