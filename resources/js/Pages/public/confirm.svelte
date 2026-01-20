<script>
  import { router } from '@inertiajs/svelte'
  let { attendee, event } = $props()
  
  function viewTicket() {
    router.visit(`/events/${event.slug}/ticket/${attendee.qr_code}`)
  }
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-2xl mx-auto">
    <!-- Success Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-surface mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
      <p class="text-gray-600">You have been registered for {event.name}</p>
    </div>

    <!-- Confirmation Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <!-- Attendee Info -->
      <div class="mb-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Your Information</h2>
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <div>
              <p class="text-sm text-gray-500">Name</p>
              <p class="font-semibold text-gray-900">{attendee.name}</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-semibold text-gray-900">{attendee.email}</p>
            </div>
          </div>

          {#if attendee.phone}
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <div>
                <p class="text-sm text-gray-500">Phone</p>
                <p class="font-semibold text-gray-900">{attendee.phone}</p>
              </div>
            </div>
          {/if}

          {#if attendee.company}
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <div>
                <p class="text-sm text-gray-500">Company</p>
                <p class="font-semibold text-gray-900">{attendee.company}</p>
              </div>
            </div>
          {/if}

          {#if attendee.job_title}
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              <div>
                <p class="text-sm text-gray-500">Job Title</p>
                <p class="font-semibold text-gray-900">{attendee.job_title}</p>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Event Info -->
      <div class="mb-6 pt-6 border-t border-gray-200">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Event Details</h2>
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <div>
              <p class="text-sm text-gray-500">Date</p>
              <p class="font-semibold text-gray-900">
                {new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {#if event.end_date && new Date(event.end_date).getTime() !== new Date(event.start_date).getTime()}
                  - {new Date(event.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                {/if}
              </p>
            </div>
          </div>

          {#if event.location}
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <p class="text-sm text-gray-500">Location</p>
                <p class="font-semibold text-gray-900">{event.location}</p>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Status Badge -->
      <div class="mb-6 pt-6 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Registration Status</p>
            <p class="font-semibold text-gray-900 mt-1">Registered</p>
          </div>
          <span class="px-4 py-2 rounded-full bg-success-surface text-success text-sm font-semibold">
            ✓ Confirmed
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button 
          onclick={viewTicket}
          class="w-full px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md"
        >
          View Your Ticket
        </button>
        <a 
          href="/" 
          class="block w-full px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm text-center hover:border-gray-300 transition"
        >
          Back to Home
        </a>
      </div>
    </div>

    <!-- Info Note -->
    <div class="mt-6 p-4 rounded-xl bg-info-surface border border-info/20">
      <div class="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-info mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <div>
          <h4 class="text-sm font-bold text-info">Important</h4>
          <p class="text-sm text-info/80 mt-1">
            Please save this page or bookmark it. You can access your ticket anytime using the QR code.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
