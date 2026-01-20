<script lang="ts">
  import { Calendar, MapPin, Clock, User, Mail, CheckCircle, XCircle, Ticket as TicketIcon, Phone, Building, Globe } from 'lucide-svelte';
  import dayjs from 'dayjs';

  let { attendee, event } = $props();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      registered: 'bg-blue-100 text-blue-600 border-blue-200',
      checked_in: 'bg-green-100 text-green-600 border-green-200',
      cancelled: 'bg-red-100 text-red-600 border-red-200',
      no_show: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      registered: 'Terdaftar',
      checked_in: 'Sudah Check-in',
      cancelled: 'Dibatalkan',
      no_show: 'Tidak Hadir'
    };
    return texts[status] || status;
  };

  const formatDate = (timestamp: number | string) => {
    return dayjs(timestamp).format('dddd, D MMMM YYYY');
  };

  const formatTime = (timestamp: number | string) => {
    return dayjs(timestamp).format('HH:mm');
  };
</script>

<div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-2xl mx-auto">
    <!-- Ticket Card -->
    <div class="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
      <!-- Ticket Header -->
      <div class="bg-gradient-to-r from-primary-500 to-primary-600 p-6 sm:p-8 text-white">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <TicketIcon class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-medium text-white/80">Tiket Acara</p>
            <h2 class="text-xl sm:text-2xl font-bold">{event.name}</h2>
          </div>
        </div>
        <div class="flex flex-wrap gap-4 sm:gap-6">
          <div class="flex items-center gap-2">
            <Calendar class="w-5 h-5 text-white/80" />
            <span class="text-sm sm:text-base font-medium">{formatDate(event.start_date)}</span>
          </div>
          <div class="flex items-center gap-2">
            <Clock class="w-5 h-5 text-white/80" />
            <span class="text-sm sm:text-base font-medium">{formatTime(event.start_date)}</span>
          </div>
        </div>
      </div>

      <!-- Perforation Line -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t-2 border-dashed border-gray-300"></div>
        </div>
        <div class="relative flex justify-between">
          <div class="w-8 h-8 bg-gray-50 rounded-full -mt-4 -ml-4"></div>
          <div class="w-8 h-8 bg-gray-50 rounded-full -mt-4 -mr-4"></div>
        </div>
      </div>

      <!-- Ticket Body -->
      <div class="p-6 sm:p-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <!-- Attendee Information -->
          <div class="space-y-5">
            <div>
              <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Informasi Peserta</h3>
              
              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User class="w-5 h-5 text-blue-600" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray-500 uppercase tracking-wide">Nama Lengkap</p>
                    <p class="font-semibold text-gray-900 break-words">{attendee.name}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Mail class="w-5 h-5 text-green-600" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray-500 uppercase tracking-wide">Alamat Email</p>
                    <p class="font-semibold text-gray-900 break-all">{attendee.email}</p>
                  </div>
                </div>

                {#if attendee.phone}
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Phone class="w-5 h-5 text-purple-600" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Nomor Telepon</p>
                      <p class="font-semibold text-gray-900 break-words">{attendee.phone}</p>
                    </div>
                  </div>
                {/if}

                {#if attendee.company}
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Building class="w-5 h-5 text-orange-600" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs text-gray-500 uppercase tracking-wide">Perusahaan</p>
                      <p class="font-semibold text-gray-900 break-words">{attendee.company}</p>
                    </div>
                  </div>
                {/if}
              </div>
            </div>

            <!-- Status Badge -->
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 {getStatusColor(attendee.status)}">
                {#if attendee.status === 'checked_in'}
                  <CheckCircle class="w-4 h-4" />
                {:else if attendee.status === 'cancelled'}
                  <XCircle class="w-4 h-4" />
                {:else}
                  <Clock class="w-4 h-4" />
                {/if}
                {getStatusText(attendee.status)}
              </span>
            </div>
          </div>

          <!-- QR Code Section -->
          <div class="flex flex-col items-center justify-center text-center space-y-4">
            <div class="relative">
              <div class="w-64 h-64 bg-white rounded-2xl shadow-lg border-2 border-gray-200 flex items-center justify-center p-4">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(attendee.id)}`}
                  alt="QR Code"
                  class="w-full h-full"
                />
              </div>
              <!-- Decorative corners -->
              <div class="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-600 rounded-tl-lg"></div>
              <div class="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-600 rounded-tr-lg"></div>
              <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-600 rounded-bl-lg"></div>
              <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-600 rounded-br-lg"></div>
            </div>
            
            <div class="space-y-2">
              <p class="text-sm font-semibold text-gray-900">Pindai kode QR ini</p>
              <p class="text-xs text-gray-600">Tunjukkan kode ini di pintu masuk acara untuk check-in</p>
            </div>
          </div>
        </div>

        <!-- Event Details -->
        {#if event.location || event.venue || event.address}
          <div class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Lokasi Acara</h3>
            
            {#if event.location}
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Globe class="w-5 h-5 text-blue-600" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Wilayah</p>
                  <p class="font-semibold text-gray-900 break-words">{event.location}</p>
                </div>
              </div>
            {/if}
            
            {#if event.venue}
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Building class="w-5 h-5 text-purple-600" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Venue</p>
                  <p class="font-semibold text-gray-900 break-words">{event.venue}</p>
                </div>
              </div>
            {/if}

            {#if event.address}
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <MapPin class="w-5 h-5 text-orange-600" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Alamat</p>
                  <p class="font-semibold text-gray-900 break-words">{event.address}</p>
                </div>
              </div>
            {/if}
          </div>
        {/if}

        <!-- Registration Info -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Detail Pendaftaran</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-start gap-3">
              <Calendar class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div class="min-w-0">
                <p class="text-xs text-gray-500 uppercase tracking-wide">Terdaftar Pada</p>
                <p class="font-semibold text-gray-900 break-words">
                  {new Date(attendee.registered_at).toLocaleDateString('id-ID', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            {#if attendee.checked_in_at}
              <div class="flex items-start gap-3">
                <CheckCircle class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div class="min-w-0">
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Check-in Pada</p>
                  <p class="font-semibold text-gray-900 break-words">
                    {new Date(attendee.checked_in_at).toLocaleDateString('id-ID', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Ticket Footer -->
      <div class="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-200">
        <div class="flex items-center justify-center">
          <p class="text-xs text-gray-500 text-center">
            ID Tiket: <span class="font-mono font-semibold text-gray-700">{attendee.id.substring(0, 8)}...</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Footer Message -->
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Mohon tunjukkan tiket ini di pintu masuk acara untuk check-in
      </p>
    </div>
  </div>
</div>

<style>
  @media print {
    body {
      background: white !important;
    }
    .bg-gradient-to-r {
      background: #6366F1 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>