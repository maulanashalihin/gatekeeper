<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import OrganizationLayout from '../../Components/Layouts/OrganizationLayout.svelte';
  import { UserPlus, Mail, User, ArrowLeft, CheckCircle, Info } from 'lucide-svelte';

  let { organization, flash, currentUserRole } = $props();

  let formData = $state({
    email: '',
    name: '',
    role: 'staff'
  });
  let isLoading = $state(false);
  let showNameField = $state(false);

  const roles = [
    { value: 'staff', label: 'Staff' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' }
  ];

  const handleEmailBlur = () => {
    // Show name field if email is entered
    if (formData.email) {
      showNameField = true;
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    isLoading = true;

    // Always use invite-new endpoint - it will handle both cases
    router.post(`/organizations/${organization.id}/members/invite-new`, {
      email: formData.email,
      name: formData.name || formData.email.split('@')[0], // Use email prefix as default name if not provided
      role: formData.role
    });
  };
</script>

<OrganizationLayout group="team" orgId={organization.id}>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <a href={`/organizations/${organization.id}/members`} use:inertia class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition">
        <ArrowLeft class="w-4 h-4" />
        Back to Members
      </a>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Invite Team Member</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Add a new member to {organization.name}
      </p>
    </div>

    <!-- Flash Messages -->
    {#if flash?.error}
      <div class="flex items-start gap-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <div class="p-1 rounded-full bg-red-100 dark:bg-red-900/30">
          <CheckCircle class="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-red-800 dark:text-red-400">Error</h4>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">{flash.error}</p>
        </div>
      </div>
    {/if}

    {#if flash?.success}
      <div class="flex items-start gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <div class="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle class="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-green-800 dark:text-green-400">Success</h4>
          <p class="text-sm text-green-700 dark:text-green-300 mt-1">{flash.success}</p>
        </div>
      </div>
    {/if}

    <!-- Info Box -->
    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
      <div class="flex items-start gap-3">
        <Info class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div class="text-sm text-blue-800 dark:text-blue-300">
          <p class="font-semibold mb-1">How it works</p>
          <p>Just enter the email address. The system will automatically check if the user already exists and handle accordingly:</p>
          <ul class="mt-2 space-y-1 ml-4 list-disc">
            <li>If the user exists → They'll be added to your organization</li>
            <li>If the user doesn't exist → A new account will be created</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Invite Form -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-slate-700">
      <form onsubmit={handleSubmit}>
        <div class="mb-4">
          <label for="email" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div class="relative">
            <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              bind:value={formData.email}
              onblur={handleEmailBlur}
              class="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        <div class="mb-6">
          <label for="name" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Full Name <span class="font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
          </label>
          <div class="relative">
            <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              class="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="Enter full name (optional)"
            />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Only needed if creating a new account. If the user already exists, their existing name will be used.
          </p>
        </div>

        <div class="mb-8">
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            {#each roles as roleOption}
              <button
                type="button"
                onclick={() => formData.role = roleOption.value}
                class="p-4 rounded-xl border-2 text-left transition {formData.role === roleOption.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}"
              >
                <div class="font-semibold text-gray-900 dark:text-white">{roleOption.label}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {#if roleOption.value === 'admin'}Full access to all settings
                  {:else if roleOption.value === 'manager'}Can manage events and members
                  {:else}Can view and manage events
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        </div>

        <div class="flex gap-3">
          <a
            href={`/organizations/${organization.id}/members`}
            use:inertia
            class="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-700 font-semibold text-sm text-gray-700 dark:text-gray-300 text-center hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={isLoading}
            class="flex-1 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {#if isLoading}
              <span class="animate-spin">⏳</span>
              Sending...
            {:else}
              <UserPlus class="w-4 h-4" />
              Send Invite
            {/if}
          </button>
        </div>
      </form>
    </div>

    <!-- Role Legend -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Roles & Permissions</h3>
      <div class="space-y-4">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
            <span class="text-purple-600 dark:text-purple-400 font-bold text-sm">A</span>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white">Admin</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Full access to all organization settings, members, and events</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <span class="text-blue-600 dark:text-blue-400 font-bold text-sm">M</span>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white">Manager</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Can manage events and invite members, but cannot delete organization</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <span class="text-green-600 dark:text-green-400 font-bold text-sm">S</span>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white">Staff</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Can view and manage events, but limited access to settings</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</OrganizationLayout>
