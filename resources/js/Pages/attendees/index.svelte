<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../Components/Layouts/EventLayout.svelte';
  import { Plus, Upload, Search, Edit, Trash2, Mail, Ticket, ArrowLeft, Users, CheckCircle, XCircle, Clock, Share2, Check, Download } from 'lucide-svelte';
  import StatsCard from '../../Components/StatsCard.svelte';
  import StatusBadge from '../../Components/StatusBadge.svelte';
  import Alert from '../../Components/Alert.svelte';

  let { attendees, event, orgUuid, flash } = $props();

  let searchQuery = $state('');
  let statusFilter = $state('all');
  let showCopySuccess = $state(false);

  const filteredAttendees = $derived(attendees.filter((a: any) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  }));

  const registeredCount = $derived(attendees.filter((a: any) => a.status === 'registered').length);
  const checkedInCount = $derived(attendees.filter((a: any) => a.status === 'checked_in').length);
  const cancelledCount = $derived(attendees.filter((a: any) => a.status === 'cancelled').length);

  const deleteAttendee = (id: string) => {
    if (confirm('Are you sure you want to delete this attendee?')) {
      router.delete(`/organizations/${orgUuid}/events/${event.id}/attendees/${id}`);
    }
  };

  const copyRegistrationLink = () => {
    const registrationUrl = `${window.location.origin}/events/${event.slug}/register`;
    navigator.clipboard.writeText(registrationUrl).then(() => {
      showCopySuccess = true;
      setTimeout(() => {
        showCopySuccess = false;
      }, 2000);
    });
  };

  const downloadAttendees = () => {
    const headers = ['id', 'name', 'phone', 'email', 'link public'];
    const rows = attendees.map((a: any) => [
      a.id,
      a.name,
      a.phone || '',
      a.email,
      `${window.location.origin}/events/${event.slug}/ticket/${a.id}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendees-${event.slug}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
</script>

<EventLayout group="attendees" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <a href={`/organizations/${orgUuid}/events/${event.id}/dashboard`} use:inertia class="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </a>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Attendees</h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{event.name}</p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onclick={copyRegistrationLink}
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition min-h-[44px] relative"
        >
          {#if showCopySuccess}
            <Check class="w-4 h-4 text-green-600" />
            <span class="text-green-600">Copied!</span>
          {:else}
            <Share2 class="w-4 h-4" />
            <span>Share Registration Link</span>
          {/if}
        </button>
        <button
          onclick={downloadAttendees}
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition min-h-[44px]"
        >
          <Download class="w-4 h-4" />
          <span>Download</span>
        </button>
        <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/import`} use:inertia class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition min-h-[44px]">
          <Upload class="w-4 h-4" />
          Import
        </a>
        <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/print`} use:inertia class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition min-h-[44px]">
          <Ticket class="w-4 h-4" />
          Print Tickets
        </a>
        <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/create`} use:inertia class="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md min-h-[44px]">
          <Plus class="w-4 h-4" />
          Add Attendee
        </a>
      </div>
    </div>

    <!-- Flash Messages -->
    {#if flash?.error}
      <Alert type="error" message={flash.error} />
    {/if}

    {#if flash?.success}
      <Alert type="success" message={flash.success} />
    {/if}

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Total"
        value={attendees.length}
        icon={Users}
        iconColorClass="text-blue-600 dark:text-blue-400"
        iconBgClass="bg-blue-100 dark:bg-blue-900/30"
      />

      <StatsCard
        title="Checked In"
        value={checkedInCount}
        icon={CheckCircle}
        iconColorClass="text-green-600 dark:text-green-400"
        iconBgClass="bg-green-100 dark:bg-green-900/30"
      />

      <StatsCard
        title="Registered"
        value={registeredCount}
        icon={Clock}
        iconColorClass="text-blue-600 dark:text-blue-400"
        iconBgClass="bg-blue-100 dark:bg-blue-900/30"
      />
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1 relative">
        <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          bind:value={searchQuery}
          class="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
          placeholder="Search by name or email..."
        />
      </div>
      <select
        bind:value={statusFilter}
        class="px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 min-h-[48px]"
      >
        <option value="all">All Status</option>
        <option value="registered">Registered</option>
        <option value="checked_in">Checked In</option>
        <option value="cancelled">Cancelled</option>
        <option value="no_show">No Show</option>
      </select>
    </div>

    <!-- Attendees List -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      {#if filteredAttendees.length === 0}
        <div class="p-8 sm:p-12 text-center">
          <Users class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">No attendees found</h3>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
            {attendees.length === 0 ? 'Get started by adding your first attendee' : 'Try adjusting your search or filters'}
          </p>
          {#if attendees.length === 0}
            <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/create`} use:inertia class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md min-h-[44px]">
              <Plus class="w-4 h-4" />
              Add Attendee
            </a>
          {/if}
        </div>
      {:else}
        <!-- Mobile Card View -->
        <div class="sm:hidden divide-y divide-gray-200 dark:divide-slate-700">
          {#each filteredAttendees as attendee}
            <div class="p-4">
              <div class="flex items-start justify-between gap-3 mb-3">
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 dark:text-white truncate">{attendee.name}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 truncate">{attendee.email}</p>
                  {#if attendee.phone}
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{attendee.phone}</p>
                  {/if}
                </div>
                <StatusBadge status={attendee.status} />
              </div>
              <div class="mb-3">
                <p class="text-sm text-gray-900 dark:text-white capitalize">by {attendee.registration_method?.replace('_', ' ') || '-'}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">{attendee.creator_name || 'Unknown'}</p>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(attendee.registered_at).toLocaleDateString()}
                </p>
                <div class="flex items-center gap-1">
                  <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/${attendee.id}/ticket`} use:inertia class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition" title="View Ticket">
                    <Ticket class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </a>
                  <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/${attendee.id}/edit`} use:inertia class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition" title="Edit">
                    <Edit class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </a>
                  <button onclick={() => deleteAttendee(attendee.id)} class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition" title="Delete">
                    <Trash2 class="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
        <!-- Desktop Table View -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Attendee</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Registration</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Registered</th>
                <th class="text-right px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
              {#each filteredAttendees as attendee}
                <tr class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                  <td class="px-6 py-4">
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white">{attendee.name}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{attendee.email}</p>
                      {#if attendee.phone}
                        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">{attendee.phone}</p>
                      {/if}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div>
                      <p class="text-sm text-gray-900 dark:text-white capitalize">By {attendee.registration_method?.replace('_', ' ') || '-'}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{attendee.creator_name || 'Unknown'}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <StatusBadge status={attendee.status} />
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(attendee.registered_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2">
                      <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/${attendee.id}/ticket`} use:inertia class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition" title="View Ticket">
                        <Ticket class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </a>
                      <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/${attendee.id}/edit`} use:inertia class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition" title="Edit">
                        <Edit class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </a>
                      <button onclick={() => deleteAttendee(attendee.id)} class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition" title="Delete">
                        <Trash2 class="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</EventLayout>
