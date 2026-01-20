<script lang="ts">
  import SuperAdminLayout from '../../Components/Layouts/SuperAdminLayout.svelte';
  import { Building2, Users, Calendar, Ticket, TrendingUp, ArrowRight } from 'lucide-svelte';
  import { inertia } from '@inertiajs/svelte';
  let { stats, recentOrganizations, recentEvents } = $props();
</script>

<SuperAdminLayout group="dashboard">
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
            <Building2 class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <span class="text-xs font-medium text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30 px-2 py-1 rounded-full">
            <TrendingUp class="w-3 h-3 inline mr-1" />
            +12%
          </span>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalOrganizations?.count || 0}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Organizations</p>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <Users class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span class="text-xs font-medium text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30 px-2 py-1 rounded-full">
            <TrendingUp class="w-3 h-3 inline mr-1" />
            +8%
          </span>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalUsers?.count || 0}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Users</p>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <Calendar class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <span class="text-xs font-medium text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30 px-2 py-1 rounded-full">
            <TrendingUp class="w-3 h-3 inline mr-1" />
            +15%
          </span>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalEvents?.count || 0}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Events</p>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
            <Ticket class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <span class="text-xs font-medium text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30 px-2 py-1 rounded-full">
            <TrendingUp class="w-3 h-3 inline mr-1" />
            +20%
          </span>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalAttendees?.count || 0}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Attendees</p>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Organizations -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Recent Organizations</h2>
          <a href="/admin/organizations" use:inertia class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1">
            View All
            <ArrowRight class="w-4 h-4" />
          </a>
        </div>
        <div class="space-y-4">
          {#if recentOrganizations && recentOrganizations.length > 0}
            {#each recentOrganizations as org}
              <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-slate-900 dark:text-white truncate">{org.name}</h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400 truncate">{org.slug}</p>
                </div>
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(org.created_at).toLocaleDateString()}
                </span>
              </div>
            {/each}
          {:else}
            <div class="text-center py-8 text-slate-500 dark:text-slate-400">
              No organizations yet
            </div>
          {/if}
        </div>
      </div>

      <!-- Recent Events -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Recent Events</h2>
          <a href="/admin/organizations" use:inertia class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1">
            View All
            <ArrowRight class="w-4 h-4" />
          </a>
        </div>
        <div class="space-y-4">
          {#if recentEvents && recentEvents.length > 0}
            {#each recentEvents as event}
              <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-slate-900 dark:text-white truncate">{event.name}</h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400 truncate">{event.organization_name}</p>
                </div>
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(event.created_at).toLocaleDateString()}
                </span>
              </div>
            {/each}
          {:else}
            <div class="text-center py-8 text-slate-500 dark:text-slate-400">
              No events yet
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</SuperAdminLayout>
