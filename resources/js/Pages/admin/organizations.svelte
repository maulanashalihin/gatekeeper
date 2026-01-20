<script lang="ts">
  import SuperAdminLayout from '../../Components/Layouts/SuperAdminLayout.svelte';
  import { Building2, Calendar, Search, Eye, MoreVertical } from 'lucide-svelte';
  import { inertia } from '@inertiajs/svelte';
  let { organizations } = $props();

  let searchQuery = $state('');
</script>

<SuperAdminLayout group="organizations">
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Organizations</h1>
        <p class="text-slate-600 dark:text-slate-400 mt-1">Manage all organizations on the platform</p>
      </div>
    </div>

    <!-- Search -->
    <div class="relative">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search organizations..."
        class="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
      />
    </div>

    <!-- Organizations List -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      {#if organizations && organizations.length > 0}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Organization</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Events</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Created</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
              {#each organizations.filter(org => 
                searchQuery === '' || 
                org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                org.slug.toLowerCase().includes(searchQuery.toLowerCase())
              ) as org}
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <div class="font-medium text-slate-900 dark:text-white">{org.name}</div>
                        <div class="text-sm text-slate-600 dark:text-slate-400">{org.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-slate-900 dark:text-white font-medium">{org.event_count || 0}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Calendar class="w-4 h-4" />
                      <span>{new Date(org.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    {#if org.onboarding_completed}
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400">
                        Active
                      </span>
                    {:else}
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400">
                        Setup
                      </span>
                    {/if}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <a
                      href={`/organizations/${org.id}/dashboard`}
                      use:inertia
                      class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      <Eye class="w-4 h-4" />
                      View
                    </a>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="text-center py-12">
          <Building2 class="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">No organizations yet</h3>
          <p class="text-slate-600 dark:text-slate-400">Organizations will appear here once users create them.</p>
        </div>
      {/if}
    </div>
  </div>
</SuperAdminLayout>
