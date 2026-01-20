<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import OrganizationLayout from '../../Components/Layouts/OrganizationLayout.svelte';
  import { ArrowLeft, Calendar, MapPin, Clock, Users, Edit, Settings, BarChart3 } from 'lucide-svelte';

  let { event, orgUuid } = $props();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
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
</script>

<OrganizationLayout group="events" orgId={orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 sm:gap-4">
        <a href={`/organizations/${orgUuid}/events`} use:inertia class="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </a>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{event.name}</h1>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold {getEventStatusColor(event.status)}">
              {getEventStatusText(event.status)}
            </span>
          </div>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{getEventTypeText(event.type)}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 w-full sm:w-auto">
        <a href={`/organizations/${orgUuid}/events/${event.id}/dashboard`} use:inertia class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm font-semibold min-h-[44px]">
          <BarChart3 class="w-4 h-4" />
          Dashboard
        </a>
        <a href={`/organizations/${orgUuid}/events/${event.id}/settings`} use:inertia class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm font-semibold min-h-[44px]">
          <Settings class="w-4 h-4" />
          Settings
        </a>
        <a href={`/organizations/${orgUuid}/events/${event.id}/edit`} use:inertia class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition text-sm font-semibold min-h-[44px]">
          <Edit class="w-4 h-4" />
          Edit
        </a>
      </div>
    </div>

    <!-- Event Image -->
    {#if event.image}
      <div class="w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600">
        <img src={event.image} alt={event.name} class="w-full h-full object-cover" />
      </div>
    {:else}
      <div class="w-full h-48 sm:h-64 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
        <Calendar class="w-16 h-16 sm:w-20 sm:h-20 text-white/50" />
      </div>
    {/if}

    <!-- Event Details -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-4 sm:space-y-6">
        <!-- Description -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">About This Event</h2>
          {#if event.description}
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{event.description}</p>
          {:else}
            <p class="text-gray-400 dark:text-gray-500 italic text-sm sm:text-base">No description provided</p>
          {/if}
        </div>

        <!-- Date & Time -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Date & Time</h2>
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-start gap-3">
              <Calendar class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Start</p>
                <p class="text-gray-600 dark:text-gray-400">{formatDate(event.start_date)}</p>
                <p class="text-gray-600 dark:text-gray-400">{formatTime(event.start_date)}</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <Clock class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white">End</p>
                <p class="text-gray-600 dark:text-gray-400">{formatDate(event.end_date)}</p>
                <p class="text-gray-600 dark:text-gray-400">{formatTime(event.end_date)}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h2>
          <div class="space-y-3 sm:space-y-4">
            {#if event.location}
              <div class="flex items-start gap-3">
                <MapPin class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Location</p>
                  <p class="text-gray-600 dark:text-gray-400">{event.location}</p>
                </div>
              </div>
            {/if}
            {#if event.venue}
              <div class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-xs font-bold text-primary-500">V</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Venue</p>
                  <p class="text-gray-600 dark:text-gray-400">{event.venue}</p>
                </div>
              </div>
            {/if}
            {#if event.address}
              <div class="flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-xs font-bold text-primary-500">A</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">Address</p>
                  <p class="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{event.address}</p>
                </div>
              </div>
            {/if}
            {#if !event.location && !event.venue && !event.address}
              <p class="text-gray-400 dark:text-gray-500 italic">No location information provided</p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-4 sm:space-y-6">
        <!-- Quick Stats -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Users class="w-5 h-5 text-primary-500" />
                <span class="text-sm text-gray-600 dark:text-gray-400">Capacity</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">
                {event.capacity ? event.capacity : 'Unlimited'}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span class="text-xs font-bold text-primary-500">E</span>
                </div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Entry System</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white capitalize">
                {event.entry_system}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span class="text-xs font-bold text-primary-500">R</span>
                </div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Registration</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">
                {event.registration_open ? 'Open' : 'Closed'}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span class="text-xs font-bold text-primary-500">P</span>
                </div>
                <span class="text-sm text-gray-600 dark:text-gray-400">Public</span>
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">
                {event.is_public ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <!-- Event Settings -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 sm:p-6">
          <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Settings</h2>
          <div class="space-y-2 sm:space-y-3">
            <a href={`/organizations/${orgUuid}/events/${event.id}/dashboard`} use:inertia class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
              <BarChart3 class="w-5 h-5 text-primary-500" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Dashboard</span>
            </a>
            <a href={`/organizations/${orgUuid}/events/${event.id}/settings`} use:inertia class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
              <Settings class="w-5 h-5 text-primary-500" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Settings</span>
            </a>
            <a href={`/organizations/${orgUuid}/events/${event.id}/edit`} use:inertia class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
              <Edit class="w-5 h-5 text-primary-500" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Edit Event</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</OrganizationLayout>
