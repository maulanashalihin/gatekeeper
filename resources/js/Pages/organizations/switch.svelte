<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import { Building2, ArrowRight, Check } from 'lucide-svelte';

  let { flash, organizations, currentOrganizationId } = $props();

  const switchOrganization = (organizationId: string) => {
    router.post('/organizations/switch', { organization_id: organizationId });
  };
</script>

<div class="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
  <div class="w-full max-w-2xl">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Building2 class="w-8 h-8 text-primary-500" />
      </div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Switch Organization</h1>
      <p class="text-gray-600 dark:text-gray-400">Select an organization to continue</p>
    </div>

    <!-- Flash Messages -->
    {#if flash?.error}
      <div class="flex items-start gap-4 p-4 rounded-xl bg-error-surface border border-error/20 mb-6">
        <div class="w-5 h-5 rounded-full bg-error flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-white text-xs font-bold">!</span>
        </div>
        <div>
          <h4 class="text-sm font-bold text-error">Error</h4>
          <p class="text-sm text-error/80 mt-1">{flash.error}</p>
        </div>
      </div>
    {/if}

    <!-- Organizations List -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      {#if organizations && organizations.length > 0}
        <div class="divide-y divide-gray-200 dark:divide-slate-700">
          {#each organizations as org}
            <button
              onclick={() => switchOrganization(org.id)}
              class="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition text-left"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Building2 class="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{org.name}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {org.description || 'No description'}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                {#if org.id === currentOrganizationId}
                  <span class="px-3 py-1 rounded-full bg-success-surface text-success text-xs font-semibold">
                    Current
                  </span>
                {/if}
                <ArrowRight class="w-5 h-5 text-gray-400" />
              </div>
            </button>
          {/each}
        </div>
      {:else}
        <div class="p-12 text-center">
          <div class="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Organizations</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">You don't have access to any organizations yet</p>
          <a href="/organizations/create" use:inertia class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md">
            <Building2 class="w-4 h-4" />
            Create Organization
          </a>
        </div>
      {/if}
    </div>

    <!-- Footer -->
    <div class="mt-6 text-center">
      <a href="/organizations" use:inertia class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
        Back to Organizations
      </a>
    </div>
  </div>
</div>
