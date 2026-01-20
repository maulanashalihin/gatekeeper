<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../../Components/Layouts/EventLayout.svelte';
  import { ArrowLeft, Users, CheckCircle, Clock, Activity, RefreshCw, QrCode, UserCheck } from 'lucide-svelte';

  let { event, statistics, checkIns, orgUuid } = $props();

  let isRefreshing = $state(false);

  const refreshStats = async () => {
    isRefreshing = true;
    await router.reload({ only: ['statistics', 'checkIns'] });
    isRefreshing = false;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
</script>

<EventLayout group="checkin" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 sm:gap-4">
        <a href={`/organizations/${orgUuid}/events/${event.id}/dashboard`} use:inertia class="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </a>
        <div class="min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Check-in Statistics</h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{event.name}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 w-full sm:w-auto">
        <button
          onclick={refreshStats}
          disabled={isRefreshing}
          class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm font-semibold disabled:opacity-50 min-h-[44px]"
        >
          <RefreshCw class="w-4 h-4 {isRefreshing ? 'animate-spin' : ''}" />
          Refresh
        </button>
        <a href={`/organizations/${orgUuid}/events/${event.id}/checkin`} use:inertia class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition text-sm font-semibold min-h-[44px]">
          <QrCode class="w-4 h-4" />
          Start Check-in
        </a>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Total Attendees -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition duration-300">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Users class="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
          </div>
          <div class="flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary-500">
            <Activity class="w-3 h-3 sm:w-4 sm:h-4" />
            <span>100%</span>
          </div>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{statistics.total_attendees}</h3>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Attendees</p>
      </div>

      <!-- Checked In -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition duration-300">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-success-surface flex items-center justify-center">
            <CheckCircle class="w-5 h-5 sm:w-6 sm:h-6 text-success" />
          </div>
          <div class="flex items-center gap-1 text-xs sm:text-sm font-semibold text-success">
            <Activity class="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{statistics.check_in_rate}%</span>
          </div>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{statistics.checked_in}</h3>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Checked In</p>
      </div>

      <!-- Pending -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition duration-300">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-warning-surface flex items-center justify-center">
            <Clock class="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
          </div>
          <div class="flex items-center gap-1 text-xs sm:text-sm font-semibold text-warning">
            <Activity class="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{100 - statistics.check_in_rate}%</span>
          </div>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{statistics.pending}</h3>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Pending Check-in</p>
      </div>

      <!-- Check-in Rate -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition duration-300">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
            <UserCheck class="w-5 h-5 sm:w-6 sm:h-6 text-secondary-500" />
          </div>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{statistics.check_in_rate}%</h3>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Check-in Rate</p>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Check-in Progress</h2>
      <div class="relative h-4 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
        <div
          class="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-success rounded-full transition-all duration-500"
          style="width: {statistics.check_in_rate}%"
        ></div>
      </div>
      <div class="flex justify-between mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <span>{statistics.checked_in} checked in</span>
        <span>{statistics.total_attendees} total</span>
      </div>
    </div>

    <!-- Recent Check-ins -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Recent Check-ins</h2>
        <a href={`/organizations/${orgUuid}/events/${event.id}/checkin/history`} use:inertia class="text-primary-500 hover:text-primary-600 text-xs sm:text-sm font-semibold">
          View All
        </a>
      </div>

      {#if checkIns.length > 0}
        <div class="space-y-3">
          {#each checkIns as checkIn}
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
              <div class="w-10 h-10 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                <CheckCircle class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{checkIn.name}</p>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{checkIn.email}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{formatTime(checkIn.checked_in_at)}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{checkIn.method}</p>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-6 sm:py-8">
          <Clock class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">No check-ins yet</p>
        </div>
      {/if}
    </div>

    <!-- Event Info -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Event Information</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Start Date</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{formatDate(event.start_date)}</p>
        </div>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">End Date</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{formatDate(event.end_date)}</p>
        </div>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Location</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{event.location || 'Not specified'}</p>
        </div>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Venue</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{event.venue || 'Not specified'}</p>
        </div>
      </div>
    </div>
  </div>
</EventLayout>
