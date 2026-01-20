<script>
  import { router } from '@inertiajs/svelte'
  let { flash, event } = $props()
  
  let formData = $state({
    name: '',
    email: '',
    phone: ''
  })
  
  let isSubmitting = $state(false)
  
  function handleSubmit(e) {
    e.preventDefault()
    isSubmitting = true
    
    router.post(`/events/${event.slug}/register`, formData, {
      onFinish: () => {
        isSubmitting = false
      }
    })
  }
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-2xl mx-auto">
    <!-- Event Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1>
      <p class="text-gray-600">Register for this event</p>
    </div>

    <!-- Flash Messages -->
    {#if flash?.error}
      <div class="flex items-start gap-4 p-4 rounded-xl bg-error-surface border border-error/20 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-error mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div>
          <h4 class="text-sm font-bold text-error">Error</h4>
          <p class="text-sm text-error/80 mt-1">{flash.error}</p>
        </div>
      </div>
    {/if}

    <!-- Registration Form -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <form onsubmit={handleSubmit}>
        <div class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
            <input 
              type="text" 
              bind:value={formData.name} 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:outline-none" 
              placeholder="Enter your full name" 
              required 
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
            <input 
              type="email" 
              bind:value={formData.email} 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:outline-none" 
              placeholder="Enter your email address" 
              required 
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              bind:value={formData.phone} 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:outline-none" 
              placeholder="Enter your phone number" 
            />
          </div>

          <!-- Submit Button -->
          <div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              class="w-full px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registering...' : 'Register Now'}
            </button>
          </div>
        </div>
      </form>

      <!-- Event Info -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <h3 class="text-sm font-bold text-gray-700 mb-3">Event Details</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>
              {new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {#if event.end_date && new Date(event.end_date).getTime() !== new Date(event.start_date).getTime()}
                - {new Date(event.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              {/if}
            </span>
          </div>
          {#if event.location}
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{event.location}</span>
            </div>
          {/if}
        </div>
      </div>
    </div>

     
  </div>
</div>
