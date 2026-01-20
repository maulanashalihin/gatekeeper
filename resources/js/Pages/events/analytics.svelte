<script lang="ts">
  import { inertia } from '@inertiajs/svelte';
  import EventLayout from '../../Components/Layouts/EventLayout.svelte';
  import { ArrowLeft, Users, CheckCircle, Clock, Calendar, TrendingUp, Activity, BarChart3, PieChart, Download, FileText, Table } from 'lucide-svelte';

  let { event, analytics, orgUuid } = $props();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 dark:bg-gray-600 text-gray-600',
      published: 'bg-blue-100 dark:bg-blue-600 text-green-500/800',
      ongoing: 'bg-green-100 dark:bg-green-600 text-amber-500/800',
      completed: 'bg-purple-100 dark:bg-purple-600 text-purple-600',
      cancelled: 'bg-red-100 dark:bg-red-600 text-red-600'
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
</script>

<EventLayout group="analytics" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 sm:gap-4">
        <a href={`/organizations/${orgUuid}/events/${event.id}/dashboard`} use:inertia class="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </a>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{event.name}</h1>
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold {getEventStatusColor(event.status)}">
              {getEventStatusText(event.status)}
            </span>
          </div>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Event Analytics</p>
        </div>
      </div>

      <!-- Export Buttons -->
      <div class="flex items-center gap-2">
        <a href={`/organizations/${orgUuid}/events/${event.id}/export/pdf`} target="_blank" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-500 font-semibold text-sm transition shadow-sm hover:shadow">
          <FileText class="w-4 h-4" />
          <span class="hidden sm:inline">Export PDF</span>
        </a>
        <a href={`/organizations/${orgUuid}/events/${event.id}/export/excel`} target="_blank" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition shadow-sm hover:shadow">
          <Table class="w-4 h-4" />
          <span class="hidden sm:inline">Export Excel</span>
        </a>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Total Registrations -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
            <Users class="w-6 h-6 text-white" />
          </div>
          <div class="flex items-center gap-1 text-sm font-semibold text-blue-500">
            <TrendingUp class="w-4 h-4" />
            <span>+{analytics.registration_growth || 0}%</span>
          </div>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{analytics.total_registrations || 0}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Total Registrations</p>
      </div>

      <!-- Check-in Rate -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-white" />
          </div>
          <div class="flex items-center gap-1 text-sm font-semibold text-green-500">
            <Activity class="w-4 h-4" />
            <span>{analytics.checkin_rate || 0}%</span>
          </div>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{analytics.total_checkins || 0}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Checked In</p>
      </div>

      <!-- Pending Check-ins -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
            <Clock class="w-6 h-6 text-white" />
          </div>
          <div class="flex items-center gap-1 text-sm font-semibold text-amber-500">
            <Activity class="w-4 h-4" />
            <span>{analytics.pending_rate || 0}%</span>
          </div>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{analytics.pending_checkins || 0}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Pending Check-in</p>
      </div>

      <!-- Average Check-in Time -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition duration-300">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
            <Calendar class="w-6 h-6 text-white" />
          </div>
          <div class="flex items-center gap-1 text-sm font-semibold text-purple-500">
            <BarChart3 class="w-4 h-4" />
            <span>Avg</span>
          </div>
        </div>
        <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{analytics.avg_checkin_time || '0 min'}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Avg Check-in Time</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Registration Trend -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Registration Trend</h2>
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp class="w-4 h-4" />
            <span>Last 7 days</span>
          </div>
        </div>
        <div class="h-64 flex items-end justify-between gap-2">
          {#each analytics.registration_trend || [] as day}
            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600" style="height: {(day.count / (analytics.max_registrations || 1)) * 100}%"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400">{day.label}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Check-in Trend -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Check-in Trend</h2>
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Activity class="w-4 h-4" />
            <span>By hour</span>
          </div>
        </div>
        <div class="h-64 flex items-end justify-between gap-2">
          {#each analytics.checkin_trend || [] as hour}
            <div class="flex-1 flex flex-col items-center gap-2">
              <div class="w-full bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-500/80" style="height: {(hour.count / (analytics.max_checkins || 1)) * 100}%"></div>
              <span class="text-xs text-gray-600 dark:text-gray-400">{hour.label}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Detailed Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Attendee Status Breakdown -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Attendee Status Breakdown</h2>
        <div class="space-y-4">
          {#each analytics.status_breakdown || [] as status}
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{status.label}</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{status.count} ({status.percentage}%)</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div class="h-2 rounded-full transition-all duration-300" style="width: {status.percentage}%; background-color: {status.color}"></div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Peak Check-in Times -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Peak Check-in Times</h2>
        <div class="space-y-3">
          {#each analytics.peak_times || [] as peak, index}
            <div class="flex items-center gap-3 p-3 rounded-lg {index === 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-slate-700/50'}">
              <div class="w-8 h-8 rounded-full {index === 0 ? 'bg-blue-500' : 'bg-gray-400'} flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-bold text-white">{index + 1}</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{peak.time}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">{peak.count} check-ins</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Check-in Activity</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-slate-700">
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Time</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Attendee</th>
              <th class="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {#each analytics.recent_activity || [] as activity}
              <tr class="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition">
                <td class="py-3 px-4 text-sm text-gray-900 dark:text-white">{activity.time}</td>
                <td class="py-3 px-4 text-sm text-gray-900 dark:text-white">{activity.name}</td>
                <td class="py-3 px-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium {activity.status === 'checked_in' ? 'bg-green-500-surface text-green-500' : 'bg-amber-500-surface text-amber-500'}">
                    {activity.status === 'checked_in' ? 'Checked In' : 'Pending'}
                  </span>
                </td>
              </tr>
            {/each}
            {#if (analytics.recent_activity || []).length === 0}
              <tr>
                <td colspan="3" class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No recent activity
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</EventLayout>
