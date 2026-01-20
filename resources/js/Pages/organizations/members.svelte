<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import OrganizationLayout from '../../Components/Layouts/OrganizationLayout.svelte';
  import { Users, UserPlus, Mail, MoreVertical, Shield, Trash2, Crown } from 'lucide-svelte';

  let { organization, members, currentUserRole } = $props();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      manager: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      staff: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    };
    return colors[role] || 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getRoleText = (role: string) => {
    const texts: Record<string, string> = {
      admin: 'Admin',
      manager: 'Manager',
      staff: 'Staff'
    };
    return texts[role] || role;
  };

  const removeMember = (memberId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the organization?`)) {
      router.delete(`/organizations/${organization.id}/members/${memberId}`);
    }
  };
</script>

<OrganizationLayout group="team" orgId={organization.id}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage your organization team
        </p>
      </div>
      {#if currentUserRole === 'admin' || currentUserRole === 'manager'}
        <a href={`/organizations/${organization.id}/members/invite`} use:inertia class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition">
          <UserPlus class="w-4 h-4" />
          Invite Member
        </a>
      {/if}
    </div>

    <!-- Members List -->
    {#if members && members.length > 0}
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div class="divide-y divide-gray-200 dark:divide-slate-700">
          {#each members as member}
            <div class="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                  <span class="text-lg font-bold text-secondary-600 dark:text-secondary-400">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white truncate">{member.name}</h3>
                    {#if member.role === 'admin'}
                      <Crown class="w-4 h-4 text-yellow-500" />
                    {/if}
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 truncate">{member.email}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Joined {formatDate(member.added_at)}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 rounded-full text-xs font-semibold {getRoleColor(member.role)}">
                  {getRoleText(member.role)}
                </span>
                {#if currentUserRole === 'admin' && member.role !== 'admin'}
                  <button onclick={() => removeMember(member.id, member.name)} class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="Remove member">
                    <Trash2 class="w-4 h-4 text-red-500" />
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Empty State -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-gray-200 dark:border-slate-700 text-center">
        <div class="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users class="w-10 h-10 text-primary-500" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Team Members Yet</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Invite team members to collaborate on your organization</p>
        {#if currentUserRole === 'admin' || currentUserRole === 'manager'}
          <a href={`/organizations/${organization.id}/members/invite`} use:inertia class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md">
            <UserPlus class="w-4 h-4" />
            Invite Member
          </a>
        {/if}
      </div>
    {/if}

    <!-- Role Legend -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Roles & Permissions</h3>
      <div class="space-y-4">
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
            <Crown class="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white">Admin</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Full access to all organization settings, members, and events</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <Shield class="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white">Manager</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">Can manage events and invite members, but cannot delete organization</p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <Users class="w-4 h-4 text-green-600 dark:text-green-400" />
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
