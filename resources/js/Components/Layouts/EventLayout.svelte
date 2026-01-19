<script lang="ts">
  import { page } from '@inertiajs/svelte';
  import { ArrowLeft, Users, QrCode, BarChart3, Settings, User, Bell, Menu, X } from 'lucide-svelte';
  import DarkModeToggle from '../DarkModeToggle.svelte';
  
  let sidebarOpen = $state(true);
  let activeTab = $state('overview');
  let { group } = $props();
  
  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3, group: 'overview' },
    { id: 'attendees', name: 'Attendees', icon: Users, group: 'attendees' },
    { id: 'checkin', name: 'Check-in', icon: QrCode, group: 'checkin' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, group: 'analytics' },
    { id: 'settings', name: 'Settings', icon: Settings, group: 'settings' },
  ];
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
  <!-- Mobile Sidebar Overlay -->
  {#if !sidebarOpen}
    <div 
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      on:click={() => sidebarOpen = true}
    ></div>
  {/if}
  
  <!-- Top Navigation Bar -->
  <header class="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6">
      <div class="flex items-center gap-4">
        <button 
          class="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          on:click={() => sidebarOpen = false}
        >
          <Menu class="w-5 h-5" />
        </button>
        <a 
          href="/dashboard"
          class="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
          Back to Organization
        </a>
        <div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
        <h1 class="text-lg font-semibold text-slate-900 dark:text-white">Event Dashboard</h1>
        <span class="px-2 py-1 text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400 rounded-full">Published</span>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- Notifications -->
        <button class="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <Bell class="w-5 h-5" />
          <span class="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
        </button>
        
        <!-- Dark Mode Toggle -->
        <DarkModeToggle />
        
        <!-- Profile Dropdown -->
        <div class="relative">
          <button class="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <User class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Tab Navigation -->
    <div class="border-b border-slate-200 dark:border-slate-800">
      <nav class="flex gap-1 px-4 sm:px-6 overflow-x-auto">
        {#each tabs as tab}
          <button
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors {
              tab.group === group
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }"
            onclick={() => activeTab = tab.id}
          >
            {#if tab.icon}
              <svelte:component this={tab.icon} class="w-4 h-4" />
            {/if}
            {tab.name}
          </button>
        {/each}
      </nav>
    </div>
  </header>
  
  <!-- Page Content -->
  <main class="p-4 sm:p-6 lg:p-8">
    <slot />
  </main>
</div>
