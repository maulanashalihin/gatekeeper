<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import { Plus, Building2, Settings, Users, ArrowRight, Edit, Trash2 } from 'lucide-svelte';
  import Alert from '../../Components/Alert.svelte';
  import UserLayout from '../../Components/Layouts/UserLayout.svelte';

  let { flash, organizations } = $props();

  const deleteOrganization = (id: string) => {
    if (confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      router.delete(`/organizations/${id}`);
    }
  };
</script>

<UserLayout group="organizations">
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Organizations
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your organizations
        </p>
      </div>
      <a href="/organizations/create" use:inertia class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md">
        <Plus class="w-4 h-4" />
        Create Organization
      </a>
    </div>

    <!-- Flash Messages -->
    {#if flash?.error}
      <Alert type="error" message={flash.error} />
    {/if}

    {#if flash?.success}
      <Alert type="success" message={flash.success} />
    {/if}

    <!-- Organizations List -->
    {#if organizations && organizations.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each organizations as org}
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition duration-300">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Building2 class="w-6 h-6 text-primary-500" />
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-600">
                Admin
              </span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{org.name}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {org.description || 'No description'}
            </p>
            <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>Joined {new Date(org.added_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div class="flex items-center gap-2">
              <a href={`/organizations/${org.id}/dashboard`} use:inertia class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition">
                <span>Open</span>
                <ArrowRight class="w-4 h-4" />
              </a>
              <a href={`/organizations/${org.id}/edit`} use:inertia class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <Edit class="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </a>
              {#if org.role === 'admin'}
                <button onclick={() => deleteOrganization(org.id)} class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                  <Trash2 class="w-4 h-4 text-red-500" />
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Empty State -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-gray-200 dark:border-slate-700 text-center">
        <div class="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 class="w-10 h-10 text-primary-500" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Organizations Yet</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Create your first organization to get started with GateKeeper</p>
        <a href="/organizations/create" use:inertia class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md">
          <Plus class="w-4 h-4" />
          Create Organization
        </a>
      </div>
    {/if}
  </div>
</UserLayout>
