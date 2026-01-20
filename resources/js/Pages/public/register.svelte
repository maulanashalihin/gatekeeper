<script>
  import { router } from '@inertiajs/svelte'
  let { flash, event, eventSettings } = $props()

  const customFields = $derived(eventSettings?.custom_fields || [])

  let formData = $state({
    name: '',
    email: '',
    phone: '',
    gender: '',
    custom_data: {}
  })

  let isSubmitting = $state(false)

  function handleSubmit(e) {
    e.preventDefault()
    isSubmitting = true

    const submitData = {
      ...formData,
      custom_data: JSON.stringify(formData.custom_data)
    }

    router.post(`/events/${event.slug}/register`, submitData, {
      onFinish: () => {
        isSubmitting = false
      }
    })
  }

  function handleCustomFieldChange(fieldName, value) {
    formData.custom_data[fieldName] = value
  }

  document.documentElement.classList.remove('dark');
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-2xl mx-auto">
    <!-- Event Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{event.name}</h1> 
    </div>

    <!-- Flash Messages -->
    {#if flash?.error}
      <div class="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-200 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div>
          <h4 class="text-sm font-bold text-red-600">Error</h4>
          <p class="text-sm text-red-700 mt-1">{flash.error}</p>
        </div>
      </div>
    {/if}

    <!-- Registration Form -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <form onsubmit={handleSubmit}>
        <div class="space-y-6">
          <div class="mb-8 pb-6 border-b border-gray-200">
        <h3 class="text-sm font-bold text-gray-700 mb-3">Detail Acara</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>
              {new Date(event.start_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {#if event.end_date && new Date(event.end_date).getTime() !== new Date(event.start_date).getTime()}
                - {new Date(event.end_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
              {/if}
            </span>
          </div>
          {#if event.location}
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{event.location}</span>
            </div>
          {/if}
        </div>
      </div>
          <!-- Name -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap *</label>
            <input 
              type="text" 
              bind:value={formData.name} 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:bg-gray-50 transition" 
              placeholder="Masukkan nama lengkap Anda" 
              required 
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Alamat Email</label>
            <input 
              type="email" 
              bind:value={formData.email} 
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:!bg-gray-50 transition" 
              placeholder="Masukkan alamat email Anda" 
            />
          </div>

          <!-- Gender -->
          {#if eventSettings?.enable_gender}
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
              <select
                bind:value={formData.gender}
                class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:!bg-gray-50 transition"
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>
          {/if}

          <!-- Phone -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Nomor Telepon</label>
            <input
              type="tel"
              bind:value={formData.phone}
              class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none hover:!bg-gray-50 transition"
              placeholder="Masukkan nomor telepon Anda"
            />
          </div>

          <!-- Custom Fields -->
          {#each customFields as field}
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">
                {field.label}
                {#if field.required}
                  <span class="text-red-500">*</span>
                {/if}
              </label>
              {#if field.type === 'text'}
                <input
                  type="text"
                  value={formData.custom_data[field.name] || ''}
                  oninput={(e) => handleCustomFieldChange(field.name, e.target.value)}
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                  placeholder={`Masukkan ${field.label.toLowerCase()}`}
                  required={field.required}
                />
              {:else if field.type === 'select'}
                <select
                  value={formData.custom_data[field.name] || ''}
                  onchange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition bg-white"
                  required={field.required}
                >
                  <option value="">Pilih {field.label}</option>
                  {#each field.options || [] as option}
                    <option value={option}>{option}</option>
                  {/each}
                </select>
              {:else if field.type === 'textarea'}
                <textarea
                  value={formData.custom_data[field.name] || ''}
                  oninput={(e) => handleCustomFieldChange(field.name, e.target.value)}
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition resize-none"
                  rows="3"
                  placeholder={`Masukkan ${field.label.toLowerCase()}`}
                  required={field.required}
                ></textarea>
              {:else if field.type === 'checkbox'}
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.custom_data[field.name] || false}
                    onchange={(e) => handleCustomFieldChange(field.name, e.target.checked)}
                    class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">{field.label}</span>
                </label>
              {/if}
            </div>
          {/each}

          <!-- Submit Button -->
          <div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              class="w-full px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </div>
        </div>
      </form>

      <!-- Event Info -->
      
    </div>

     
  </div>
</div>
