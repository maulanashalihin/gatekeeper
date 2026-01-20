<script lang="ts">
  type AlertType = 'success' | 'error' | 'warning' | 'info';

  interface Props {
    type: AlertType;
    title?: string;
    message: string;
    className?: string;
  }

  let {
    type,
    title,
    message,
    className = ''
  }: Props = $props();

  const getAlertConfig = (type: AlertType) => {
    const configs: Record<AlertType, { bgClass: string; borderClass: string; iconBgClass: string; iconColorClass: string; iconText: string; title: string }> = {
      success: {
        bgClass: 'bg-green-50 dark:bg-green-950',
        borderClass: 'border-green-500/10 dark:border-transparent',
        iconBgClass: 'bg-green-500',
        iconColorClass: 'text-white',
        iconText: '✓',
        title: 'Success'
      },
      error: {
        bgClass: 'bg-red-50 dark:bg-red-950',
        borderClass: 'border-red-500/10 dark:border-transparent',
        iconBgClass: 'bg-red-500',
        iconColorClass: 'text-white',
        iconText: '!',
        title: 'Error'
      },
      warning: {
        bgClass: 'bg-yellow-50 dark:bg-yellow-950',
        borderClass: 'border-yellow-500/10 dark:border-transparent',
        iconBgClass: 'bg-yellow-500',
        iconColorClass: 'text-white',
        iconText: '⚠',
        title: 'Warning'
      },
      info: {
        bgClass: 'bg-blue-50 dark:bg-blue-950',
        borderClass: 'border-blue-500/10 dark:border-transparent',
        iconBgClass: 'bg-blue-500',
        iconColorClass: 'text-white',
        iconText: 'i',
        title: 'Info'
      }
    };

    return configs[type];
  };

  const config = $derived(getAlertConfig(type));
  const displayTitle = $derived(title || config.title);

  const titleColorClass = $derived(
    type === 'success' ? 'text-green-700 dark:text-green-400' :
    type === 'error' ? 'text-red-700 dark:text-red-400' :
    type === 'warning' ? 'text-yellow-700 dark:text-yellow-400' :
    'text-blue-700 dark:text-blue-400'
  );

  const messageColorClass = $derived(
    type === 'success' ? 'text-green-600 dark:text-green-400' :
    type === 'error' ? 'text-red-600 dark:text-red-400' :
    type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
    'text-blue-600 dark:text-blue-400'
  );
</script> 
<div class="flex items-start gap-4 p-4 rounded-xl {config.bgClass} border {config.borderClass} {className}">
  <div class="w-5 h-5 rounded-full {config.iconBgClass} flex items-center justify-center flex-shrink-0 mt-0.5">
    <span class="{config.iconColorClass} text-xs font-bold">{config.iconText}</span>
  </div> 
  <div>
    <h4 class="text-sm font-bold {titleColorClass}">{displayTitle}</h4>
    <p class="text-sm {messageColorClass} mt-1">{message}</p>
  </div>
</div>
