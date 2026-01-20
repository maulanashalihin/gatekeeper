<script lang="ts">
  import SuperAdminLayout from '../../Components/Layouts/SuperAdminLayout.svelte';
  import { BarChart3, TrendingUp, Users, Calendar, CheckCircle } from 'lucide-svelte';
  let { monthlyStats, eventTypeStats, attendeeStats } = $props();
</script>

<SuperAdminLayout group="analytics">
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
      <p class="text-slate-600 dark:text-slate-400 mt-1">Platform-wide analytics and insights</p>
    </div>

    <!-- Monthly Growth -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
          <TrendingUp class="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Monthly Organization Growth</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400">New organizations created per month</p>
        </div>
      </div>

      {#if monthlyStats && monthlyStats.length > 0}
        <div class="space-y-3">
          {#each monthlyStats as stat}
            <div class="flex items-center gap-4">
              <span class="w-24 text-sm text-slate-600 dark:text-slate-400">{stat.month}</span>
              <div class="flex-1 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                <div 
                  class="h-full bg-primary-500 rounded-lg transition-all duration-300"
                  style="width: {(stat.count / Math.max(...monthlyStats.map(s => s.count))) * 100}%;"
                ></div>
              </div>
              <span class="w-12 text-right text-sm font-medium text-slate-900 dark:text-white">{stat.count}</span>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8 text-slate-500 dark:text-slate-400">
          No data available yet
        </div>
      {/if}
    </div>

    <!-- Event Types Distribution -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
          <Calendar class="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Event Types Distribution</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400">Breakdown by event type</p>
        </div>
      </div>

      {#if eventTypeStats && eventTypeStats.length > 0}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each eventTypeStats as stat}
            <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div class="text-2xl font-bold text-slate-900 dark:text-white">{stat.count}</div>
              <div class="text-sm text-slate-600 dark:text-slate-400 capitalize mt-1">{stat.type}</div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8 text-slate-500 dark:text-slate-400">
          No data available yet
        </div>
      {/if}
    </div>

    <!-- Attendee Status -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-xl flex items-center justify-center">
          <CheckCircle class="w-5 h-5 text-success-600 dark:text-success-400" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Attendee Status</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400">Current attendee status breakdown</p>
        </div>
      </div>

      {#if attendeeStats && attendeeStats.length > 0}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each attendeeStats as stat}
            <div class="p-4 rounded-xl {stat.status === 'registered' ? 'bg-blue-50 dark:bg-blue-900/20' : stat.status === 'checked_in' ? 'bg-success-50 dark:bg-success-900/20' : stat.status === 'cancelled' ? 'bg-error-50 dark:bg-error-900/20' : 'bg-slate-50 dark:bg-slate-800/50'}">
              <div class="text-2xl font-bold text-slate-900 dark:text-white">{stat.count}</div>
              <div class="text-sm text-slate-600 dark:text-slate-400 capitalize mt-1">{stat.status.replace('_', ' ')}</div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8 text-slate-500 dark:text-slate-400">
          No data available yet
        </div>
      {/if}
    </div>
  </div>
</SuperAdminLayout>
