<script lang="ts">
  import SuperAdminLayout from '../../Components/Layouts/SuperAdminLayout.svelte';
  import { Settings, Shield, Bell, Database, Globe, Save } from 'lucide-svelte';
  import { router } from '@inertiajs/svelte';

  let settings = $state({
    siteName: 'GateKeeper',
    siteUrl: 'https://gatekeeper.com',
    allowRegistration: true,
    requireEmailVerification: true,
    maxOrganizationsPerUser: 5,
    defaultEventCapacity: 100,
    maintenanceMode: false
  });

  let activeTab = $state('general');
</script>

<SuperAdminLayout group="settings">
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
      <p class="text-slate-600 dark:text-slate-400 mt-1">Configure platform-wide settings</p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-slate-200 dark:border-slate-800">
      <nav class="flex gap-8">
        <button
          class="pb-4 text-sm font-medium border-b-2 transition-colors {activeTab === 'general' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
          onclick={() => activeTab = 'general'}
        >
          General
        </button>
        <button
          class="pb-4 text-sm font-medium border-b-2 transition-colors {activeTab === 'security' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
          onclick={() => activeTab = 'security'}
        >
          Security
        </button>
        <button
          class="pb-4 text-sm font-medium border-b-2 transition-colors {activeTab === 'notifications' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
          onclick={() => activeTab = 'notifications'}
        >
          Notifications
        </button>
      </nav>
    </div>

    <!-- General Settings -->
    {#if activeTab === 'general'}
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
            <Globe class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">General Settings</h2>
            <p class="text-sm text-slate-600 dark:text-slate-400">Platform-wide configuration</p>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Site Name</label>
            <input
              type="text"
              bind:value={settings.siteName}
              class="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Site URL</label>
            <input
              type="url"
              bind:value={settings.siteUrl}
              class="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Organizations Per User</label>
            <input
              type="number"
              bind:value={settings.maxOrganizationsPerUser}
              class="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Default Event Capacity</label>
            <input
              type="number"
              bind:value={settings.defaultEventCapacity}
              class="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div>
              <div class="font-medium text-slate-900 dark:text-white">Maintenance Mode</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Temporarily disable the platform</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                bind:checked={settings.maintenanceMode}
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>
    {/if}

    <!-- Security Settings -->
    {#if activeTab === 'security'}
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <Shield class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Security Settings</h2>
            <p class="text-sm text-slate-600 dark:text-slate-400">Authentication and security configuration</p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div>
              <div class="font-medium text-slate-900 dark:text-white">Allow Registration</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Enable new user registration</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                bind:checked={settings.allowRegistration}
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div>
              <div class="font-medium text-slate-900 dark:text-white">Require Email Verification</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">Users must verify their email</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                bind:checked={settings.requireEmailVerification}
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>
    {/if}

    <!-- Notifications Settings -->
    {#if activeTab === 'notifications'}
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
            <Bell class="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Notification Settings</h2>
            <p class="text-sm text-slate-600 dark:text-slate-400">Email and system notifications</p>
          </div>
        </div>

        <div class="text-center py-8 text-slate-500 dark:text-slate-400">
          Notification settings coming soon
        </div>
      </div>
    {/if}

    <!-- Save Button -->
    <div class="flex justify-end">
      <button
        class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
        onclick={() => alert('Settings saved!')}
      >
        <Save class="w-4 h-4" />
        Save Settings
      </button>
    </div>
  </div>
</SuperAdminLayout>
