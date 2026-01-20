<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../../Components/Layouts/EventLayout.svelte';
  import { ArrowLeft, Search, CheckCircle, XCircle, User, Mail, Loader2 } from 'lucide-svelte';

  let { event, orgUuid } = $props();

  let searchTerm = $state('');
  let searchResults = $state<any[]>([]);
  let selectedAttendee = $state<any | null>(null);
  let isLoading = $state(false);
  let checkInResult = $state<{ success: boolean; message: string; attendee?: any } | null>(null);

  const searchAttendees = async () => {
    if (searchTerm.length < 2) {
      searchResults = [];
      return;
    }

    isLoading = true;
    try {
      const response = await fetch(`/api/events/${event.id}/attendees?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      searchResults = data.attendees || [];
    } catch (error) {
      searchResults = [];
    }
    isLoading = false;
  };

  const selectAttendee = (attendee: any) => {
    selectedAttendee = attendee;
    searchResults = [];
    searchTerm = attendee.name;
  };

  const checkInAttendee = async () => {
    if (!selectedAttendee) return;

    isLoading = true;
    checkInResult = null;

    try {
      const response = await fetch(`/organizations/${orgUuid}/events/${event.id}/checkin/${selectedAttendee.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });

      const data = await response.json();
      checkInResult = data;

      if (data.success) {
        selectedAttendee = null;
        searchTerm = '';
        setTimeout(() => {
          checkInResult = null;
        }, 3000);
      }
    } catch (error) {
      checkInResult = {
        success: false,
        message: 'Failed to check in attendee'
      };
    }

    isLoading = false;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Manual Check-in</h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{event.name}</p>
        </div>
      </div>
      <div class="w-full sm:w-auto">
        <a href={`/organizations/${orgUuid}/events/${event.id}/checkin`} use:inertia class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition text-sm font-semibold min-h-[44px]">
          QR Scanner
        </a>
      </div>
    </div>

    <!-- Search Form -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Search Attendee</h2>
      <div class="relative">
        <input
          type="text"
          bind:value={searchTerm}
          oninput={searchAttendees}
          placeholder="Search by name or email..."
          class="w-full px-4 py-3 pl-12 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
        />
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        {#if isLoading}
          <Loader2 class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 animate-spin" />
        {/if}
      </div>

      <!-- Search Results -->
      {#if searchResults.length > 0}
        <div class="mt-4 space-y-2 max-h-64 overflow-y-auto">
          {#each searchResults as attendee}
            <button
              onclick={() => selectAttendee(attendee)}
              class="w-full p-3 sm:p-4 rounded-xl bg-slate-800 hover:bg-slate-700 transition text-left flex items-center gap-3 sm:gap-4"
            >
              <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <User class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-white text-sm sm:text-base truncate">{attendee.name}</p>
                <p class="text-xs sm:text-sm text-slate-400 truncate flex items-center gap-1">
                  <Mail class="w-3 h-3" />
                  {attendee.email}
                </p>
              </div>
              <div class="px-2.5 py-1 rounded-full text-xs font-semibold {attendee.status === 'checked_in' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}">
                {attendee.status === 'checked_in' ? 'Checked In' : 'Registered'}
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Selected Attendee -->
    {#if selectedAttendee}
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Selected Attendee</h2>
        <div class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-800">
          <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
            <User class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg sm:text-xl font-bold text-white truncate">{selectedAttendee.name}</h3>
            <p class="text-sm sm:text-base text-slate-400 flex items-center gap-1">
              <Mail class="w-4 h-4" />
              {selectedAttendee.email}
            </p>
            <div class="mt-2">
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold {selectedAttendee.status === 'checked_in' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}">
                {selectedAttendee.status === 'checked_in' ? 'Checked In' : 'Registered'}
              </span>
            </div>
          </div>
        </div>

        {#if selectedAttendee.status !== 'checked_in'}
          <button
            onclick={checkInAttendee}
            disabled={isLoading}
            class="w-full mt-4 px-4 sm:px-6 py-3 rounded-xl bg-success text-white font-semibold hover:bg-success/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {#if isLoading}
              <Loader2 class="w-5 h-5 animate-spin" />
            {:else}
              <CheckCircle class="w-5 h-5" />
            {/if}
            Check In Attendee
          </button>
        {:else}
          <div class="mt-4 p-3 sm:p-4 rounded-xl bg-success/10 border border-success/20 text-center">
            <p class="text-success font-semibold text-sm sm:text-base">This attendee is already checked in</p>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Check-in Result -->
    {#if checkInResult}
      <div class="rounded-2xl p-4 sm:p-6 shadow-sm border {checkInResult.success ? 'bg-success-surface border-success/20' : 'bg-danger-surface border-danger/20'}">
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full {checkInResult.success ? 'bg-success' : 'bg-danger'} flex items-center justify-center flex-shrink-0">
            {#if checkInResult.success}
              <CheckCircle class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            {:else}
              <XCircle class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            {/if}
          </div>
          <div class="flex-1">
            <h3 class="text-base sm:text-lg font-bold {checkInResult.success ? 'text-success' : 'text-danger'} mb-2">
              {checkInResult.success ? 'Check-in Successful!' : 'Check-in Failed'}
            </h3>
            <p class="text-sm {checkInResult.success ? 'text-success/80' : 'text-danger/80'}">{checkInResult.message}</p>

            {#if checkInResult.success && checkInResult.attendee}
              <div class="mt-4 p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-xl">
                <div class="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p class="font-semibold text-gray-600 dark:text-gray-400">Name</p>
                    <p class="text-gray-900 dark:text-white font-medium">{checkInResult.attendee.name}</p>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-600 dark:text-gray-400">Email</p>
                    <p class="text-gray-900 dark:text-white font-medium">{checkInResult.attendee.email}</p>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-600 dark:text-gray-400">Status</p>
                    <p class="text-success font-medium">Checked In</p>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-600 dark:text-gray-400">Time</p>
                    <p class="text-gray-900 dark:text-white font-medium">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Event Info -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Event Information</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Start Date</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{formatDate(event.start_date)}</p>
        </div>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Location</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{event.location || 'Not specified'}</p>
        </div>
      </div>
    </div>
  </div>
</EventLayout>
