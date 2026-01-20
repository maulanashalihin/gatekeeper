<script>
  import { inertia } from '@inertiajs/svelte'
  import { fly, fade } from 'svelte/transition'
  import { page } from '@inertiajs/svelte'
  import UserLayout from '../Components/Layouts/UserLayout.svelte'
  import { Building2, Calendar, Users, QrCode, ArrowRight, Plus, CheckCircle, Shield, Zap } from 'lucide-svelte'
  
  let { user, organizations } = $props()

  let features = [
    {
      title: "Event Management",
      description: "Create and manage events with ease",
      icon: Calendar
    },
    {
      title: "Smart Check-in",
      description: "QR code-based attendee check-in system",
      icon: QrCode
    },
    {
      title: "Team Collaboration",
      description: "Invite team members and assign roles",
      icon: Users
    },
    {
      title: "Real-time Analytics",
      description: "Track attendance and event insights",
      icon: CheckCircle
    },
    {
      title: "Secure Platform",
      description: "Enterprise-grade security for your data",
      icon: Shield
    },
    {
      title: "Fast Performance",
      description: "Built for speed and reliability",
      icon: Zap
    }
  ]
</script>

<UserLayout group="home">
  <!-- Hero Section -->
  <div class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
    <div class="absolute top-0 -left-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:mix-blend-normal dark:opacity-10"></div>
    <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:mix-blend-normal dark:opacity-10"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="text-center" in:fly={{ y: 20, duration: 800, delay: 200 }}>
        <div class="flex justify-center mb-6">
          <div class="flex items-center gap-3">
            <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="35" height="35" rx="8" fill="white" fill-opacity="0.9"/>
                <rect x="55" y="10" width="35" height="35" rx="8" fill="white" fill-opacity="0.9"/>
                <rect x="10" y="55" width="35" height="35" rx="8" fill="white" fill-opacity="0.9"/>
                <rect x="55" y="55" width="35" height="35" rx="8" fill="white" fill-opacity="0.9"/>
              </svg>
            </div>
            <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              GateKeeper
            </h1>
          </div>
        </div>
        <p class="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
          Modern event management platform with smart check-in and team collaboration features
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/organizations/create"
            use:inertia
            class="inline-flex items-center justify-center px-8 py-4 text-white bg-primary-600 hover:bg-primary-700 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
          >
            <Plus class="w-5 h-5 mr-2" />
            Create Organization
          </a>
          <a
            href="/organizations"
            use:inertia
            class="inline-flex items-center justify-center px-8 py-4 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl font-bold transition-colors"
          >
            View Organizations
            <ArrowRight class="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Actions - Your Organizations -->
  {#if organizations && organizations.length > 0}
    <div class="py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Your Organizations
            </h2>
            <p class="text-slate-600 dark:text-slate-400">
              Quick access to your organizations
            </p>
          </div>
          <a
            href="/organizations"
            use:inertia
            class="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg font-medium transition-colors"
          >
            View All
            <ArrowRight class="w-4 h-4" />
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each organizations as org}
            <a
              href={`/organizations/${org.id}/dashboard`}
              use:inertia
              class="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-600 capitalize">
                  {org.role}
                </span>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {org.name}
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {org.description || 'No description'}
              </p>
              <div class="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <ArrowRight class="w-4 h-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Open Dashboard
              </div>
            </a>
          {/each}
        </div>

        <div class="mt-6 text-center sm:hidden">
          <a
            href="/organizations"
            use:inertia
            class="inline-flex items-center gap-2 px-6 py-3 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg font-medium transition-colors"
          >
            View All Organizations
            <ArrowRight class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  {/if}

  <!-- Features Section -->
  <div class="py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Powerful Features
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Everything you need to manage events efficiently
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each features as feature, i}
          {@const Icon = feature.icon}
          <div 
            class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:shadow-lg transition-all duration-300 group"
            in:fly={{ y: 20, duration: 800, delay: 200 + (i * 100) }}
          >
            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              {feature.description}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- CTA Section -->
  <div class="py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-primary-500/20">
        <div in:fly={{ y: 20, duration: 800 }}>
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p class="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Create your first organization and start managing events with GateKeeper
          </p>
          <a
            href="/organizations/create"
            use:inertia
            class="inline-flex items-center px-8 py-4 text-primary-600 bg-white hover:bg-slate-50 rounded-xl font-bold transition-all shadow-lg"
          >
            <Plus class="w-5 h-5 mr-2" />
            Create Organization
          </a>
        </div>
      </div>
    </div>
  </div>
</UserLayout>