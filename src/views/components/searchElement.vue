<template>
  <div class="search-filter-container">
    <div class="input-group">
        <input
            v-model="filters.searchTerm"
            type="text"
            :placeholder="$t('Search...')"
            class="inputLogin"
            @click="showFiltersMethod"
            @keypress.enter="searchThings"
        />
        <button @click="searchThings" class="submit-button">
            <span>{{ $t("Search") }}</span>
        </button>
    </div>

    <div v-if="showFilters" class="filter-options-container">
      <div class="filter-card">
        <span>{{ $t('$') }}</span>
        <input
          type="number"
          v-model="filters.price"
          :placeholder="$t('Max Price')"
          class="filter-input"
        />
      </div>

      <div class="filter-card">
        <input
          type="number"
          v-model="filters.range"
          :placeholder="$t('Range')"
          class="filter-input"
        />
        <span>{{ $t('Km') }}</span>
      </div>

      <select v-model="filters.condition" class="filter-card select-filter">
        <option value="" disabled selected>{{ $t('Condition') }}</option>
        <option
          v-for="condition in conditions"
          :key="condition.id"
          :value="condition.id"
        >
          {{ condition.name }}
        </option>
      </select>

      <div class="filter-card">
        <input
          type="number"
          v-model="filters.weight"
          :placeholder="$t('Max Weight')"
          class="filter-input"
        />
        <span>{{ $t('Kg') }}</span>
      </div>

      <select v-model="filters.category" class="filter-card select-filter">
        <option value="" disabled selected>{{ $t('Category') }}</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <select v-model="filters.material" class="filter-card select-filter">
        <option value="" disabled selected>{{ $t('Material') }}</option>
        <option v-for="material in materials" :key="material.id" :value="material.id">
          {{ material.name }}
        </option>
      </select>

      <select v-model="filters.color" class="filter-card select-filter">
        <option value="" disabled selected>{{ $t('Color') }}</option>
        <option v-for="color in colors" :key="color.id" :value="color.id">
          {{ color.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, defineComponent } from "vue";
import swapApiResource from "../../api/swapResource"
import { useStore } from 'vuex';

export default defineComponent({
name: 'searchelement',
emits: ['searchThingsEmit', 'showFiltersEmit'],
setup(props, { emit }) {
  const store = useStore();

  const filters = ref({
    searchTerm: "",
    price: "",
    condition: "",
    weight: "",
    category: "",
    material: "",
    color: "",
    range: "",
  });
  const dropdown = ref(null);
  const showFilters = ref(false);

  // Change these to ref so that they are correctly accessed
  const conditions = ref([]);
  const categories = ref([]);
  const materials = ref([]);
  const colors = ref([]);
  const showCategories = ref(false);

  const swapResource = new swapApiResource();

  const isChecked = (category) => {
    return filters.value.category.includes(category);
  };

  const updateCategories = (category, isChecked) => {
    if (isChecked) {
      filters.value.category.push(category);
    } else {
      const index = filters.value.category.indexOf(category);
      if (index > -1) {
        filters.value.category.splice(index, 1);
      }
    }
  };

  const searchThings = () => {
    showFilters.value = false;
    emit('searchThingsEmit', filters.value);
    filters.value = {
      searchTerm: "",
      price: "",
      condition: "",
      weight: "",
      category: "",
      range: "",
      material: "",
      color: "",
    };
  };

  const showFiltersMethod = () => {
    showFilters.value = true;
    emit('showFiltersEmit');
  };

  const handleClickOutside = (event) => {
    if (dropdown.value && !dropdown.value.contains(event.target)) {
      showCategories.value = false;
    }
  };

  onMounted(async () => {
    document.addEventListener("click", handleClickOutside);

    // Use ref values properly
    conditions.value = store.getters.getConditions;
    categories.value = store.getters.getCategories;
    materials.value = store.getters.getMaterials;
    colors.value = store.getters.getColors;

  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  return {
    filters,
    conditions,
    categories,
    materials,
    colors,
    showCategories,
    isChecked,
    updateCategories,
    searchThings,
    handleClickOutside,
    dropdown,
    showFilters,
    showFiltersMethod
  };
}
});

</script>

<style scoped>
.search-filter-container {
  width: 94%;
  margin-left: 3%;
  margin-top: 10px;
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  background-color: white;
  overflow: hidden; /* To contain rounded borders */
}

.inputLogin {
  flex-grow: 1;
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  font-family: var(--primary-font, 'Poppins', sans-serif);
  font-size: 0.9rem;
}

.inputLogin:focus {
  outline: none;
}

.submit-button {
  background-color: var(--text-dark);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-family: var(--primary-font, 'Poppins', sans-serif);
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.filter-options-container {
  display: flex;
  /* flex-wrap: nowrap; */
  flex-wrap: wrap;
  overflow-x: auto;
  padding-top: 10px;
  gap: 10px;
  /* height: 50vh; */
  justify-content: flex-start;
}

.filter-card {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  border: 1px solid var(--light-shade-bg, #f0f5f3);
  background-color: white;
  border-radius: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 0.85rem;
  white-space: nowrap; /* Prevent text from wrapping */
  height: 40px; /* Set a fixed height */
}

.filter-input {
  border: none;
  background-color: transparent;
  margin-left: 5px;
  width: 60px; /* Adjust width as needed */
  font-size: 0.85rem;
}

.filter-input:focus {
  outline: none;
}

/* .select-filter {
  padding-top: 8px;
  padding-bottom: 8px;

} */

.select-filter {
  appearance: none; /* Remove native arrow */
  -webkit-appearance: none;
  -moz-appearance: none;

  padding-right: 30px; /* Room for the arrow */
  background-image: url("data:image/svg+xml,%3Csvg%20viewBox='0%200%2024%2024'%20fill='black'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cpath%20d='M7%2010l5%205%205-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}


/* Hide scrollbar for WebKit browsers */
.filter-options-container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for Firefox */
.filter-options-container {
  scrollbar-width: none;
}
</style>
