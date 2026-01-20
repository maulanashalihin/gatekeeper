<script lang="ts">
  import { router, inertia } from '@inertiajs/svelte';
  import EventLayout from '../../../Components/Layouts/EventLayout.svelte';
  import { ArrowLeft, QrCode, Camera, CheckCircle, XCircle, Loader2 } from 'lucide-svelte';
  import QrScanner from 'qr-scanner';
  import { onMount, onDestroy } from 'svelte';

  let { event, orgUuid } = $props();

  let isScanning = $state(false);
  let scanResult = $state<{ success: boolean; message: string; attendee?: any } | null>(null);
  let isLoading = $state(false);
  let scanner: QrScanner | null = null;
  let videoElement!: HTMLVideoElement;
  let lastScannedCode = $state<string | null>(null);
  let scanCooldown = $state(false);

  const startScanning = async () => {
    isScanning = true;
    scanResult = null;
    lastScannedCode = null;

    try {
      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera();
      console.log('Camera available:', hasCamera);

      if (!hasCamera) {
        throw new Error('No camera detected on this device');
      }

      // Check camera permission
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Camera permission:', permissionStatus.state);

      if (permissionStatus.state === 'denied') {
        throw new Error('Camera permission denied. Please allow camera access in your browser settings.');
      }

      scanner = new QrScanner(
        videoElement,
        async (result) => {
          // Prevent duplicate scans within 2 seconds
          if (scanCooldown || result.data === lastScannedCode) {
            return;
          }

          scanCooldown = true;
          lastScannedCode = result.data;

          await handleScan(result.data);

          // Reset cooldown after 2 seconds
          setTimeout(() => {
            scanCooldown = false;
          }, 2000);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      console.log('Starting scanner...');
      await scanner.start();
      console.log('Scanner started successfully');
    } catch (error: any) {
      console.error('Failed to start scanner:', error);
      scanResult = {
        success: false,
        message: error.message || 'Failed to access camera. Please allow camera permissions.'
      };
      isScanning = false;
    }
  };

  const stopScanning = async () => {
    if (scanner) {
      await scanner.stop();
      scanner = null;
    }
    isScanning = false;
    lastScannedCode = null;
    scanCooldown = false;
  };

  const handleScan = async (qrCode: string) => {
    if (isLoading) return;

    isLoading = true;
    scanResult = null;

    try {
      const response = await fetch(`/organizations/${orgUuid}/events/${event.id}/checkin/${qrCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });

      const data = await response.json();

      scanResult = data;

      if (data.success) {
        setTimeout(() => {
          scanResult = null;
        }, 3000);
      }
    } catch (error) {
      scanResult = {
        success: false,
        message: 'Failed to scan QR code'
      };
    }

    isLoading = false;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Cleanup on unmount
  onDestroy(() => {
    if (scanner) {
      scanner.stop();
    }
  });
</script>

<EventLayout group="checkin" {event} {orgUuid}>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 sm:gap-4">
        <a href={`/organizations/${orgUuid}/events/${event.id}/dashboard`} use:inertia class="p-2.5 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition">
          <ArrowLeft class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </a>
        <div class="min-w-0">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">QR Code Scanner</h1>
          <p class="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 mt-1">{event.name}</p>
        </div>
      </div>
      <div class="w-full sm:w-auto">
        <a href={`/organizations/${orgUuid}/events/${event.id}/checkin/manual`} use:inertia class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition text-sm font-semibold min-h-[44px]">
          Manual Check-in
        </a>
      </div>
    </div>

    <!-- Scanner Area -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-8 shadow-sm border border-gray-200 dark:border-slate-700">
      <div class="flex flex-col items-center justify-center min-h-[350px] sm:min-h-[400px]">
        {#if !isScanning}
          <div class="text-center">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <QrCode class="w-10 h-10 sm:w-12 sm:h-12 text-purple-500" />
            </div>
            <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to Scan</h2>
            <p class="text-sm sm:text-base text-indigo-600 dark:text-indigo-400 mb-4 sm:mb-6">Position the QR code in front of the camera</p>
            <button
              onclick={startScanning}
              class="px-6 sm:px-8 py-3 rounded-xl bg-purple-500 text-white font-semibold hover:bg-blue-600 transition flex items-center gap-2 mx-auto min-h-[44px]"
            >
              <Camera class="w-5 h-5" />
              Start Scanning
            </button>
          </div>
        {:else}
          <div class="w-full max-w-md">
            <div class="relative bg-gray-900 rounded-2xl overflow-hidden aspect-square mb-4 sm:mb-6">
              <video bind:this={videoElement} class="w-full h-full object-cover"></video>

              {#if isLoading}
                <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 class="w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin" />
                </div>
              {/if}
            </div>

            <div class="flex gap-3">
              <button
                onclick={stopScanning}
                class="flex-1 px-4 sm:px-6 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition min-h-[44px]"
              >
                Stop Scanning
              </button>
            </div>

            <p class="text-center text-xs sm:text-sm text-indigo-500 dark:text-gray-400 mt-4">
              Point your camera at the QR code
            </p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Scan Result -->
    {#if scanResult}
      <div class="rounded-2xl p-4 sm:p-6 shadow-sm border {scanResult.success ? 'bg-green-500-surface border-success/20' : 'bg-red-100 dark:bg-red-900/30 border-danger/20'}">
        <div class="flex items-start gap-3 sm:gap-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full {scanResult.success ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center flex-shrink-0">
            {#if scanResult.success}
              <CheckCircle class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            {:else}
              <XCircle class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            {/if}
          </div>
          <div class="flex-1">
            <h3 class="text-base sm:text-lg font-bold {scanResult.success ? 'text-green-500' : 'text-red-500'} mb-2">
              {scanResult.success ? 'Check-in Successful!' : 'Check-in Failed'}
            </h3>
            <p class="text-sm {scanResult.success ? 'text-green-500/80' : 'text-red-500/80'}">{scanResult.message}</p>

            {#if scanResult.success && scanResult.attendee}
              <div class="mt-4 p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-xl">
                <div class="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p class="font-semibold text-indigo-600 dark:text-indigo-400">Name</p>
                    <p class="text-gray-900 dark:text-white font-medium">{scanResult.attendee.name}</p>
                  </div>
                  <div>
                    <p class="font-semibold text-indigo-600 dark:text-indigo-400">Email</p>
                    <p class="text-gray-900 dark:text-white font-medium">{scanResult.attendee.email}</p>
                  </div>
                  <div>
                    <p class="font-semibold text-indigo-600 dark:text-indigo-400">Status</p>
                    <p class="text-green-500 font-medium">Checked In</p>
                  </div>
                  <div>
                    <p class="font-semibold text-indigo-600 dark:text-indigo-400">Time</p>
                    <p class="text-gray-900 dark:text-white font-medium">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Event Info -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-slate-700">
      <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">Event Information</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <p class="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Start Date</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{formatDate(event.start_date)}</p>
        </div>
        <div>
          <p class="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Location</p>
          <p class="text-sm sm:text-base text-gray-900 dark:text-white font-medium">{event.location || 'Not specified'}</p>
        </div>
      </div>
    </div>
  </div>
</EventLayout>
