<script>
  import { router, inertia } from '@inertiajs/svelte'
  import { Building2, Calendar, Users, ArrowLeft, ArrowRight, Check, SkipForward, Mail, Plus, X } from 'lucide-svelte'
  import Alert from '../../Components/Alert.svelte'
  import DarkModeToggle from '../../Components/DarkModeToggle.svelte'
  import Autocomplete from '../../Components/Autocomplete.svelte'

  let { user, step, organizations, events, flash } = $props()
  let isLoading = $state(false)

  let formData = $state({
    name: '',
    description: '',
    type: 'conference',
    start_date: '',
    end_date: '',
    location: '',
    city: '',
    province: '',
    venue: '',
    skip_event: false,
    skip_team: false,
    emails: ['']
  })

  function addEmailField() {
    formData.emails.push('')
  }

  function removeEmailField(index) {
    formData.emails.splice(index, 1)
  }

  function submitStep() {
    isLoading = true
    router.post(`/onboarding/step/${step}`, formData, {
      onFinish: () => isLoading = false
    })
  }

  function goBack() {
    if (step > 1) {
      router.get(`/onboarding/step/${step - 1}`)
    } else {
      router.get('/onboarding')
    }
  }
</script>

<section class="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 dark:bg-secondary-500/20 rounded-full blur-3xl"></div>
  </div>

  <div class="w-full flex items-center justify-center p-6 lg:p-12">
    <div class="w-full max-w-2xl relative z-10">
      <div class="flex justify-between items-center mb-8">
        <button
          onclick={goBack}
          class="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          Back
        </button>
        <DarkModeToggle />
        <div class="w-16"></div>
      </div>

        <div class="flex items-center gap-2 mb-4">
          {#each [1, 2, 3] as s}
            <div class="flex-1 h-2 rounded-full {s <= step ? 'bg-primary-500' : 'bg-gray-300 dark:bg-slate-700'} transition-colors"></div>
          {/each}
        </div>

        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {#if step === 1}
            Create Your Organization
          {:else if step === 2}
            Create Your First Event
          {:else if step === 3}
            Invite Team Members
          {/if}
        </h2>
        <p class="text-gray-600 dark:text-slate-400">
          {#if step === 1}
            Step 1 of 3: Let's start by creating your organization
          {:else if step === 2}
            Step 2 of 3: Add your first event
          {:else if step === 3}
            Step 3 of 3: Add team members (optional)
          {/if}
        </p>

      {#if flash?.error}
        <Alert type="error" message={flash.error} />
      {/if}

      <div class="bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-slate-700/50 p-8 shadow-xl">
        {#if step === 1}
          <form onsubmit={(e) => { e.preventDefault(); submitStep(); }} class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Organization Name *</label>
              <input
                bind:value={formData.name}
                required
                type="text"
                placeholder="My Company"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Description</label>
              <textarea
                bind:value={formData.description}
                rows="3"
                placeholder="Tell us about your organization..."
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {#if isLoading}
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              {:else}
                Continue
                <ArrowRight class="w-5 h-5" />
              {/if}
            </button>
          </form>
        {:else if step === 2}
          <form onsubmit={(e) => { e.preventDefault(); submitStep(); }} class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Event Name *</label>
              <input
                bind:value={formData.name}
                required={!formData.skip_event}
                type="text"
                placeholder="Tech Summit 2025"
                disabled={formData.skip_event}
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Event Type *</label>
              <select
                bind:value={formData.type}
                required={!formData.skip_event}
                disabled={formData.skip_event}
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="concert">Concert</option>
                <option value="seminar">Seminar</option>
                <option value="webinar">Webinar</option>
                <option value="meetup">Meetup</option>
                <option value="exhibition">Exhibition</option>
                <option value="sports">Sports</option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Start Date & Time *</label>
                <input
                  bind:value={formData.start_date}
                  required={!formData.skip_event}
                  type="datetime-local"
                  disabled={formData.skip_event}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">End Date & Time *</label>
                <input
                  bind:value={formData.end_date}
                  required={!formData.skip_event}
                  type="datetime-local"
                  disabled={formData.skip_event}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <Autocomplete
                value={formData.location}
                label="Region"
                placeholder="City or region"
                apiUrl="/api/regions/search"
                displayField="kota"
                disabled={formData.skip_event}
                onChange={(value) => formData.location = value}
                onSelect={(item) => {
                  formData.location = item.provinsi ? `${item.kota}, ${item.provinsi}` : item.kota;
                  formData.city = item.kota || '';
                  formData.province = item.provinsi || '';
                }}
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Venue</label>
              <input
                bind:value={formData.venue}
                type="text"
                placeholder="Convention Center"
                disabled={formData.skip_event}
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <label class="flex items-center gap-3 p-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/30 hover:border-primary-500 cursor-pointer transition-all duration-200">
              <input
                type="checkbox"
                bind:checked={formData.skip_event}
                class="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-primary-500 focus:ring-primary-500"
              />
              <SkipForward class="w-5 h-5 text-gray-500 dark:text-slate-400" />
              <div>
                <div class="font-semibold text-gray-900 dark:text-white">Skip event creation</div>
                <div class="text-sm text-gray-600 dark:text-slate-400">You can add events later from your dashboard</div>
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {#if isLoading}
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              {:else}
                Continue
                <ArrowRight class="w-5 h-5" />
              {/if}
            </button>
          </form>
        {:else if step === 3}
          <form onsubmit={(e) => { e.preventDefault(); submitStep(); }} class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Team Member Emails</label>
              <p class="text-sm text-gray-600 dark:text-slate-500 mb-4">Add existing users by email. They will be added as staff members.</p>
              
              <div class="space-y-3">
                {#each formData.emails as email, index}
                  <div class="flex gap-2">
                    <div class="relative flex-1">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail class="w-5 h-5 text-gray-500 dark:text-slate-500" />
                      </div>
                      <input
                        bind:value={formData.emails[index]}
                        type="email"
                        placeholder="team@example.com"
                        disabled={formData.skip_team}
                        class="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    {#if formData.emails.length > 1}
                      <button
                        type="button"
                        onclick={() => removeEmailField(index)}
                        disabled={formData.skip_team}
                        class="px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/30 text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X class="w-5 h-5" />
                      </button>
                    {/if}
                  </div>
                {/each}
              </div>

              <button
                type="button"
                onclick={addEmailField}
                disabled={formData.skip_team}
                class="mt-3 flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus class="w-4 h-4" />
                Add another email
              </button>
            </div>

            <label class="flex items-center gap-3 p-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/30 hover:border-primary-500 cursor-pointer transition-all duration-200">
              <input
                type="checkbox"
                bind:checked={formData.skip_team}
                class="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-primary-500 focus:ring-primary-500"
              />
              <SkipForward class="w-5 h-5 text-gray-500 dark:text-slate-400" />
              <div>
                <div class="font-semibold text-gray-900 dark:text-white">Skip team invitation</div>
                <div class="text-sm text-gray-600 dark:text-slate-400">You can add team members later from your dashboard</div>
              </div>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {#if isLoading}
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Completing...
              {:else}
                Complete Setup
                <Check class="w-5 h-5" />
              {/if}
            </button>
          </form>
        {/if}
      </div>
    </div>
  </div>
</section>
