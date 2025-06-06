<template>
  <div class="landing-page">
    <div class="container">
      <div
        class="cont_logo selected"
        id="ImageInput"
        @click="triggerFileInput"
      >
        <i data-feather="image" class="iconStyle">
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            required
            @change="handleFileUpload"
            accept="image/*"
            multiple
          >
        </i>
      </div>
      <h1 class="title">{{ $t("Edit Profile") }}</h1>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="input-group">
          <input
            type="text"
            id="name"
            v-model="name"
            required
            class="inputLogin"
            :placeholder="$t('Full Name')"
          />
        </div>
        <div class="input-group">
          <input
            type="text"
            id="city"
            v-model="address"
            @input="onInputChange"
            :disabled="isSearching"
            required
            class="inputLogin"
            :placeholder="$t('Enter your address')"
          />
          <div v-if="suggestions.length" class="dropdown">
            <div
              v-for="(suggestion, index) in suggestions"
              :key="index"
              class="dropdown-item"
              @click="selectAddress(suggestion)"
            >
              {{ suggestion.display_name }}
            </div>
          </div>
        </div>
        <div class="input-group">
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="inputLogin"
            :placeholder="$t('E-mail')"
          />
        </div>

        <div class="input-group">
          <select
            id="language"
            v-model="language"
            class="inputLogin"
            @change="onLangChange"
          >
            <option value="" disabled>{{ $t("Language") }}</option>
            <option value="en">{{ $t("English") }}</option>
            <option value="es">{{ $t("Spanish") }}</option>
          </select>
        </div>

        <button
          type="submit"
          class="submit-button"
        >
          {{ $t("Confirm") }}
        </button>
        <p
          class="reset-password-link"
          @click="goToReset"
        >
          {{ $t("Reset password") }}
        </p>
      </form>
    </div>
    <overlay v-if="loading"></overlay>
    <successErrorCard
      :type="type"
      :text="text"
      :launch="showSuccessErrorCard"
    ></successErrorCard>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, onBeforeUnmount, computed } from "vue";
import { useRouter } from 'vue-router';
import swapApiResource from "../../api/swapResource"
import overlay from "../components/overlay.vue"
import successErrorCard from '../components/successErrorCard.vue';
import { useStore } from 'vuex'
import axios from 'axios';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const store = useStore();
const swapResource = new swapApiResource();
const router = useRouter();

const type = ref("success");
const text = ref("");
const showSuccessErrorCard = ref(false);
const userIdAuth = store.getters.getUserId;

const loading = ref(false);

const name = ref('');
const city = ref('');
const email = ref('');
const password = ref('');
const language = ref('');

const citiesArray = reactive(['Alice', 'Bob', 'Charlie', 'Diana']);

const fileInput = ref(null);
const profileImg = ref();
const isFileUploaded = ref(false);

const showImageError = ref(false);

const suggestions = ref([]);
const address = ref('');
const lat = ref(null);
const lon = ref(null);

const onInputChange = () => {
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(fetchAddressSuggestions, 500);
};

const onLangChange = (event) => {
    locale.value = event.target.value;
};

const isSearching = ref(false);

const fetchAddressSuggestions = async () => {
  if (address.value.length < 3) return;

  isSearching.value = true;

  try {
    const response = await axios.get(`https://photon.komoot.io/api/`, {
      params: {
        q: address.value,
        limit: 5
      }
    });
    suggestions.value = response.data.features.map(feature => ({
      display_name: (feature.properties.housenumber && feature.properties.street)
        ? `${feature.properties.housenumber} ${feature.properties.street}, ${feature.properties.city}`
        : `${feature.properties.name}, ${feature.properties.city}`,
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0]
    }));

  } catch (error) {
    console.error("Error fetching address suggestions", error);
  }

  isSearching.value = false;
};

let typingTimeout = null;

const selectAddress = (suggestion) => {
  address.value = suggestion.display_name;
  lat.value = suggestion.lat;
  lon.value = suggestion.lon;
  suggestions.value = [];
};

onBeforeUnmount(() => {
  store.commit("setLoading", true);
})

const userDetails = computed(() => store.getters.getUserDetails);

