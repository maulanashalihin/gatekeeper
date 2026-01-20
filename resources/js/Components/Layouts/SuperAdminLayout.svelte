<script lang="ts">
  import { page } from '@inertiajs/svelte';
  import { Home, Users, BarChart3, Settings, LogOut, User, Bell, ChevronRight, Menu, X } from 'lucide-svelte';
  import DarkModeToggle from '../DarkModeToggle.svelte';
  
  let sidebarOpen = $state(true);
  let { group } = $props();
  
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home, group: 'dashboard' },
    { name: 'Organizations', href: '/admin/organizations', icon: Users, group: 'organizations' },
    { name: 'Users', href: '/admin/users', icon: User, group: 'users' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, group: 'analytics' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, group: 'settings' },
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
  
  <!-- Sidebar -->
  <aside 
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:translate-x-0 {sidebarOpen ? '-translate-x-full' : 'translate-x-0'}"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-2">
           <div class="w-8 h-8 flex items-center justify-center">
         <img src="/public/icon-gk.webp" alt="" class="dark:invert dark:brightness-0 dark:contrast-100">
        </div>
        <span class="font-display font-semibold text-slate-900 dark:text-white">GateKeeper</span>
      </div>
      <button 
        class="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        on:click={() => sidebarOpen = true}
      >
        <X class="w-5 h-5" />
      </button>
    </div>
    
    <!-- Navigation -->
    <nav class="p-4 space-y-1">
      {#each navigation as item}
        <a 
          href={item.href}
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors {
            item.group === group 
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }"
        >
          {#if item.icon}
            <svelte:component this={item.icon} class="w-5 h-5" />
          {/if}
          {item.name}
          {#if item.group === group}
            <ChevronRight class="ml-auto w-4 h-4" />
          {/if}
        </a>
      {/each}
    </nav>
    
    <!-- User Section -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
          <User class="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-900 dark:text-white truncate">Super Admin</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">admin@gatekeeper.com</p>
        </div>
      </div>
    </div>
  </aside>
  
  <!-- Main Content -->
  <div class="lg:pl-64">
    <!-- Top Header -->
    <header class="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center justify-between h-16 px-4 sm:px-6">
        <div class="flex items-center gap-4">
          <button 
            class="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            on:click={() => sidebarOpen = false}
          >
            <Menu class="w-5 h-5" />
          </button>
          <h1 class="text-lg font-semibold text-slate-900 dark:text-white">Super Admin Dashboard</h1>
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
    </header>
    
    <!-- Page Content -->
    <main class="p-4 sm:p-6 lg:p-8">
      <slot />
    </main>
  </div>
</div>
