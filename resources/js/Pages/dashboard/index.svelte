<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import OrganizationLayout from '../../Components/Layouts/OrganizationLayout.svelte';
  import { Calendar, Users, CheckCircle, Plus, ArrowRight, Clock, MapPin, UserPlus, Settings, Building2, TrendingUp, FileText, Table } from 'lucide-svelte';
  import StatsCard from '../../Components/StatsCard.svelte';
  import StatusBadge from '../../Components/StatusBadge.svelte';

  let { user, organization, statistics, recentEvents, teamMembers, userOrganizations } = $props();
</script>

<OrganizationLayout group="dashboard" orgId={organization?.id}>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'User'}
        </h1>
        {#if organization}
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Viewing: <span class="font-semibold text-blue-500">{organization.name}</span>
          </p>
        {:else}
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Create an organization to get started
          </p>
        {/if}
      </div>
      <div class="flex items-center gap-2">
        {#if organization}
          <a href={`/organizations/${organization.id}/export/pdf`} target="_blank" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-500 font-semibold text-sm transition shadow-sm hover:shadow">
            <FileText class="w-4 h-4" />
            <span class="hidden sm:inline">Export PDF</span>
          </a>
          <a href={`/organizations/${organization.id}/export/excel`} target="_blank" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-primary-600 text-white font-semibold text-sm transition shadow-sm hover:shadow">
            <Table class="w-4 h-4" />
            <span class="hidden sm:inline">Export Excel</span>
          </a>
          <a href="/organizations" use:inertia class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            <Building2 class="w-4 h-4" />
            <span class="hidden sm:inline">Switch</span>
          </a>
        {/if}
      </div>
    </div>

    {#if !organization}
      <!-- No Organization State -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-gray-200 dark:border-slate-700 text-center">
        <div class="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 class="w-10 h-10 text-blue-500" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Organization Yet</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Create your first organization to get started with GateKeeper</p>
        <a href="/organizations/create" use:inertia class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md">
          <Plus class="w-4 h-4" />
          Create Organization
        </a>
      </div>
    {:else}
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Events"
          value={statistics.total_events}
          icon={Calendar}
          iconColorClass="text-white"
          iconBgClass="bg-blue-500"
          trend="+12%"
          trendIcon={TrendingUp}
          trendColorClass="text-green-500"
        />

        <StatsCard
          title="Total Attendees"
          value={statistics.total_attendees}
          icon={Users}
          iconColorClass="text-white"
          iconBgClass="bg-indigo-500"
          trend="+8%"
          trendIcon={TrendingUp}
          trendColorClass="text-green-500"
        />

        <StatsCard
          title="Total Check-ins"
          value={statistics.total_checkins}
          icon={CheckCircle}
          iconColorClass="text-white"
          iconBgClass="bg-green-500"
          trend="+15%"
          trendIcon={TrendingUp}
          trendColorClass="text-green-500"
        />

        <StatsCard
          title="Team Members"
          value={statistics.total_members}
          icon={Users}
          iconColorClass="text-white"
          iconBgClass="bg-purple-500"
          trend="+5%"
          trendIcon={TrendingUp}
          trendColorClass="text-green-500"
        />
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href={`/organizations/${organization.id}/events/create`} use:inertia class="flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition group">
            <div class="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <Plus class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">Create Event</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Create a new event</p>
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition" />
          </a>

          <a href={`/organizations/${organization.id}/members`} use:inertia class="flex items-center gap-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition group">
            <div class="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
              <UserPlus class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">Manage Team</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Invite team members</p>
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition" />
          </a>

          <a href={`/organizations/${organization.id}/edit`} use:inertia class="flex items-center gap-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition group">
            <div class="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <Settings class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white">Organization Settings</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Edit organization details</p>
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition" />
          </a>
        </div>
      </div>

      <!-- Recent Events -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Recent Events</h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">Coming Soon</span>
        </div>
        {#if recentEvents.length > 0}
          <div class="space-y-4">
            {#each recentEvents as event}
              <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Calendar class="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">{event.name}</h3>
                    <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <div class="flex items-center gap-1">
                        <Clock class="w-4 h-4" />
                        <span>{new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      {#if event.location}
                        <div class="flex items-center gap-1">
                          <MapPin class="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      {/if}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <StatusBadge status={event.status} />
                  <a href={`/organizations/${organization.id}/events/${event.id}/dashboard`} use:inertia class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition">
                    <ArrowRight class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </a>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8">
            <div class="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Events Yet</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Events feature coming soon</p>
            <a href="/organizations" use:inertia class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold text-sm hover:bg-primary-600 transition">
              <Building2 class="w-4 h-4" />
              Manage Organizations
            </a>
          </div>
        {/if}
      </div>

      <!-- Team Overview -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Team Members</h2>
          <a href="/organizations" use:inertia class="text-sm font-semibold text-blue-500 hover:text-primary-600 transition">
            Manage Team
          </a>
        </div>
        {#if teamMembers.length > 0}
          <div class="space-y-4">
            {#each teamMembers as member}
              <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <span class="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <StatusBadge status={member.role} showIcon={false} />
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    Joined {new Date(member.added_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
            <a href="/organizations" use:inertia class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold text-sm hover:bg-primary-600 transition">
              <UserPlus class="w-4 h-4" />
              Invite Member
            </a>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</OrganizationLayout>
