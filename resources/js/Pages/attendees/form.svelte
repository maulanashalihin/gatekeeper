<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../Components/Layouts/EventLayout.svelte';
  import Alert from '../../Components/Alert.svelte';
  import { ArrowLeft, Save, X, User, Mail, Phone } from 'lucide-svelte';

  let { attendee, event, orgUuid, flash } = $props();

  const isEdit = !!attendee;

  const formData = $state({
    name: attendee?.name || '',
    email: attendee?.email || '',
    phone: attendee?.phone || '',
    notes: attendee?.notes || ''
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const cleanedData = {
      name: formData.name || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      notes: formData.notes || undefined
    };
    if (isEdit) {
      router.put(`/organizations/${orgUuid}/events/${event.id}/attendees/${attendee.id}`, cleanedData);
    } else {
      router.post(`/organizations/${orgUuid}/events/${event.id}/attendees`, cleanedData);
    }
  };
</script>

<EventLayout group="attendees" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-3">
        <a href={`/organizations/${orgUuid}/events/${event.id}/attendees`} use:inertia class="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </a>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Attendee' : 'Add Attendee'}
          </h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update attendee information' : 'Add a new attendee to this event'}
          </p>
        </div>
      </div>
    </div>

    <!-- Flash Messages -->
    {#if flash?.error}
      <Alert type="error" message={flash.error} />
    {/if}

    <!-- Form -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
      <form onsubmit={handleSubmit}>
        <div class="p-4 sm:p-6 space-y-6">
          <!-- Personal Information -->
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                <div class="relative">
                  <User class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    bind:value={formData.name}
                    class="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div class="relative">
                  <Mail class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    bind:value={formData.email}
                    class="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <div class="relative">
                  <Phone class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    bind:value={formData.phone}
                    class="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes</label>
            <textarea
              bind:value={formData.notes}
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 h-32"
              placeholder="Add any notes about this attendee..."
            ></textarea>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <a href={`/organizations/${orgUuid}/events/${event.id}/attendees`} use:inertia class="flex-1 px-6 py-3.5 rounded-xl border border-gray-300 dark:border-slate-600 font-semibold text-sm text-gray-700 dark:text-gray-300 text-center hover:bg-gray-50 dark:hover:bg-slate-700 transition min-h-[44px] flex items-center justify-center">
            Cancel
          </a>
          <button type="submit" class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md min-h-[44px]">
            <Save class="w-4 h-4" />
            {isEdit ? 'Update Attendee' : 'Add Attendee'}
          </button>
        </div>
      </form>
    </div>
  </div>
</EventLayout>
