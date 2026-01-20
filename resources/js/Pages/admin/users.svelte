<script lang="ts">
  import SuperAdminLayout from '../../Components/Layouts/SuperAdminLayout.svelte';
  import { User, Mail, Search, Shield, MoreVertical } from 'lucide-svelte';
  import { inertia } from '@inertiajs/svelte';
  let { users } = $props();

  let searchQuery = $state('');
</script>

<SuperAdminLayout group="users">
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
        <p class="text-slate-600 dark:text-slate-400 mt-1">Manage all users on the platform</p>
      </div>
    </div>

    <!-- Search -->
    <div class="relative">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search users by name or email..."
        class="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
      />
    </div>

    <!-- Users List -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      {#if users && users.length > 0}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">User</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Organizations</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Role</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
              {#each users.filter(user => 
                searchQuery === '' || 
                (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
              ) as user}
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <User class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div class="font-medium text-slate-900 dark:text-white">{user.name || 'Unknown'}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Mail class="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-slate-900 dark:text-white font-medium">{user.org_count || 0}</span>
                  </td>
                  <td class="px-6 py-4">
                    {#if user.is_admin}
                      <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                        <Shield class="w-3 h-3" />
                        Super Admin
                      </span>
                    {:else}
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        User
                      </span>
                    {/if}
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-slate-600 dark:text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="text-center py-12">
          <User class="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">No users yet</h3>
          <p class="text-slate-600 dark:text-slate-400">Users will appear here once they register.</p>
        </div>
      {/if}
    </div>
  </div>
</SuperAdminLayout>
