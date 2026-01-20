<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../Components/Layouts/EventLayout.svelte';
  import Alert from '../../Components/Alert.svelte';
  import { ArrowLeft, Save, X, Mail, Shield, Clock, Globe } from 'lucide-svelte';

  let { event, eventSettings, orgUuid, flash } = $props();

  const formData = $state({
    require_approval: eventSettings?.require_approval ?? false,
    custom_fields: eventSettings?.custom_fields ? JSON.stringify(eventSettings.custom_fields) : '',
    allow_self_registration: eventSettings?.allow_self_registration ?? true,
    allow_duplicate_checkin: eventSettings?.allow_duplicate_checkin ?? false,
    require_verification: eventSettings?.require_verification ?? false,
    send_confirmation_email: eventSettings?.send_confirmation_email ?? true,
    send_qr_email: eventSettings?.send_qr_email ?? true,
    timezone: eventSettings?.timezone || 'UTC',
    locale: eventSettings?.locale || 'en'
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    router.put(`/organizations/${orgUuid}/events/${event.id}/settings`, formData);
  };
</script>

<EventLayout group="settings" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 sm:gap-4">
        <a href={`/organizations/${orgUuid}/events/${event.id}/dashboard`} use:inertia class="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </a>
        <div class="min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Event Settings</h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Configure event settings and preferences</p>
        </div>
      </div>
    </div>

    <!-- Flash Messages -->
    {#if flash?.error}
      <Alert type="error" message={flash.error} />
    {/if}

    {#if flash?.success}
      <Alert type="success" message={flash.success} />
    {/if}

    <!-- Settings Form -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
      <form onsubmit={handleSubmit}>
        <div class="p-4 sm:p-6 space-y-6 sm:space-y-8">
          <!-- Registration Settings -->
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail class="w-5 h-5 text-primary-500" />
              Registration Settings
            </h2>
            <div class="space-y-4">
              <label class="flex items-start sm:items-center justify-between cursor-pointer gap-3">
                <div class="flex-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Require Approval</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Registrations need admin approval</p>
                </div>
                <input
                  type="checkbox"
                  bind:checked={formData.require_approval}
                  class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500 flex-shrink-0 mt-0.5 sm:mt-0"
                />
              </label>
              <label class="flex items-start sm:items-center justify-between cursor-pointer gap-3">
                <div class="flex-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Self Registration</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow users to register themselves</p>
                </div>
                <input
                  type="checkbox"
                  bind:checked={formData.allow_self_registration}
                  class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500 flex-shrink-0 mt-0.5 sm:mt-0"
                />
              </label>
            </div>
          </div>

          <!-- Check-in Settings -->
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield class="w-5 h-5 text-primary-500" />
              Check-in Settings
            </h2>
            <div class="space-y-4">
              <label class="flex items-start sm:items-center justify-between cursor-pointer gap-3">
                <div class="flex-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Allow Duplicate Check-in</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Allow attendees to check in multiple times</p>
                </div>
                <input
                  type="checkbox"
                  bind:checked={formData.allow_duplicate_checkin}
                  class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500 flex-shrink-0 mt-0.5 sm:mt-0"
                />
              </label>
              <label class="flex items-start sm:items-center justify-between cursor-pointer gap-3">
                <div class="flex-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Require Verification</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Require additional verification at check-in</p>
                </div>
                <input
                  type="checkbox"
                  bind:checked={formData.require_verification}
                  class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500 flex-shrink-0 mt-0.5 sm:mt-0"
                />
              </label>
            </div>
          </div>

          <!-- Notification Settings -->
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail class="w-5 h-5 text-primary-500" />
              Notification Settings
            </h2>
            <div class="space-y-4">
              <label class="flex items-start sm:items-center justify-between cursor-pointer gap-3">
                <div class="flex-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Send Confirmation Email</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Send email when registration is confirmed</p>
                </div>
                <input
                  type="checkbox"
                  bind:checked={formData.send_confirmation_email}
                  class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500 flex-shrink-0 mt-0.5 sm:mt-0"
                />
              </label>
              <label class="flex items-start sm:items-center justify-between cursor-pointer gap-3">
                <div class="flex-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Send QR Code Email</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Send QR code via email after registration</p>
                </div>
                <input
                  type="checkbox"
                  bind:checked={formData.send_qr_email}
                  class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500 flex-shrink-0 mt-0.5 sm:mt-0"
                />
              </label>
            </div>
          </div>

          <!-- Localization Settings -->
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe class="w-5 h-5 text-primary-500" />
              Localization
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                <select
                  bind:value={formData.timezone}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  <option value="Asia/Singapore">Asia/Singapore</option>
                  <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Europe/Paris">Europe/Paris</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Locale</label>
                <select
                  bind:value={formData.locale}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                >
                  <option value="en">English</option>
                  <option value="id">Indonesian</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Custom Fields -->
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Custom Fields</h2>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Custom Fields (JSON)</label>
              <textarea
                bind:value={formData.custom_fields}
                rows="6"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 resize-none font-mono text-xs sm:text-sm"
                placeholder="Enter custom fields in JSON format"
              ></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Define custom fields for registration form in JSON format
              </p>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700 flex gap-3">
          <a href={`/organizations/${orgUuid}/events/${event.id}/dashboard`} use:inertia class="flex-1 px-4 sm:px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-600 font-semibold text-sm text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition min-h-[44px] flex items-center justify-center">
            Cancel
          </a>
          <button type="submit" class="flex-1 px-4 sm:px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md flex items-center justify-center gap-2 min-h-[44px]">
            <Save class="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  </div>
</EventLayout>
