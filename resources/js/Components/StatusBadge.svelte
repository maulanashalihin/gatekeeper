<script lang="ts">
  import type { ComponentType } from 'svelte';
  import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-svelte';

  type StatusType = 'registered' | 'checked_in' | 'cancelled' | 'no_show' | 'draft' | 'published' | 'ongoing' | 'completed';

  interface Props {
    status: StatusType | string;
    showIcon?: boolean;
    className?: string;
  }

  let {
    status,
    showIcon = true,
    className = ''
  }: Props = $props();

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; text: string; icon: ComponentType }> = {
      registered: {
        color: 'bg-blue-100 text-blue-600',
        text: 'Registered',
        icon: Clock
      },
      checked_in: {
        color: 'bg-green-100 text-green-600',
        text: 'Checked In',
        icon: CheckCircle
      },
      cancelled: {
        color: 'bg-red-100 text-red-600',
        text: 'Cancelled',
        icon: XCircle
      },
      no_show: {
        color: 'bg-gray-100 text-gray-600',
        text: 'No Show',
        icon: Clock
      },
      draft: {
        color: 'bg-gray-100 text-gray-600',
        text: 'Draft',
        icon: Clock
      },
      published: {
        color: 'bg-blue-100 text-blue-600',
        text: 'Published',
        icon: CheckCircle
      },
      ongoing: {
        color: 'bg-green-100 text-green-600',
        text: 'Ongoing',
        icon: CheckCircle
      },
      completed: {
        color: 'bg-purple-100 text-purple-600',
        text: 'Completed',
        icon: CheckCircle
      }
    };

    return configs[status] || {
      color: 'bg-gray-100 text-gray-600',
      text: status.charAt(0).toUpperCase() + status.slice(1),
      icon: AlertCircle
    };
  };

  const config = $derived(getStatusConfig(status));
  const Icon = $derived(config.icon);
</script>

<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold {config.color} {className}">
  {#if showIcon}
    <Icon class="w-3 h-3" />
  {/if}
  {config.text}
</span>
