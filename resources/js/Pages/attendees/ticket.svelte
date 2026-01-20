<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../Components/Layouts/EventLayout.svelte';
  import { ArrowLeft, Download, Printer, Calendar, MapPin, Clock, User, Mail, CheckCircle, XCircle, Ticket as TicketIcon, Share2, Copy, Phone, Building, MessageCircle, ExternalLink, Globe } from 'lucide-svelte';
  import { Toast } from '../../Components/helper.js';
  import dayjs from 'dayjs';

  let { attendee, event, orgUuid, flash } = $props();

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

  const formatDate = (timestamp: number | string) => {
    return dayjs(timestamp).format('dddd, MMMM D, YYYY');
  };

  const formatTime = (timestamp: number | string) => {
    return dayjs(timestamp).format('HH:mm');
  };

  const printTicket = () => {
    window.print();
  };
 

  const copyPublicLink = async () => {
    const publicUrl = `${window.location.origin}/events/${event.slug}/ticket/${attendee.id}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      Toast('Public ticket link copied to clipboard!', 'success');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      prompt('Copy this link:', publicUrl);
    }
  };

  const openPublicLink = () => {
    const publicUrl = `${window.location.origin}/events/${event.slug}/ticket/${attendee.id}`;
    window.open(publicUrl, '_blank');
  };

  const shareToWhatsApp = () => {
    const publicUrl = `${window.location.origin}/events/${event.slug}/ticket/${attendee.id}`;
    const shareText = `🎫 Event Ticket: ${event.name}\n\n📅 ${formatDate(event.start_date)} at ${formatTime(event.start_date)}\n👤 ${attendee.name}\n\nView ticket: ${publicUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };
</script>

<EventLayout group="attendees" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <a href={`/organizations/${orgUuid}/events/${event.id}/attendees`} use:inertia class="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
        <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </a>
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Event Ticket</h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{attendee.name}</p>
      </div>
    </div>

    <!-- Ticket Card -->
    <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden print:shadow-none print:border-2">
      <!-- Ticket Header -->
      <div class="bg-gradient-to-r from-primary-500 to-primary-600 p-6 sm:p-8 text-white">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <TicketIcon class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-medium text-white/80">Event Ticket</p>
            <h2 class="text-lg sm:text-xl font-bold">{event.name}</h2>
          </div>
        </div>
        <div class="flex flex-wrap gap-4 sm:gap-6">
          <div class="flex items-center gap-2">
            <Calendar class="w-5 h-5 text-white/80" />
            <span class="text-sm sm:text-base font-medium">{formatDate(event.start_date)}</span>
          </div>
          <div class="flex items-center gap-2">
            <Clock class="w-5 h-5 text-white/80" />
            <span class="text-sm sm:text-base font-medium">{formatTime(event.start_date)}</span>
          </div>
        </div>
      </div>

      <!-- Perforation Line -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t-2 border-dashed border-gray-300 dark:border-slate-600"></div>
        </div>
        <div class="relative flex justify-between">
          <div class="w-8 h-8 bg-gray-50 dark:bg-slate-900 rounded-full -mt-4 -ml-4"></div>
          <div class="w-8 h-8 bg-gray-50 dark:bg-slate-900 rounded-full -mt-4 -mr-4"></div>
        </div>
      </div>

      <!-- Ticket Body -->
      <div class="p-6 sm:p-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <!-- Attendee Information -->
          <div class="space-y-5">
            <div>
              <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Attendee Information</h3>
              
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <User class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full Name</p>
                    <p class="font-semibold text-gray-900 dark:text-white break-words">{attendee.name}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center flex-shrink-0">
                    <Mail class="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email Address</p>
                    <p class="font-semibold text-gray-900 dark:text-white break-all">{attendee.email}</p>
                  </div>
                </div>

                {#if attendee.phone}
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <Phone class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone Number</p>
                      <p class="font-semibold text-gray-900 dark:text-white break-words">{attendee.phone}</p>
                    </div>
                  </div>
                {/if}

                {#if attendee.company}
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                      <Building class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Company</p>
                      <p class="font-semibold text-gray-900 dark:text-white break-words">{attendee.company}</p>
                    </div>
                  </div>
                {/if}
              </div>
            </div>

            <!-- Status Badge -->
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 {getStatusColor(attendee.status)}">
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

          <!-- QR Code Section -->
          <div class="flex flex-col items-center justify-center text-center space-y-4">
            <div class="relative">
              <div class="w-64 h-64 bg-white dark:bg-slate-700 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-slate-600 flex items-center justify-center p-4">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(attendee.id)}`}
                  alt="QR Code"
                  class="w-full h-full"
                />
              </div>
              <!-- Decorative corners -->
              <div class="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary-500 rounded-tl-lg"></div>
              <div class="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary-500 rounded-tr-lg"></div>
              <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary-500 rounded-bl-lg"></div>
              <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary-500 rounded-br-lg"></div>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">Scan this QR code</p>
              <p class="text-xs text-gray-600 dark:text-gray-400">Present this code at the event entrance for check-in</p>
            </div>
          </div>
        </div>

        <!-- Event Details -->
        {#if event.location || event.venue || event.address}
          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Event Location</h3>
            
            {#if event.location}
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-info-surface dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Globe class="w-5 h-5 text-info dark:text-blue-400" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Region</p>
                  <p class="font-semibold text-gray-900 dark:text-white break-words">{event.location}</p>
                </div>
              </div>
            {/if}
            
            {#if event.venue}
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Building class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Venue</p>
                  <p class="font-semibold text-gray-900 dark:text-white break-words">{event.venue}</p>
                </div>
              </div>
            {/if}

            {#if event.address}
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                  <MapPin class="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Address</p>
                  <p class="font-semibold text-gray-900 dark:text-white break-words">{event.address}</p>
                </div>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Registration Info -->
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Registration Details</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-start gap-3">
              <Calendar class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div class="min-w-0">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Registered On</p>
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
                  <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Checked In At</p>
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
          </div>
        </div>
      </div>

      <!-- Ticket Footer -->
      <div class="bg-gray-50 dark:bg-slate-900/50 px-6 sm:px-8 py-4 border-t border-gray-200 dark:border-slate-700">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
            Ticket ID: <span class="font-mono font-semibold text-gray-700 dark:text-gray-300">{attendee.id.substring(0, 8)}...</span>
          </p>
          <div class="flex flex-wrap gap-2 no-print">
            <button onclick={shareToWhatsApp} class="inline-flex items-center justify-center p-2.5 rounded-xl bg-green-500 text-white hover:bg-green-600 transition" title="Share to WhatsApp">
              <MessageCircle class="w-5 h-5" />
            </button>
            <button onclick={copyPublicLink} class="inline-flex items-center justify-center p-2.5 rounded-xl bg-secondary-500 text-white hover:bg-secondary-600 transition" title="Copy Link">
              <Copy class="w-5 h-5" />
            </button>
            <button onclick={openPublicLink} class="inline-flex items-center justify-center p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition" title="Open Public Link">
              <ExternalLink class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 no-print">
      <a href={`/organizations/${orgUuid}/events/${event.id}/attendees/${attendee.id}/edit`} use:inertia class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition min-h-[44px]">
        Edit Attendee
      </a>
      <a href={`/organizations/${orgUuid}/events/${event.id}/attendees`} use:inertia class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition min-h-[44px]">
        Back to Attendees
      </a>
    </div>
  </div>

  <style>
    @media print {
      body {
        background: white !important;
      }
      .no-print {
        display: none !important;
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
      .dark\:border-slate-600 {
        border-color: #D1D5DB !important;
      }
      .dark\:hover\:bg-slate-700 {
        background: white !important;
      }
    }
  </style>
</EventLayout>