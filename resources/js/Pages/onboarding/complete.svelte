<script>
  import { router, inertia } from '@inertiajs/svelte'
  import { CheckCircle, Building2, Calendar, ArrowRight, Home } from 'lucide-svelte'
  import DarkModeToggle from '../../Components/DarkModeToggle.svelte'

  let { user, organization, flash } = $props()
  let isLoading = $state(false)

  function goToDashboard() {
    isLoading = true
    router.get(`/organizations/${organization?.id || ''}/dashboard`)
  }
</script>

<section class="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-success/10 dark:bg-success/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success/5 dark:bg-success/10 rounded-full blur-3xl"></div>
  </div>

  <div class="w-full flex items-center justify-center p-6 lg:p-12">
    <div class="w-full max-w-2xl relative z-10">
      <div class="absolute top-0 right-0">
        <DarkModeToggle />
      </div>
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-success to-emerald-600 mb-6 shadow-lg shadow-success/30">
          <CheckCircle class="w-12 h-12 text-white" />
        </div>
        <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          You're All Set!
        </h1>
        <p class="text-gray-600 dark:text-slate-400 text-lg lg:text-xl max-w-2xl mx-auto">
          Your account has been successfully set up. You're now ready to start managing your events with GateKeeper.
        </p>
      </div>

      {#if flash?.error}
        <div class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <svg class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-red-400 text-sm">{flash.error}</span>
        </div>
      {/if}

      <div class="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-slate-700/50 p-8 shadow-xl mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">What's Next?</h2>

        <div class="space-y-4">
          <div class="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-900/30 border border-gray-200 dark:border-slate-700/50">
            <div class="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center shrink-0">
              <Building2 class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Manage Your Organization</h3>
              <p class="text-sm text-gray-600 dark:text-slate-400">Update organization details, add team members, and configure settings.</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-900/30 border border-gray-200 dark:border-slate-700/50">
            <div class="w-10 h-10 rounded-lg bg-secondary-500/20 flex items-center justify-center shrink-0">
              <Calendar class="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Create More Events</h3>
              <p class="text-sm text-gray-600 dark:text-slate-400">Add new events, configure settings, and manage attendees.</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-900/30 border border-gray-200 dark:border-slate-700/50">
            <div class="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
              <CheckCircle class="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-1">Start Checking In Attendees</h3>
              <p class="text-sm text-gray-600 dark:text-slate-400">Use QR code scanning for fast and accurate check-ins at your events.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onclick={goToDashboard}
          disabled={isLoading}
          class="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Go to Dashboard
          <ArrowRight class="w-5 h-5" />
        </button>

        <a
          href="/"
          use:inertia
          class="px-8 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700/50 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-500/50 dark:focus:ring-slate-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 transition-all duration-200 flex items-center justify-center gap-2 text-center"
        >
          <Home class="w-5 h-5" />
          Home
        </a>
      </div>

      <p class="mt-8 text-center text-sm text-gray-500 dark:text-slate-500">
        Need help? Check out our documentation or contact support.
      </p>
    </div>
  </div>
</section>
