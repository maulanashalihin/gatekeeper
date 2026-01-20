<script lang="ts">
  import { router, inertia, usePage } from '@inertiajs/svelte';
  import OrganizationLayout from '../../Components/Layouts/OrganizationLayout.svelte';
  import Alert from '../../Components/Alert.svelte';
  import { Calendar, MapPin, Clock, Plus, Edit, Trash2, ArrowRight, Users, Settings, BarChart3 } from 'lucide-svelte';

  let { events, orgUuid, flash } = $props();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-600',
      published: 'bg-blue-100 text-blue-600',
      ongoing: 'bg-green-100 text-green-600',
      completed: 'bg-purple-100 text-purple-600',
      cancelled: 'bg-red-100 text-red-600'
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const getEventStatusText = (status: string) => {
    const texts: Record<string, string> = {
      draft: 'Draft',
      published: 'Published',
      ongoing: 'Ongoing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return texts[status] || status;
  };

  const getEventTypeText = (type: string) => {
    const texts: Record<string, string> = {
      conference: 'Conference',
      workshop: 'Workshop',
      concert: 'Concert',
      seminar: 'Seminar',
      webinar: 'Webinar',
      meetup: 'Meetup',
      exhibition: 'Exhibition',
      sports: 'Sports'
    };
    return texts[type] || type;
  };

  const deleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      router.delete(`/organizations/${orgUuid}/events/${id}`);
    }
  };
</script>

<OrganizationLayout group="events" orgId={orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Manage your organization events</p>
      </div>
      <a href={`/organizations/${orgUuid}/events/create`} use:inertia class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md min-h-[44px]">
        <Plus class="w-4 h-4" />
        Create Event
      </a>
    </div>

    <!-- Flash Messages -->
    {#if flash?.error}
      <Alert type="error" message={flash.error} />
    {/if}

    {#if flash?.success}
      <Alert type="success" message={flash.success} />
    {/if}

    <!-- Events List -->
    {#if events && events.length > 0}
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div class="grid grid-cols-1 gap-3 sm:gap-4 p-4 sm:p-6">
          {#each events as event}
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition group">
              <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Calendar class="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{event.name}</h3>
                  <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <div class="flex items-center gap-1">
                      <Clock class="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    {#if event.location}
                      <div class="flex items-center gap-1">
                        <MapPin class="w-3 h-3 sm:w-4 sm:h-4" />
                        <span class="truncate">{event.location}</span>
                      </div>
                    {/if}
                    <span class="px-2 py-0.5 rounded-lg bg-gray-200 dark:bg-slate-600 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {getEventTypeText(event.type)}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap {getEventStatusColor(event.status)}">
                  {getEventStatusText(event.status)}
                </span>
                <div class="flex gap-1">
                  <a href={`/organizations/${orgUuid}/events/${event.id}/dashboard`} use:inertia class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition" title="Dashboard">
                    <BarChart3 class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </a>
                  <a href={`/organizations/${orgUuid}/events/${event.id}/settings`} use:inertia class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition" title="Settings">
                    <Settings class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </a>
                  <a href={`/organizations/${orgUuid}/events/${event.id}/edit`} use:inertia class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition" title="Edit">
                    <Edit class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </a>
                  <button onclick={() => deleteEvent(event.id)} class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition" title="Delete">
                    <Trash2 class="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Empty State -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-12 border border-gray-200 dark:border-slate-700 text-center">
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Calendar class="w-8 h-8 sm:w-10 sm:h-10 text-primary-500" />
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">No Events Yet</h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">Create your first event to get started with GateKeeper</p>
        <a href={`/organizations/${orgUuid}/events/create`} use:inertia class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md min-h-[44px]">
          <Plus class="w-4 h-4" />
          Create Event
        </a>
      </div>
    {/if}
  </div>
</OrganizationLayout>
