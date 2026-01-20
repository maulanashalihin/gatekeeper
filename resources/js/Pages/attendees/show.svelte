<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../Components/Layouts/EventLayout.svelte';
  import { ArrowLeft, Edit, Trash2, Mail, Ticket, User, Phone, Building, Briefcase, Calendar, Clock, CheckCircle, XCircle } from 'lucide-svelte';

  let { attendee, event, orgUuid, flash } = $props();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      registered: 'bg-blue-100 text-blue-600',
      checked_in: 'bg-green-100 text-green-600',
      cancelled: 'bg-red-100 text-red-600',
      no_show: 'bg-gray-100 text-gray-600'
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      registered: 'Registered',
      checked_in: 'Checked In',
      cancelled: 'Cancelled',
      no_show: 'No Show'
    };
    return texts[status] || status;
  };

  const deleteAttendee = () => {
    if (confirm('Are you sure you want to delete this attendee?')) {
      router.delete(`/organizations/${orgUuid}/events/${event.id}/attendees/${attendee.id}`);
    }
  };
</script>

<EventLayout group="attendees" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <a href={`/organizations/${orgUuid}/events/${event.id}/attendees`} use:inertia class="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </a>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Attendee Details</h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{event.name}</p>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-2">
        <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/${attendee.id}/ticket`} use:inertia class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition min-h-[44px]">
          <Ticket class="w-4 h-4" />
          View Ticket
        </a>
        <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/${attendee.id}/edit`} use:inertia class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition min-h-[44px]">
          <Edit class="w-4 h-4" />
          Edit
        </a>
        <button onclick={deleteAttendee} class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition min-h-[44px]">
          <Trash2 class="w-4 h-4" />
          Delete
        </button>
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

    <!-- Attendee Info -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div class="p-4 sm:p-6">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Personal Information</h2>
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <User class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p class="font-semibold text-gray-900 dark:text-white break-words">{attendee.name}</p>
                </div>
              </div>
              <div class="flex items-start gap-3 sm:gap-4">
                <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Mail class="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                  <p class="font-semibold text-gray-900 dark:text-white break-all">{attendee.email}</p>
                </div>
              </div>
              {#if attendee.phone}
                <div class="flex items-start gap-3 sm:gap-4">
                  <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Phone class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                    <p class="font-semibold text-gray-900 dark:text-white break-words">{attendee.phone}</p>
                  </div>
                </div>
              {/if}
              {#if attendee.company}
                <div class="flex items-start gap-3 sm:gap-4">
                  <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                    <Building class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Company</p>
                    <p class="font-semibold text-gray-900 dark:text-white break-words">{attendee.company}</p>
                  </div>
                </div>
              {/if}
              {#if attendee.job_title}
                <div class="flex items-start gap-3 sm:gap-4">
                  <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                    <Briefcase class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Job Title</p>
                    <p class="font-semibold text-gray-900 dark:text-white break-words">{attendee.job_title}</p>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>

        <!-- Notes -->
        {#if attendee.notes}
          <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
            <div class="p-4 sm:p-6">
              <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h2>
              <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words">{attendee.notes}</p>
            </div>
          </div>
        {/if}
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Status Card -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div class="p-4 sm:p-6">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Status</h2>
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold {getStatusColor(attendee.status)}">
                {#if attendee.status === 'checked_in'}
                  <CheckCircle class="w-4 h-4" />
                {:else if attendee.status === 'cancelled'}
                  <XCircle class="w-4 h-4" />
                {:else}
                  <Clock class="w-4 h-4" />
                {/if}
                {getStatusText(attendee.status)}
              </span>
            </div>
          </div>
        </div>

        <!-- Registration Info -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div class="p-4 sm:p-6">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Registration</h2>
            <div class="space-y-3 sm:space-y-4">
              <div class="flex items-start gap-3">
                <Calendar class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div class="min-w-0">
                  <p class="text-sm text-gray-600 dark:text-gray-400">Registered On</p>
                  <p class="font-semibold text-gray-900 dark:text-white break-words">
                    {new Date(attendee.registered_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              {#if attendee.checked_in_at}
                <div class="flex items-start gap-3">
                  <CheckCircle class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div class="min-w-0">
                    <p class="text-sm text-gray-600 dark:text-gray-400">Checked In At</p>
                    <p class="font-semibold text-gray-900 dark:text-white break-words">
                      {new Date(attendee.checked_in_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              {/if}
              <div class="flex items-start gap-3">
                <Clock class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div class="min-w-0">
                  <p class="text-sm text-gray-600 dark:text-gray-400">Registration Method</p>
                  <p class="font-semibold text-gray-900 dark:text-white capitalize break-words">
                    {attendee.registration_method === 'admin' ? 'Added by Admin' : attendee.registration_method === 'import' ? 'Imported' : 'Self-registered'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- QR Code -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div class="p-4 sm:p-6 text-center">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">QR Code</h2>
            <div class="bg-gray-100 dark:bg-slate-700 rounded-xl p-3 sm:p-4 mb-4">
              <p class="text-xs font-mono text-gray-600 dark:text-gray-400 break-all">{attendee.qr_code}</p>
            </div>
            <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/${attendee.id}/ticket`} use:inertia class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition min-h-[44px]">
              <Ticket class="w-4 h-4" />
              View Ticket
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</EventLayout>
