<script lang="ts">
  interface Props {
    value?: string;
    placeholder?: string;
    label?: string;
    required?: boolean;
    apiUrl?: string;
    queryParam?: string;
    displayField?: string;
    onSelect?: (item: any) => void;
    onChange?: (value: string) => void;
    class?: string;
  }

  let {
    value = '',
    placeholder = '',
    label = '',
    required = false,
    apiUrl = '',
    queryParam = 'q',
    displayField = 'name',
    onSelect = (item: any) => {},
    onChange = (value: string) => {},
    class: className = ''
  }: Props = $props();

  let isOpen = $state(false);
  let suggestions = $state<any[]>([]);
  let loading = $state(false);
  let selectedIndex = $state(-1);
  let inputRef: HTMLInputElement;

  let debounceTimer: number;

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      suggestions = [];
      isOpen = false;
      return;
    }

    loading = true;
    selectedIndex = -1;

    try {
      const url = new URL(apiUrl, window.location.origin);
      url.searchParams.append(queryParam, query);
      
      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.success && data.data) {
        suggestions = data.data;
        isOpen = suggestions.length > 0;
      } else {
        suggestions = [];
        isOpen = false;
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      suggestions = [];
      isOpen = false;
    } finally {
      loading = false;
    }
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newValue = target.value;
    onChange(newValue);
    
    clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleFocus = () => {
    if (value && value.length >= 2) {
      fetchSuggestions(value);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      isOpen = false;
    }, 200);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        isOpen = false;
        break;
    }
  };

  const selectSuggestion = (item: any) => {
    const newValue = item[displayField] || item.kota || item.name || '';
    onChange(newValue);
    isOpen = false;
    onSelect(item);
  };

  const getDisplayValue = (item: any) => {
    if (displayField === 'kota' && item.provinsi) {
      return `${item.kota}, ${item.provinsi}`;
    }
    return item[displayField] || item.kota || item.name || '';
  };
</script>

<div class="relative {className}">
  {#if label}
    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" for="autocomplete-input">
      {label}
      {#if required} <span class="text-red-500">*</span>{/if}
    </label>
  {/if}
  
  <div class="relative">
    <input
      id="autocomplete-input"
      bind:this={inputRef}
      type="text"
      {value}
      {placeholder}
      {required}
      oninput={handleInput}
      onfocus={handleFocus}
      onblur={handleBlur}
      onkeydown={handleKeyDown}
      class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500"
    />
    
    {#if loading}
      <div class="absolute right-3 top-1/2 -translate-y-1/2">
        <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    {/if}
  </div>

  {#if isOpen && suggestions.length > 0}
    <div class="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-auto">
      {#each suggestions as item, index}
        <button
          type="button"
          class="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition {selectedIndex === index ? 'bg-gray-100 dark:bg-slate-700' : ''}"
          onmousedown={() => selectSuggestion(item)}
        >
          <span class="text-sm text-gray-900 dark:text-white">
            {getDisplayValue(item)}
          </span>
        </button>
      {/each}
    </div>
  {/if}
</div>
