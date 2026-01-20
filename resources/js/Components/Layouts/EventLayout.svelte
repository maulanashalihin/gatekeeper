<script lang="ts">
  import { inertia } from '@inertiajs/svelte';
  import { ArrowLeft, Users, QrCode, BarChart3, Settings, Edit, User, Bell, LogOut, ChevronDown } from 'lucide-svelte';
  import DarkModeToggle from '../DarkModeToggle.svelte';

  let { group, event, orgUuid } = $props();
  let profileDropdownOpen = $state(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3, group: 'overview', href: () => `/organizations/${orgUuid}/events/${event.id}/dashboard` },
    { id: 'attendees', name: 'Attendees', icon: Users, group: 'attendees', href: () => `/organizations/${orgUuid}/events/${event.id}/attendees` },
    { id: 'checkin', name: 'Check-in', icon: QrCode, group: 'checkin', href: () => `/organizations/${orgUuid}/events/${event.id}/checkin` },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, group: 'analytics', href: () => `/organizations/${orgUuid}/events/${event.id}/analytics` },
    { id: 'edit', name: 'Edit', icon: Edit, group: 'edit', href: () => `/organizations/${orgUuid}/events/${event.id}/edit` },
    { id: 'settings', name: 'Settings', icon: Settings, group: 'settings', href: () => `/organizations/${orgUuid}/events/${event.id}/settings` },
  ];
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
  <!-- Top Navigation Bar -->
  <header class="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6">
      <div class="flex items-center gap-4">
        <a 
          href="/organizations/{orgUuid}/dashboard"
          class="    items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
        
        </a>
        <div class="h-6 w-px bg-slate-200 dark:border-slate-800"></div>
        <h1 class="text-lg font-semibold text-slate-900 dark:text-white">Event Dashboard</h1>
      
      </div>
      
      <div class="flex items-center gap-4">
      
        
        <!-- Dark Mode Toggle -->
        <DarkModeToggle />
        
        <!-- Profile Dropdown -->
        <div class="relative">
          <button 
            class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onclick={() => profileDropdownOpen = !profileDropdownOpen}
          >
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <User class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <ChevronDown class="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
          
          {#if profileDropdownOpen}
            <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-50">
              <a 
                href="/profile"
                class="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <User class="w-4 h-4" />
                Profile
              </a>
              <a 
                href="/logout"
                use:inertia="{{method : 'post'}}"
                class="flex items-center gap-2 px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut class="w-4 h-4" />
                Logout
              </a>
            </div>
          {/if}
        </div>
      </div>
    </div>
    
    <!-- Tab Navigation -->
    <div class="border-b border-slate-200 dark:border-slate-800">
      <nav class="flex gap-1 px-2 sm:px-4 pb-1a overflow-x-auto">
        {#if event && orgUuid}
          {#each tabs as tab}
            <a
              href={tab.href()}
              use:inertia
              class="flex items-center gap-2 px-3 py-2.5 min-w-max border-b-2 transition-colors {
                tab.group === group
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }"
            >
              {#if tab.icon}
                {@const Icon = tab.icon}
                <Icon class="w-5 h-5" />
              {/if}
              <span class="text-xs sm:text-sm font-medium">{tab.name}</span>
            </a>
          {/each}
        {/if}
      </nav>
    </div>
  </header>
  
  <!-- Page Content -->
  <main class="p-4 sm:p-6 lg:p-8">
    <slot />
  </main>
</div>

<style>
  /* Custom Scrollbar */
  :global(.overflow-x-auto)::-webkit-scrollbar {
    height: 4px;
  }

  :global(.overflow-x-auto)::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 2px;
  }

  :global(.overflow-x-auto)::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
    transition: background 0.2s;
  }

  :global(.overflow-x-auto)::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Dark Mode Scrollbar */
  @media (prefers-color-scheme: dark) {
    :global(.overflow-x-auto)::-webkit-scrollbar-thumb {
      background: #475569;
    }

    :global(.overflow-x-auto)::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }
  }

  :global(.dark .overflow-x-auto)::-webkit-scrollbar-thumb {
    background: #475569;
  }

  :global(.dark .overflow-x-auto)::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
</style>
