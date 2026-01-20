<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../Components/Layouts/EventLayout.svelte';
  import { ArrowLeft, Users, CheckCircle, Clock, Settings, UserPlus, QrCode, Activity } from 'lucide-svelte';
  import StatsCard from '../../Components/StatsCard.svelte';
  import StatusBadge from '../../Components/StatusBadge.svelte';

  let { event, statistics, orgUuid } = $props();
</script>

<EventLayout group="overview" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 sm:gap-4">
        <a href={`/organizations/${orgUuid}/events`} use:inertia class="p-2.5 rounded-lg hover:text-indigo-500 dark:hover:bg-slate-700 transition">
          <ArrowLeft class="w-5 h-5 text-indigo-500 dark:text-gray-400" />
        </a>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{event.name}</h1>
            <StatusBadge status={event.status} />
          </div>
          <p class="text-sm sm:text-base text-indigo-500 dark:text-gray-400 mt-1">Event Dashboard</p>
        </div>
      </div>
      <div class="w-full sm:w-auto">
        <a href={`/organizations/${orgUuid}/events/${event.id}/settings`} use:inertia class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm font-semibold">
          <Settings class="w-4 h-4" />
          Settings
        </a>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total Attendees"
        value={statistics.total_attendees}
        icon={Users}
        iconColorClass="text-white"
        iconBgClass="bg-blue-500"
        trend="100%"
        trendIcon={Activity}
        trendColorClass="text-blue-500"
      />

      <StatsCard
        title="Checked In"
        value={statistics.checked_in}
        icon={CheckCircle}
        iconColorClass="text-white"
        iconBgClass="bg-green-500"
        trend={statistics.total_attendees > 0 ? Math.round((statistics.checked_in / statistics.total_attendees) * 100) + '%' : '0%'}
        trendIcon={Activity}
        trendColorClass="text-green-500"
      />

      <StatsCard
        title="Pending Check-in"
        value={statistics.pending}
        icon={Clock}
        iconColorClass="text-white"
        iconBgClass="bg-amber-500"
        trend={statistics.total_attendees > 0 ? Math.round((statistics.pending / statistics.total_attendees) * 100) + '%' : '0%'}
        trendIcon={Activity}
        trendColorClass="text-amber-500"
      />
    </div>

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <a href={`/organizations/${orgUuid}/events/${event.id}/attendees`} use:inertia class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition group">
          <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Users class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">Manage Attendees</h3>
            <p class="text-xs sm:text-sm text-indigo-500 dark:text-gray-400 truncate">View and manage attendees</p>
          </div>
        </a>

        <a href={`/organizations/${orgUuid}/events/${event.id}/checkin`} use:inertia class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition group">
          <div class="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <QrCode class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">Start Check-in</h3>
            <p class="text-xs sm:text-sm text-indigo-500 dark:text-gray-400 truncate">Scan QR codes to check in</p>
          </div>
        </a>

        <a href={`/organizations/${orgUuid}/events/${event.id}/members`} use:inertia class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition group">
          <div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
            <UserPlus class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">Event Team</h3>
            <p class="text-xs sm:text-sm text-indigo-500 dark:text-gray-400 truncate">Manage event members</p>
          </div>
        </a>
      </div>
    </div>

    <!-- Event Info -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Event Information</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p class="text-xs sm:text-sm font-semibold text-indigo-500 dark:text-gray-400 mb-1">Start Date</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-indigo-500 dark:text-gray-400 mb-1">End Date</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{new Date(event.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-indigo-500 dark:text-gray-400 mb-1">Location</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{event.location || 'Not specified'}</p>
        </div>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-indigo-500 dark:text-gray-400 mb-1">Venue</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{event.venue || 'Not specified'}</p>
        </div>
      </div>
    </div>
  </div>
</EventLayout>
