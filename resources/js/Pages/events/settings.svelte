<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../Components/Layouts/EventLayout.svelte';
  import Alert from '../../Components/Alert.svelte';
  import { ArrowLeft, Save, X, Mail, Shield, Clock, Globe, Plus, Edit2, Trash2 } from 'lucide-svelte';

  let { event, eventSettings, orgUuid, flash } = $props();

  interface CustomField {
    name: string;
    label: string;
    type: 'text' | 'select' | 'textarea' | 'checkbox';
    required: boolean;
    options?: string[];
  }

  const formData = $state({
    require_approval: eventSettings?.require_approval ?? false,
    custom_fields: eventSettings?.custom_fields ? JSON.stringify(eventSettings.custom_fields) : '',
    allow_self_registration: eventSettings?.allow_self_registration ?? true,
    enable_gender: eventSettings?.enable_gender ?? false,
    allow_duplicate_checkin: eventSettings?.allow_duplicate_checkin ?? false,
    require_verification: eventSettings?.require_verification ?? false,
    send_confirmation_email: eventSettings?.send_confirmation_email ?? true,
    send_qr_email: eventSettings?.send_qr_email ?? true,
    timezone: eventSettings?.timezone || 'UTC',
    locale: eventSettings?.locale || 'en'
  });

  let customFields = $state<CustomField[]>(
    eventSettings?.custom_fields ? JSON.parse(JSON.stringify(eventSettings.custom_fields)) : []
  );

  let showAddForm = $state(false);
  let editingField = $state<number | null>(null);
  let newField = $state<CustomField>({
    name: '',
    label: '',
    type: 'text',
    required: false,
    options: []
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      custom_fields: JSON.stringify(customFields)
    };
    router.put(`/organizations/${orgUuid}/events/${event.id}/settings`, submitData);
  };

  const addField = () => {
    if (!newField.name || !newField.label) return;
    
    if (newField.type === 'select' && (!newField.options || newField.options.length === 0)) {
      alert('Please add at least one option for select field');
      return;
    }
    
    customFields = [...customFields, { ...newField }];
    resetForm();
  };

  const editField = (index: number) => {
    editingField = index;
    newField = { ...customFields[index] };
    showAddForm = true;
  };

  const updateField = () => {
    if (editingField === null) return;
    if (!newField.name || !newField.label) return;
    
    if (newField.type === 'select' && (!newField.options || newField.options.length === 0)) {
      alert('Please add at least one option for select field');
      return;
    }
    
    customFields = customFields.map((field, i) => i === editingField ? { ...newField } : field);
    resetForm();
  };

  const deleteField = (index: number) => {
    if (confirm('Are you sure you want to delete this field?')) {
      customFields = customFields.filter((_, i) => i !== index);
    }
  };

  const resetForm = () => {
    newField = {
      name: '',
      label: '',
      type: 'text',
      required: false,
      options: []
    };
    showAddForm = false;
    editingField = null;
  };

  const addOption = () => {
    const optionInput = prompt('Enter option value:');
    if (optionInput && optionInput.trim()) {
      newField.options = [...(newField.options || []), optionInput.trim()];
    }
  };

  const removeOption = (index: number) => {
    newField.options = newField.options?.filter((_, i) => i !== index);
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
              <label class="flex items-start sm:items-center justify-between cursor-pointer gap-3">
                <div class="flex-1">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Gender Field</span>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Show gender field in registration form</p>
                </div>
                <input
                  type="checkbox"
                  bind:checked={formData.enable_gender}
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
            
            <!-- Custom Fields List -->
            <div class="space-y-3 mb-4">
              {#each customFields as field, index}
                <div class="flex items-start justify-between p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-semibold text-gray-900 dark:text-white">{field.label}</span>
                      {#if field.required}
                        <span class="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">Required</span>
                      {/if}
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-xs text-gray-500 dark:text-gray-400">Name: {field.name}</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">•</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">Type: {field.type}</span>
                      {#if field.type === 'select' && field.options && field.options.length > 0}
                        <span class="text-xs text-gray-500 dark:text-gray-400">•</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">Options: {field.options.join(', ')}</span>
                      {/if}
                    </div>
                  </div>
                  <div class="flex gap-2 ml-4">
                    <button
                      type="button"
                      onclick={() => editField(index)}
                      class="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition"
                    >
                      <Edit2 class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onclick={() => deleteField(index)}
                      class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              {/each}
              {#if customFields.length === 0}
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p class="text-sm">No custom fields added yet</p>
                </div>
              {/if}
            </div>

            <!-- Add/Edit Form -->
            {#if showAddForm}
              <div class="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 mb-4">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                    {editingField !== null ? 'Edit Custom Field' : 'Add Custom Field'}
                  </h3>
                  <button
                    type="button"
                    onclick={resetForm}
                    class="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                  >
                    <X class="w-5 h-5" />
                  </button>
                </div>
                
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Field Name *</label>
                    <input
                      type="text"
                      bind:value={newField.name}
                      class="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                      placeholder="e.g., dietary_preference"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Field Label *</label>
                    <input
                      type="text"
                      bind:value={newField.label}
                      class="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                      placeholder="e.g., Dietary Preference"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Field Type</label>
                    <select
                      bind:value={newField.type}
                      class="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
                    >
                      <option value="text">Text</option>
                      <option value="select">Select (Dropdown)</option>
                      <option value="textarea">Textarea</option>
                      <option value="checkbox">Checkbox</option>
                    </select>
                  </div>
                  
                  {#if newField.type === 'select'}
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Options</label>
                      <div class="space-y-2">
                        {#each (newField.options || []) as option, index}
                          <div class="flex items-center gap-2">
                            <input
                              type="text"
                              value={option}
                              readonly
                              class="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm"
                            />
                            <button
                              type="button"
                              onclick={() => removeOption(index)}
                              class="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                            >
                              <X class="w-4 h-4" />
                            </button>
                          </div>
                        {/each}
                        <button
                          type="button"
                          onclick={addOption}
                          class="flex items-center gap-2 px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition"
                        >
                          <Plus class="w-4 h-4" />
                          Add Option
                        </button>
                      </div>
                    </div>
                  {/if}
                  
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      bind:checked={newField.required}
                      class="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">Required field</span>
                  </label>
                  
                  <div class="flex gap-2 pt-2">
                    <button
                      type="button"
                      onclick={editingField !== null ? updateField : addField}
                      class="flex-1 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition"
                    >
                      {editingField !== null ? 'Update Field' : 'Add Field'}
                    </button>
                    <button
                      type="button"
                      onclick={resetForm}
                      class="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            {/if}
            
            <!-- Add Button -->
            {#if !showAddForm}
              <button
                type="button"
                onclick={() => showAddForm = true}
                class="w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition flex items-center justify-center gap-2"
              >
                <Plus class="w-5 h-5" />
                Add Custom Field
              </button>
            {/if}
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
