<script lang="ts">
  import { page, inertia } from '@inertiajs/svelte';
  import { Home, User, Building2, LogOut, Bell, ChevronRight, Menu, X, ChevronDown } from 'lucide-svelte';
  import DarkModeToggle from '../DarkModeToggle.svelte';
  
  let sidebarOpen = $state(true);
  let profileDropdownOpen = $state(false);
  let { group, children } = $props();
  
  const navigation = $derived([
    { name: 'Home', href: '/home', icon: Home, group: 'home' },
    { name: 'Organizations', href: '/organizations', icon: Building2, group: 'organizations' },
    { name: 'Profile', href: '/profile', icon: User, group: 'profile' },
  ]);
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
  <!-- Mobile Sidebar Overlay -->
  {#if !sidebarOpen}
    <div 
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      onclick={() => sidebarOpen = true}
    ></div>
  {/if}
  
  <!-- Sidebar -->
  <aside 
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:translate-x-0 {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
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
        onclick={() => sidebarOpen = false}
      >
        <X class="w-5 h-5" />
      </button>
    </div>
    
    <!-- Navigation -->
    <nav class="p-4 space-y-1">
      {#each navigation as item}
        <a 
          href={item.href}
          use:inertia
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors {
            item.group === group 
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }"
        >
          {#if item.icon}
            {@const Icon = item.icon}
            <Icon class="w-5 h-5" />
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
          <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{$page.props.auth?.user?.name || 'User'}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{$page.props.auth?.user?.email || ''}</p>
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
            onclick={() => sidebarOpen = false}
          >
            <Menu class="w-5 h-5" />
          </button>
          <h1 class="text-lg font-semibold text-slate-900 dark:text-white">My Dashboard</h1>
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
                  use:inertia
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
    </header>
    
    <!-- Page Content -->
    <main class="p-4 sm:p-6 lg:p-8">
      {@render children?.()}
    </main>
  </div>
</div>
