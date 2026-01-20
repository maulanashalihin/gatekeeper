<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import OrganizationLayout from '../../Components/Layouts/OrganizationLayout.svelte';
  import { Building2, ArrowLeft, Save } from 'lucide-svelte';

  let { flash, organization } = $props();
  let isEdit = !!organization;
  
  let formData = $state({
    name: organization?.name ?? '',
    slug: organization?.slug ?? '',
    description: organization?.description ?? '',
    logo: organization?.logo ?? ''
  });

  const generateSlug = () => {
    formData.slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (isEdit && organization) {
      router.put(`/organizations/${organization.id}`, formData);
    } else {
      router.post('/organizations', formData);
    }
  };

  const handleImageError = (e: Event) => {
    const target = e.currentTarget as HTMLImageElement;
    target.style.display = 'none';
  };
</script>

<OrganizationLayout group="organizations" orgId={organization?.id}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <a href="/organizations" use:inertia class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
        <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </a>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Organization' : 'Create Organization'}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {isEdit ? 'Update organization details' : 'Create a new organization'}
        </p>
      </div>
    </div>

    <!-- Flash Messages -->
    {#if flash?.error}
      <div class="flex items-start gap-4 p-4 rounded-xl bg-error-surface border border-error/20">
        <div class="w-5 h-5 rounded-full bg-error flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-white text-xs font-bold">!</span>
        </div>
        <div>
          <h4 class="text-sm font-bold text-error">Error</h4>
          <p class="text-sm text-error/80 mt-1">{flash.error}</p>
        </div>
      </div>
    {/if}

    <!-- Form -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-slate-700">
      <form onsubmit={handleSubmit}>
        <div class="space-y-6">
          <!-- Name -->
          <div>
            <label for="org-name" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Organization Name *
            </label>
            <input
              id="org-name"
              type="text"
              bind:value={formData.name}
              onblur={generateSlug}
              class="w-full px-4 py-3 rounded-xl bg-slate-900/5 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="Enter organization name"
              required
            />
          </div>

          <!-- Slug -->
          <div>
            <label for="org-slug" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Slug *
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                /
              </span>
              <input
                id="org-slug"
                type="text"
                bind:value={formData.slug}
                class="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-900/5 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                placeholder="organization-slug"
                required
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              URL-friendly identifier (auto-generated from name)
            </p>
          </div>

          <!-- Description -->
          <div>
            <label for="org-description" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="org-description"
              bind:value={formData.description}
              rows="4"
              class="w-full px-4 py-3 rounded-xl bg-slate-900/5 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
              placeholder="Enter organization description"
            ></textarea>
          </div>

          <!-- Logo URL -->
          <div>
            <label for="org-logo" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Logo URL
            </label>
            <input
              id="org-logo"
              type="url"
              bind:value={formData.logo}
              class="w-full px-4 py-3 rounded-xl bg-slate-900/5 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="https://example.com/logo.png"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              URL to organization logo image
            </p>
          </div>

          <!-- Preview -->
          {#if formData.logo}
            <div>
              <label for="org-logo-preview" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Logo Preview
              </label>
              <div class="w-20 h-20 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                <img id="org-logo-preview" src={formData.logo} alt="Logo preview" class="w-full h-full object-contain" onerror={handleImageError} />
              </div>
            </div>
          {/if}

          <!-- Actions -->
          <div class="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <a href="/organizations" use:inertia class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition">
              Cancel
            </a>
            <button type="submit" class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md">
              <Save class="w-4 h-4" />
              {isEdit ? 'Update Organization' : 'Create Organization'}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</OrganizationLayout>
