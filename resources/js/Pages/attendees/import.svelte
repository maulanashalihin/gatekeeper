<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../Components/Layouts/EventLayout.svelte';
  import { ArrowLeft, Upload, Download, FileSpreadsheet, AlertCircle } from 'lucide-svelte';

  let { event, orgUuid, flash } = $props();

  let file = $state<File | null>(null);
  let sendEmail = $state(true);
  let isUploading = $state(false);

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      file = target.files[0];
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      file = e.dataTransfer.files[0];
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!file) return;

    isUploading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('send_email', sendEmail.toString());

    router.post(`/organizations/${orgUuid}/events/${event.id}/attendees/import`, formData);
  };

  const downloadTemplate = () => {
    const csvContent = 'name,email,phone\nJohn Doe,john@example.com,+1234567890\nJane Smith,jane@example.com,+0987654321';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendees_template.csv';
    a.click();
    URL.revokeObjectURL(url);
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
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Import Attendees</h1>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{event.name}</p>
        </div>
      </div>
    </div>

    <!-- Flash Messages -->
    {#if flash?.error}
      <div class="flex items-start gap-4 p-4 rounded-xl bg-error-surface border border-error/20">
        <div class="w-5 h-5 rounded-full bg-error flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-white text-xs font-bold">!</span>
        </div>
        <div>
          <h4 class="text-sm font-bold text-error">Error</h4>
          <p class="text-sm text-error/80 mt-1">{flash.error}</p>
        </div>
      </div>
    {/if}

    {#if flash?.success}
      <div class="flex items-start gap-4 p-4 rounded-xl bg-success-surface border border-success/20">
        <div class="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-white text-xs font-bold">✓</span>
        </div>
        <div>
          <h4 class="text-sm font-bold text-success">Success</h4>
          <p class="text-sm text-success/80 mt-1">{flash.success}</p>
        </div>
      </div>
    {/if}

    <!-- Instructions -->
    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800">
      <div class="flex items-start gap-3 sm:gap-4">
        <AlertCircle class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-base sm:text-lg">Import Instructions</h3>
          <ul class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Download the CSV template below</li>
            <li>• Fill in attendee information (name and email are required)</li>
            <li>• Upload the completed CSV file</li>
            <li>• QR codes will be automatically generated for each attendee</li>
            <li>• Optionally send confirmation emails to all attendees</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Upload Form -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700">
      <form onsubmit={handleSubmit}>
        <div class="p-4 sm:p-6 space-y-6">
          <!-- File Upload -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CSV File *</label>
            <div
              class="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 sm:p-8 text-center hover:border-primary-500 dark:hover:border-primary-500 transition cursor-pointer"
              ondrop={handleDrop}
              ondragover={(e) => e.preventDefault()}
              ondragenter={(e) => e.preventDefault()}
              onclick={() => document.getElementById('file-input')?.click()}
            >
              {#if file}
                <div class="space-y-2">
                  <FileSpreadsheet class="w-10 h-10 sm:w-12 sm:h-12 text-primary-500 mx-auto" />
                  <p class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{file.name}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                  <button
                    type="button"
                    onclick={(e) => {
                      e.stopPropagation();
                      file = null;
                    }}
                    class="text-sm text-red-600 dark:text-red-400 hover:underline min-h-[44px] inline-block py-2"
                  >
                    Remove file
                  </button>
                </div>
              {:else}
                <div class="space-y-2">
                  <Upload class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
                  <p class="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Drop your CSV file here</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">or click to browse</p>
                </div>
              {/if}
              <input
                id="file-input"
                type="file"
                accept=".csv"
                onchange={handleFileChange}
                class="hidden"
              />
            </div>
          </div>

          <!-- Send Email Option -->
          <div class="flex items-start gap-3">
            <input
              type="checkbox"
              id="send-email"
              bind:checked={sendEmail}
              class="w-5 h-5 mt-0.5 rounded border-gray-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500"
            />
            <label for="send-email" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Send confirmation emails with QR codes to all imported attendees
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <a href={`/organizations/${orgUuid}/events/${event.id}/attendees`} use:inertia class="flex-1 px-6 py-3.5 rounded-xl border border-gray-300 dark:border-slate-600 font-semibold text-sm text-gray-700 dark:text-gray-300 text-center hover:bg-gray-50 dark:hover:bg-slate-700 transition min-h-[44px] flex items-center justify-center">
            Cancel
          </a>
          <button
            type="button"
            onclick={downloadTemplate}
            class="px-6 py-3.5 rounded-xl border border-gray-300 dark:border-slate-600 font-semibold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Download class="w-4 h-4" />
            Download Template
          </button>
          <button
            type="submit"
            disabled={!file || isUploading}
            class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            <Upload class="w-4 h-4" />
            {isUploading ? 'Importing...' : 'Import Attendees'}
          </button>
        </div>
      </form>
    </div>
  </div>
</EventLayout>
