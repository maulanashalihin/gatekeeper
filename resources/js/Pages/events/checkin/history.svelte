<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../../Components/Layouts/EventLayout.svelte';
  import { ArrowLeft, CheckCircle, Clock, User, Mail, RotateCcw, Search, Filter } from 'lucide-svelte';

  let { event, checkIns, orgUuid } = $props();

  let searchTerm = $state('');
  let filterMethod = $state('all');

  const filteredCheckIns = $derived(checkIns.filter((checkIn: any) => {
    const matchesSearch = checkIn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         checkIn.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMethod === 'all' || checkIn.method === filterMethod;
    return matchesSearch && matchesFilter;
  }));

  const undoCheckIn = async (attendeeId: string) => {
    if (!confirm('Are you sure you want to undo this check-in?')) return;

    await router.delete(`/organizations/${orgUuid}/events/${event.id}/checkin/${attendeeId}`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      qr: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
      manual: 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400',
      kiosk: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    };
    return colors[method] || 'bg-gray-100 text-gray-600';
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      qr: 'QR Scan',
      manual: 'Manual',
      kiosk: 'Kiosk'
    };
    return labels[method] || method;
  };
</script>

<EventLayout group="checkin" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 sm:gap-4">
        <a href={`/organizations/${orgUuid}/events/${event.id}/dashboard`} use:inertia class="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </a>
        <div class="min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Check-in History</h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{event.name}</p>
        </div>
      </div>
      <div class="w-full sm:w-auto">
        <a href={`/organizations/${orgUuid}/events/${event.id}/checkin/stats`} use:inertia class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm font-semibold min-h-[44px]">
          <Clock class="w-4 h-4" />
          Statistics
        </a>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div class="flex-1 relative">
          <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search by name or email..."
            class="w-full px-4 py-3 pl-12 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
          />
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        </div>
        <div class="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onclick={() => filterMethod = 'all'}
            class="px-4 py-3 rounded-xl font-semibold text-sm transition whitespace-nowrap {filterMethod === 'all' ? 'bg-primary-500 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}"
          >
            All
          </button>
          <button
            onclick={() => filterMethod = 'qr'}
            class="px-4 py-3 rounded-xl font-semibold text-sm transition whitespace-nowrap {filterMethod === 'qr' ? 'bg-primary-500 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}"
          >
            QR Scan
          </button>
          <button
            onclick={() => filterMethod = 'manual'}
            class="px-4 py-3 rounded-xl font-semibold text-sm transition whitespace-nowrap {filterMethod === 'manual' ? 'bg-primary-500 text-white' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}"
          >
            Manual
          </button>
        </div>
      </div>
    </div>

    <!-- Check-in List -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          Check-ins ({filteredCheckIns.length})
        </h2>
      </div>

      {#if filteredCheckIns.length > 0}
        <div class="space-y-3">
          {#each filteredCheckIns as checkIn}
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <div class="w-10 h-10 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                <CheckCircle class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{checkIn.name}</p>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate flex items-center gap-1">
                  <Mail class="w-3 h-3" />
                  {checkIn.email}
                </p>
              </div>
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{formatTime(checkIn.checked_in_at)}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{formatDate(checkIn.checked_in_at)}</p>
                </div>
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap {getMethodColor(checkIn.method)}">
                  {getMethodLabel(checkIn.method)}
                </span>
                <button
                  onclick={() => undoCheckIn(checkIn.attendee_id)}
                  class="p-2 rounded-lg hover:bg-danger/10 text-danger transition"
                  title="Undo Check-in"
                >
                  <RotateCcw class="w-4 h-4" />
                </button>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-8 sm:py-12">
          <Clock class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400 text-base sm:text-lg font-medium mb-2">No check-ins found</p>
          <p class="text-gray-500 dark:text-gray-500 text-xs sm:text-sm">
            {searchTerm || filterMethod !== 'all' ? 'Try adjusting your search or filters' : 'Start checking in attendees to see them here'}
          </p>
        </div>
      {/if}
    </div>

    <!-- Event Info -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Event Information</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Start Date</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{formatDate(event.start_date)}</p>
        </div>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">End Date</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{formatDate(event.end_date)}</p>
        </div>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Location</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{event.location || 'Not specified'}</p>
        </div>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Venue</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{event.venue || 'Not specified'}</p>
        </div>
      </div>
    </div>
  </div>
</EventLayout>
