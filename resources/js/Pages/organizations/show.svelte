<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import OrganizationLayout from '../../Components/Layouts/OrganizationLayout.svelte';
  import { Building2, Users, Calendar, Settings, Edit, ArrowRight, Plus } from 'lucide-svelte';

  let { organization, members, events, currentUserRole } = $props();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-600',
      manager: 'bg-blue-100 text-blue-600',
      staff: 'bg-green-100 text-green-600'
    };
    return colors[role] || 'bg-gray-100 text-gray-600';
  };

  const getRoleText = (role: string) => {
    const texts: Record<string, string> = {
      admin: 'Admin',
      manager: 'Manager',
      staff: 'Staff'
    };
    return texts[role] || role;
  };

  const getEventStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-600',
      published: 'bg-blue-100 text-blue-600',
      ongoing: 'bg-green-100 text-green-600',
      completed: 'bg-purple-100 text-purple-600',
      cancelled: 'bg-red-100 text-red-600'
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

<OrganizationLayout group="dashboard" orgId={organization.id}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {organization.name}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {organization.description || 'No description'}
        </p>
      </div>
      {#if currentUserRole === 'admin'}
        <a href={`/organizations/${organization.id}/edit`} use:inertia class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition">
          <Edit class="w-4 h-4" />
          Edit
        </a>
      {/if}
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Calendar class="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{events?.length || 0}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Events</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
            <Users class="w-6 h-6 text-secondary-500" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{members?.length || 0}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Members</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Building2 class="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{getRoleText(currentUserRole)}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Your Role</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href={`/organizations/${organization.id}/events`} use:inertia class="flex items-center gap-4 p-6 rounded-2xl bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition group">
        <div class="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
          <Calendar class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white">Manage Events</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">View and manage organization events</p>
        </div>
        <ArrowRight class="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition" />
      </a>

      <a href={`/organizations/${organization.id}/members`} use:inertia class="flex items-center gap-4 p-6 rounded-2xl bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition group">
        <div class="w-12 h-12 rounded-xl bg-secondary-500 flex items-center justify-center">
          <Users class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white">Manage Team</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Invite and manage team members</p>
        </div>
        <ArrowRight class="w-5 h-5 text-gray-400 group-hover:text-secondary-500 transition" />
      </a>
    </div>

    <!-- Recent Events -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Recent Events</h2>
        <a href={`/organizations/${organization.id}/events`} use:inertia class="text-sm font-semibold text-primary-500 hover:text-primary-600 transition">
          View All
        </a>
      </div>
      {#if events && events.length > 0}
        <div class="space-y-4">
          {#each events as event}
            <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Calendar class="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{event.name}</h3>
                  <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span>{formatDate(event.start_date)}</span>
                    <span class="px-2 py-0.5 rounded-full text-xs font-semibold {getEventStatusColor(event.status)}">
                      {getEventStatusText(event.status)}
                    </span>
                  </div>
                </div>
              </div>
              <a href={`/organizations/${organization.id}/events/${event.id}`} use:inertia class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition">
                <ArrowRight class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Events Yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Create your first event to get started</p>
          <a href={`/organizations/${organization.id}/events/create`} use:inertia class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition">
            <Plus class="w-4 h-4" />
            Create Event
          </a>
        </div>
      {/if}
    </div>

    <!-- Team Members -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Team Members</h2>
        <a href={`/organizations/${organization.id}/members`} use:inertia class="text-sm font-semibold text-primary-500 hover:text-primary-600 transition">
          Manage Team
        </a>
      </div>
      {#if members && members.length > 0}
        <div class="space-y-4">
          {#each members as member}
            <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                  <span class="text-lg font-bold text-secondary-600 dark:text-secondary-400">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 rounded-full text-xs font-semibold {getRoleColor(member.role)}">
                  {getRoleText(member.role)}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  Joined {formatDate(member.added_at)}
                </span>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Team Members Yet</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">Invite team members to collaborate</p>
        </div>
      {/if}
    </div>
  </div>
</OrganizationLayout>
