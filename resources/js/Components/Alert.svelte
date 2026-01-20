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
        bgClass: 'bg-success-50 dark:bg-success-950',
        borderClass: 'border-success/10 dark:border-transparent',
        iconBgClass: 'bg-success-500',
        iconColorClass: 'text-white',
        iconText: '✓',
        title: 'Success'
      },
      error: {
        bgClass: 'bg-error-50 dark:bg-error-950',
        borderClass: 'border-error/10 dark:border-transparent',
        iconBgClass: 'bg-error-500',
        iconColorClass: 'text-white',
        iconText: '!',
        title: 'Error'
      },
      warning: {
        bgClass: 'bg-warning-50 dark:bg-warning-950',
        borderClass: 'border-warning/10 dark:border-transparent',
        iconBgClass: 'bg-warning-500',
        iconColorClass: 'text-white',
        iconText: '⚠',
        title: 'Warning'
      },
      info: {
        bgClass: 'bg-info-50 dark:bg-info-950',
        borderClass: 'border-info/10 dark:border-transparent',
        iconBgClass: 'bg-info-500',
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
    type === 'success' ? 'text-success-700 dark:text-success-400' :
    type === 'error' ? 'text-error-700 dark:text-error-400' :
    type === 'warning' ? 'text-warning-700 dark:text-warning-400' :
    'text-info-700 dark:text-info-400'
  );

  const messageColorClass = $derived(
    type === 'success' ? 'text-success-600 dark:text-success-400' :
    type === 'error' ? 'text-error-600 dark:text-error-400' :
    type === 'warning' ? 'text-warning-600 dark:text-warning-400' :
    'text-info-600 dark:text-info-400'
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
