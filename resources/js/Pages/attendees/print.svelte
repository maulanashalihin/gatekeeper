<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../Components/Layouts/EventLayout.svelte';
  import { ArrowLeft, Printer, Check, X, Calendar, Clock, User, Mail, Phone, Building, MapPin, CheckCircle, XCircle, Ticket as TicketIcon, Globe } from 'lucide-svelte';

  let { attendees, event, orgUuid } = $props();

  let selectedAttendees = $state<string[]>(attendees.map((a: any) => a.id));

  const toggleAll = () => {
    if (selectedAttendees.length === attendees.length) {
      selectedAttendees = [];
    } else {
      selectedAttendees = attendees.map((a: any) => a.id);
    }
  };

  const toggleAttendee = (id: string) => {
    if (selectedAttendees.includes(id)) {
      selectedAttendees = selectedAttendees.filter(a => a !== id);
    } else {
      selectedAttendees = [...selectedAttendees, id];
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedAttendeesData = $derived(attendees.filter((a: any) => selectedAttendees.includes(a.id)));

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      registered: 'bg-blue-100 text-blue-600 border-blue-200',
      checked_in: 'bg-green-100 text-green-600 border-green-200',
      cancelled: 'bg-red-100 text-red-600 border-red-200',
      no_show: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-600 border-gray-200';
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

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
</script>

<svelte:head>
  <style>
    @media print {
      body * {
        visibility: hidden;
      }
      #print-area, #print-area * {
        visibility: visible;
      }
      #print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 210mm;
        height: 297mm;
      }
      .no-print {
        display: none !important;
      }
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      body {
        background: white !important;
        margin: 0;
        padding: 0;
      }
      .bg-gradient-to-r {
        background: #6366F1 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .dark\:bg-slate-800 {
        background: white !important;
        border-color: #E5E7EB !important;
      }
      .dark\:text-white {
        color: #111827 !important;
      }
      .dark\:text-gray-400 {
        color: #6B7280 !important;
      }
      .dark\:border-slate-700 {
        border-color: #E5E7EB !important;
      }
      .dark\:bg-slate-700 {
        background: #F3F4F6 !important;
      }
      .dark\:bg-slate-900\/50 {
        background: #F9FAFB !important;
      }
      .dark\:bg-slate-900\/30 {
        background: #F3F4F6 !important;
      }
      .dark\:text-gray-300 {
        color: #4B5563 !important;
      }
      .dark\:bg-primary-900\/30 {
        background: #E0E7FF !important;
      }
      .dark\:text-primary-400 {
        color: #4F46E5 !important;
      }
      .dark\:bg-secondary-900\/30 {
        background: #D1FAE5 !important;
      }
      .dark\:text-secondary-400 {
        color: #059669 !important;
      }
      .dark\:bg-purple-900\/30 {
        background: #EDE9FE !important;
      }
      .dark\:text-purple-400 {
        color: #7C3AED !important;
      }
      .dark\:bg-orange-900\/30 {
        background: #FFEDD5 !important;
      }
      .dark\:text-orange-400 {
        color: #EA580C !important;
      }
      .dark\:bg-blue-900\/30 {
        background: #DBEAFE !important;
      }
      .dark\:text-blue-400 {
        color: #2563EB !important;
      }
      .print-ticket {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }
  </style>
</svelte:head>

<EventLayout group="attendees" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
      <div class="flex items-center gap-3">
        <a href={`/organizations/${orgUuid}/events/${event.id}/attendees`} use:inertia class="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </a>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Print Tickets</h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{event.name}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          onclick={toggleAll}
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition min-h-[44px]"
        >
          {#if selectedAttendees.length === attendees.length}
            <X class="w-4 h-4" />
            <span>Deselect All</span>
          {:else}
            <Check class="w-4 h-4" />
            <span>Select All</span>
          {/if}
        </button>
        <button
          onclick={handlePrint}
          class="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md min-h-[44px]"
        >
          <Printer class="w-4 h-4" />
          Print Tickets
        </button>
      </div>
    </div>

    <!-- Selection Info -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 no-print">
      <p class="text-sm text-blue-800 dark:text-blue-200">
        <span class="font-semibold">{selectedAttendees.length}</span> of {attendees.length} attendees selected
      </p>
    </div>

    <!-- Print Area -->
    <div id="print-area">
      {#if selectedAttendeesData.length === 0}
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 sm:p-12 text-center no-print">
          <p class="text-gray-600 dark:text-gray-400">Select attendees to print tickets</p>
        </div>
      {:else}
        <!-- Ticket Grid - 2x2 on A4 -->
        <div class="grid grid-cols-2 gap-4" style="page-break-inside: avoid;">
          {#each selectedAttendeesData as attendee (attendee.id)}
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden print-ticket" style="page-break-inside: avoid;">
              <!-- Ticket Header -->
              <div class="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <TicketIcon class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-xs font-medium text-white/80">Event Ticket</p>
                    <h2 class="text-sm font-bold truncate">{event.name}</h2>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <Calendar class="w-3 h-3 text-white/80" />
                  <span>{formatDate(event.start_date)}</span>
                  {#if event.start_date !== event.end_date}
                    <span>-</span>
                    <span>{new Date(event.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  {/if}
                </div>
              </div>

              <!-- Perforation Line -->
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-dashed border-gray-300 dark:border-slate-600"></div>
                </div>
                <div class="relative flex justify-between">
                  <div class="w-4 h-4 bg-gray-50 dark:bg-slate-900 rounded-full -mt-2 -ml-2"></div>
                  <div class="w-4 h-4 bg-gray-50 dark:bg-slate-900 rounded-full -mt-2 -mr-2"></div>
                </div>
              </div>

              <!-- Ticket Body -->
              <div class="p-4">
                <div class="space-y-3">
                  <!-- Attendee Name -->
                  <div class="flex items-start gap-2">
                    <div class="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <User class="w-3 h-3 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</p>
                      <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{attendee.name}</p>
                    </div>
                  </div>

                  <!-- Email -->
                  {#if attendee.email}
                    <div class="flex items-start gap-2">
                      <div class="w-6 h-6 rounded-lg bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center flex-shrink-0">
                        <Mail class="w-3 h-3 text-secondary-600 dark:text-secondary-400" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</p>
                        <p class="text-xs text-gray-700 dark:text-gray-300 truncate">{attendee.email}</p>
                      </div>
                    </div>
                  {/if}

                  <!-- Phone -->
                  {#if attendee.phone}
                    <div class="flex items-start gap-2">
                      <div class="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Phone class="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone</p>
                        <p class="text-xs text-gray-700 dark:text-gray-300 truncate">{attendee.phone}</p>
                      </div>
                    </div>
                  {/if}
                </div>

                <!-- Event Location -->
                {#if event.location || event.venue || event.address}
                  <div class="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                    <p class="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Event Location</p>
                    {#if event.location}
                      <div class="flex items-start gap-2 mb-2">
                        <div class="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <Globe class="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-[10px] text-gray-700 dark:text-gray-300 truncate">{event.location}</p>
                        </div>
                      </div>
                    {/if}
                    {#if event.venue}
                      <div class="flex items-start gap-2 mb-2">
                        <div class="w-5 h-5 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                          <Building class="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-[10px] text-gray-700 dark:text-gray-300 truncate">{event.venue}</p>
                        </div>
                      </div>
                    {/if}
                    {#if event.address}
                      <div class="flex items-start gap-2">
                        <div class="w-5 h-5 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                          <MapPin class="w-2.5 h-2.5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-[10px] text-gray-700 dark:text-gray-300 truncate">{event.address}</p>
                        </div>
                      </div>
                    {/if}
                  </div>
                {/if}

                <!-- QR Code Section -->
                <div class="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div class="flex items-center gap-3">
                    <div class="relative w-28 h-28 flex-shrink-0">
                      <div class="w-full h-full bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 flex items-center justify-center p-1">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(attendee.qr_code)}`}
                          alt="QR Code"
                          class="w-full h-full"
                        />
                      </div>
                      <div class="absolute -top-0.5 -left-0.5 w-2 h-2 border-t-2 border-l-2 border-primary-500 rounded-tl"></div>
                      <div class="absolute -top-0.5 -right-0.5 w-2 h-2 border-t-2 border-r-2 border-primary-500 rounded-tr"></div>
                      <div class="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-b-2 border-l-2 border-primary-500 rounded-bl"></div>
                      <div class="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b-2 border-r-2 border-primary-500 rounded-br"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Ticket ID</p>
                      <p class="text-[10px] font-mono text-gray-700 dark:text-gray-300 truncate">{attendee.qr_code}</p>
                      <div class="mt-2">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border {getStatusColor(attendee.status)}">
                          {#if attendee.status === 'checked_in'}
                            <CheckCircle class="w-2.5 h-2.5" />
                          {:else if attendee.status === 'cancelled'}
                            <XCircle class="w-2.5 h-2.5" />
                          {:else}
                            <Clock class="w-2.5 h-2.5" />
                          {/if}
                          {getStatusText(attendee.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ticket Footer -->
              <div class="bg-gray-50 dark:bg-slate-900/50 px-4 py-2 border-t border-gray-200 dark:border-slate-700">
                <div class="flex items-center justify-center">
                  <p class="text-[9px] text-gray-500 dark:text-gray-400 text-center">
                    Ticket ID: <span class="font-mono font-semibold text-gray-700 dark:text-gray-300">{attendee.id.substring(0, 8)}...</span>
                  </p>
                </div>
              </div>

              <!-- Checkbox for selection (hidden in print) -->
              <div class="px-4 pb-4 no-print">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAttendees.includes(attendee.id)}
                    onchange={() => toggleAttendee(attendee.id)}
                    class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-xs text-gray-700 dark:text-gray-300">Include in print</span>
                </label>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</EventLayout>