onMounted(async () => {
  store.commit("setLoading", true);

    if (!userDetails.value) {
        try {
            await store.dispatch('fetchUserDetails');
            name.value = userDetails.value.user.name;
            address.value = userDetails.value.user.location;
            email.value = userDetails.value.user.email;
            language.value = userDetails.value.user.language;
        } catch (error) {
            console.error('Failed to load user details:', error);
        }
    } else {
        name.value = userDetails.value.user.name;
        address.value = userDetails.value.user.location;
        email.value = userDetails.value.user.email;
        language.value = userDetails.value.user.language;
    }


//   await swapResource
//     .getUserDetails({userId: userIdAuth})
//     .then((response) => {
//       name.value = response.user.name;
//       address.value = response.user.location;
//       email.value = response.user.email;
//       language.value = response.user.language;
//     });

  store.commit("setLoading", false);
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    profileImg.value = files;
    isFileUploaded.value = true;
    showImageError.value = false;
  } else {
    profileImg.value = null;
    isFileUploaded.value = false;
  }
};

const goToReset = () => {
  router.push({ name: 'resetPassword' });
};

const handleSubmit = async () => {
  store.commit("setLoading", true);

  await swapResource
    .updateUser({
      name: name.value,
      address: {
        street: address.value,
        latitude: lat.value,
        longitude: lon.value,
      },
      email: email.value,
      language: language.value,
      profileImg: profileImg.value
    })
    .then((response) => {
      if (response.success) {
        store.commit("setLoading", false);
        type.value = 'success';
        text.value = t('User Successfully Updated');
        showSuccessErrorCard.value = true;
        setTimeout(() => {
          showSuccessErrorCard.value = false;
        }, 2800);
        router.push({ name: "swaps" })
      } else {
        store.commit("setLoading", false);

        type.value = 'error';
        text.value = t('Error Updating User');
        showSuccessErrorCard.value = true;
        setTimeout(() => {
          showSuccessErrorCard.value = false;
        }, 2800);
      }
    })
    .catch((error) => {
      store.commit("setLoading", false);

      type.value = 'error';
      text.value = t('Error Updating User');
      showSuccessErrorCard.value = true;
      setTimeout(() => {
        showSuccessErrorCard.value = false;
      }, 2800);
    });
};
</script>

<style scoped>
.landing-page {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.container {
  width: 90%;
  max-width: 400px;
  position: relative;
  background-color: white;
  height: auto;
  /* margin: 50vh auto 0; */
  padding: 30px 20px;
  border-radius: var(--border-radius, 24px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  /* transform: translateY(-50%); */
}

.cont_logo {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid transparent;
  background-color: rgb(245, 255, 244);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  transition: all 2s ease;
  cursor: pointer;
}

.selected {
  border: 1px solid #053b00;
  box-shadow: 0 0 10px rgba(5, 59, 0, 0.52);
}

.iconStyle {
  position: relative;
  /* top: 20px;
  left: 20px; */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  color: rgb(224, 224, 224);
}

.title {
  text-align: center;
  font-size: 1.8rem;
  margin-top: 30px;
  margin-bottom: 0;
  color: var(--text-dark, #2c3e50);
  font-family: var(--primary-font, 'Poppins', sans-serif);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-group {
  margin-top: 10px;
  position: relative;
}

.inputLogin {
  padding: 12px 20px;
  border: 1px solid var(--light-shade-bg, #f0f5f3);
  background-color: var(--light-shade-bg, #f0f5f3);
  border-radius: 50px;
  width: 100%;
  font-family: var(--primary-font, 'Poppins', sans-serif);
}

.dropdown {
  position: absolute;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-item {
  padding: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.submit-button {
  width: 100%;
  padding: 12px;
  border-radius: 50px;
  margin-top: 15px;
  background-color: var(--accent-color, #2ecc71);
  color: white;
  border: none;
  cursor: pointer;
  font-family: var(--primary-font, 'Poppins', sans-serif);
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.reset-password-link {
  text-align: center;
  margin: 0;
  margin-top: 10px !important;
  font-size: 0.8rem;
  color: var(--text-dark, #2c3e50);
  opacity: 0.7;
  cursor: pointer;
}

/* Responsive Adjustments */
@media screen and (max-width: 375px) {
  .container {
    width: 95%;
    padding: 20px 15px;
  }

  .cont_logo {
    width: 80px;
    height: 80px;
    top: -40px;
  }

  .title {
    font-size: 1.6rem;
  }
}

@media screen and (min-width: 768px) {
  .container {
    max-width: 450px;
  }
}
</style>
