<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../Components/Layouts/EventLayout.svelte';
  import Alert from '../../Components/Alert.svelte';
  import Autocomplete from '../../Components/Autocomplete.svelte';
  import { ArrowLeft, Save, X } from 'lucide-svelte';

  let { event, orgUuid, flash } = $props();

  const isEdit = !!event;

  const formData = $state({
    name: event?.name || '',
    slug: event?.slug || '',
    description: event?.description || '',
    type: event?.type || 'conference',
    start_date: event?.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
    end_date: event?.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
    location: event?.location || '',
    city: event?.city || '',
    province: event?.province || '',
    venue: event?.venue || '',
    address: event?.address || '',
    capacity: event?.capacity || '',
    image: event?.image || '',
    is_public: event?.is_public ?? false,
    registration_open: event?.registration_open ?? true,
    registration_start: event?.registration_start ? new Date(event.registration_start).toISOString().slice(0, 16) : '',
    registration_end: event?.registration_end ? new Date(event.registration_end).toISOString().slice(0, 16) : '',
    checkin_start: event?.checkin_start ? new Date(event.checkin_start).toISOString().slice(0, 16) : '',
    checkin_end: event?.checkin_end ? new Date(event.checkin_end).toISOString().slice(0, 16) : '',
    entry_system: event?.entry_system || 'qr',
    status: event?.status || 'draft'
  });

  const generateSlug = () => {
    formData.slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (isEdit) {
      router.put(`/organizations/${orgUuid}/events/${event.id}`, formData);
    } else {
      router.post(`/organizations/${orgUuid}/events`, formData);
    }
  };
</script>

<EventLayout group="edit" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 sm:gap-4">
        <a href={`/organizations/${orgUuid}/events`} use:inertia class="p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition">
          <ArrowLeft class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </a>
        <div class="min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Event' : 'Create Event'}
          </h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? 'Update event information' : 'Create a new event for your organization'}
          </p>
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

    <!-- Form -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
      <form onsubmit={handleSubmit}>
        <div class="p-4 sm:p-6 space-y-6">
          <!-- Basic Information -->
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Event Name *</label>
                <input
                  type="text"
                  bind:value={formData.name}
                  onblur={generateSlug}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                  placeholder="Enter event name"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Slug *</label>
                <input
                  type="text"
                  bind:value={formData.slug}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                  placeholder="event-slug"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Event Type *</label>
                <select
                  bind:value={formData.type}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                  required
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
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  bind:value={formData.description}
                  rows="4"
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 resize-none"
                  placeholder="Enter event description"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Date & Time -->
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Date & Time</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date *</label>
                <input
                  type="datetime-local"
                  bind:value={formData.start_date}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Date *</label>
                <input
                  type="datetime-local"
                  bind:value={formData.end_date}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Location -->
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Location</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Autocomplete
                  value={formData.location}
                  label="Region"
                  placeholder="City or region"
                  apiUrl="/api/regions/search"
                  displayField="kota"
                  onChange={(value) => formData.location = value}
                  onSelect={(item) => {
                    formData.location = item.provinsi ? `${item.kota}, ${item.provinsi}` : item.kota;
                    formData.city = item.kota || '';
                    formData.province = item.provinsi || '';
                  }}
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Venue</label>
                <input
                  type="text"
                  bind:value={formData.venue}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                  placeholder="Venue name"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                <textarea
                  bind:value={formData.address}
                  rows="2"
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 resize-none"
                  placeholder="Full address"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Capacity</label>
                <input
                  type="number"
                  bind:value={formData.capacity}
                  min="1"
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                  placeholder="Max attendees"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Event Image URL</label>
                <input
                  type="url"
                  bind:value={formData.image}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Displayed as a banner image at the top of the event detail page. If not provided, a gradient background will be shown.
                </p>
              </div>
            </div>
          </div>

          <!-- Event Settings -->
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Event Settings</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Entry System</label>
                <select
                  bind:value={formData.entry_system}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                >
                  <option value="qr">QR Code</option>
                  <option value="manual">Manual Check-in</option>
                  <option value="kiosk">Self-service Kiosk</option>
                  <option value="bulk">Bulk Import</option>
                </select>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <strong>QR Code:</strong> Attendees scan QR code for check-in.<br>
                  <strong>Manual Check-in:</strong> Staff manually check-in attendees.<br>
                  <strong>Self-service Kiosk:</strong> Attendees check-in themselves at kiosk.<br>
                  <strong>Bulk Import:</strong> Import attendees from external source.
                </p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  bind:value={formData.status}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <strong>Draft:</strong> Not visible to public, still being prepared.<br>
                  <strong>Published:</strong> Visible and accepting registrations.<br>
                  <strong>Ongoing:</strong> Event is currently happening.<br>
                  <strong>Completed:</strong> Event has finished.<br>
                  <strong>Cancelled:</strong> Event was cancelled.
                </p>
              </div>
              <div class="sm:col-span-2">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    bind:checked={formData.is_public}
                    class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <div class="flex-1">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Public Event</span>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Make this event visible to everyone. When disabled, only organization members can see and access this event.
                    </p>
                  </div>
                </label>
              </div>
              <div class="sm:col-span-2">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    bind:checked={formData.registration_open}
                    class="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Registration Open</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Registration Period -->
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Registration Period</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Registration Start</label>
                <input
                  type="datetime-local"
                  bind:value={formData.registration_start}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Registration End</label>
                <input
                  type="datetime-local"
                  bind:value={formData.registration_end}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <!-- Check-in Period -->
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Check-in Period</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Check-in Start</label>
                <input
                  type="datetime-local"
                  bind:value={formData.checkin_start}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Check-in End</label>
                <input
                  type="datetime-local"
                  bind:value={formData.checkin_end}
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700 flex gap-3">
          <a href={`/organizations/${orgUuid}/events`} use:inertia class="flex-1 px-4 sm:px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-600 font-semibold text-sm text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition min-h-[44px] flex items-center justify-center">
            Cancel
          </a>
          <button type="submit" class="flex-1 px-4 sm:px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md flex items-center justify-center gap-2 min-h-[44px]">
            <Save class="w-4 h-4" />
            {isEdit ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  </div>
</EventLayout>
