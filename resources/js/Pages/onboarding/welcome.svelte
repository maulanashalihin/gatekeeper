<script>
  import { router, inertia } from '@inertiajs/svelte'
  import { Rocket, Users, Calendar, CheckCircle, ArrowRight } from 'lucide-svelte'
  import DarkModeToggle from '../../Components/DarkModeToggle.svelte'

  let { user, flash } = $props()
  let isLoading = $state(false)

  function startOnboarding() {
    isLoading = true
    router.get('/onboarding/step/1')
  }

  function skipOnboarding() {
    isLoading = true
    router.post('/onboarding/skip')
  }
</script>

<section class="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 dark:bg-secondary-500/20 rounded-full blur-3xl"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
  </div>

  <div class="w-full flex items-center justify-center p-6 lg:p-12">
    <div class="w-full max-w-4xl relative z-10">
      <div class="absolute top-0 right-0">
        <DarkModeToggle />
      </div>
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 mb-6 shadow-lg shadow-primary-500/30">
          <Rocket class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to GateKeeper!
        </h1>
        <p class="text-gray-600 dark:text-slate-400 text-lg lg:text-xl max-w-2xl mx-auto">
          Let's set up your account in just a few simple steps. You'll be ready to manage your events in no time.
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

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-slate-700/50 p-6 hover:border-primary-500/50 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
            <Users class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Create Organization</h3>
          <p class="text-gray-600 dark:text-slate-400 text-sm">Set up your organization to manage events and team members.</p>
        </div>

        <div class="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-slate-700/50 p-6 hover:border-primary-500/50 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-secondary-500/20 flex items-center justify-center mb-4">
            <Calendar class="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Add Your First Event</h3>
          <p class="text-gray-600 dark:text-slate-400 text-sm">Create your first event and configure its settings.</p>
        </div>

        <div class="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-slate-700/50 p-6 hover:border-primary-500/50 transition-all duration-300">
          <div class="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center mb-4">
            <CheckCircle class="w-6 h-6 text-success" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Invite Team</h3>
          <p class="text-gray-600 dark:text-slate-400 text-sm">Add team members by email to help manage your events.</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onclick={startOnboarding}
          disabled={isLoading}
          class="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Get Started
          <ArrowRight class="w-5 h-5" />
        </button>

        <button
          onclick={skipOnboarding}
          disabled={isLoading}
          class="px-8 py-4 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700/50 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-500/50 dark:focus:ring-slate-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Skip for Now
        </button>
      </div>

      <p class="mt-8 text-center text-sm text-gray-500 dark:text-slate-500">
        You can always complete setup later from your dashboard.
      </p>
    </div>
  </div>
</section>
