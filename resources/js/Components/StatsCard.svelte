<script lang="ts">
  import type { ComponentType } from 'svelte';

  interface Props {
    title: string;
    value: string | number;
    icon: ComponentType;
    iconColorClass?: string;
    iconBgClass?: string;
    trend?: string;
    trendIcon?: ComponentType;
    trendColorClass?: string;
    className?: string;
  }

  let {
    title,
    value,
    icon: Icon,
    iconColorClass = 'text-primary-500',
    iconBgClass = 'bg-primary-100 dark:bg-primary-900/30',
    trend,
    trendIcon: TrendIcon,
    trendColorClass = 'text-green-500',
    className = ''
  }: Props = $props();
</script>

<div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition duration-300 {className}">
  <div class="flex items-center justify-between mb-4">
    <div class="w-12 h-12 rounded-xl {iconBgClass} flex items-center justify-center">
      <Icon class="w-6 h-6 {iconColorClass}" />
    </div>
    {#if trend && TrendIcon}
      <div class="flex items-center gap-1 text-sm font-semibold {trendColorClass}">
        <TrendIcon class="w-4 h-4" />
        <span>{trend}</span>
      </div>
    {/if}
  </div>
  <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">{title}</p>
</div>
