<template>
  <div class="register-page">
    <div class="container">
      <form @submit.prevent="handleSubmit" class="form">
        <div
          class="cont_logo"
          id="ImageInput"
          @click="triggerFileInput"
          :class="{
            'selected': isFileUploaded,
            'error-border': showImageError
          }"
        >
          <!-- <input
            type="file"
            ref="fileInput"
            style="display: none"
            required
            @change="handleFileUpload"
            accept="image/*"
            multiple
          >
          <div class="upload-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div> -->
           <i data-feather="image" class="iconStyle" >
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

        <h1 class="title">{{  $t("Register")  }}</h1>

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

        <div class="input-group address-input">
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
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="inputLogin"
            :placeholder="$t('Password')"
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

        <div class="terms-container">
          <label class="terms-checkbox">
            <input
              type="checkbox"
              id="terms"
              v-model="agreedToTerms"
            />
            <span class="terms-text">
              {{ $t("I agree to the") }}
              <a
                href="https://www.trueque.art/#/privacy"
                target="_blank"
              >
                {{ $t("Terms of Service and Privacy Policy") }}
              </a>
            </span>
          </label>
        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="!agreedToTerms"
        >
          {{ $t("Sign Up") }}
        </button>

        <p
          class="login-link"
          @click="goToLogin"
        >
          {{ $t("Already have an account?") }}
        </p>
      </form>
    </div>

    <successErrorCard
      :type="type"
      :text="text"
      :launch="showSuccessErrorCard"
    ></successErrorCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import swapApiResource from "../api/swapResource";
import overlay from "./components/overlay.vue";
import successErrorCard from './components/successErrorCard.vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const { t, locale } = useI18n();
const swapResource = new swapApiResource();
const router = useRouter();

const type = ref("success");
const text = ref("");
const showSuccessErrorCard = ref(false);
const agreedToTerms = ref(false);
const store = useStore();

const name = ref('');
const address = ref('');
const email = ref('');
const password = ref('');
const language = ref('');
const lat = ref(null);
const lon = ref(null);
const suggestions = ref([]);
let typingTimeout = null;

const fileInput = ref(null);
const profileImg = ref();
const isFileUploaded = ref(false);
const showImageError = ref(false);

const triggerFileInput = () => {
  fileInput.value.click();
};

// const handleFileUpload = (event) => {
//   const files = Array.from(event.target.files);
//   if (files.length > 0) {
//     profileImg.value = files;
//     isFileUploaded.value = true;
//     showImageError.value = false;
//   } else {
//     profileImg.value = null;
//     isFileUploaded.value = false;
//   }
// };

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);

  if (files.length > 0) {
    const isImage = files.every(file => file.type.startsWith('image/'));

    if (!isImage) {
      text.value = t("Only image files are allowed.");
      type.value = "error";
      showSuccessErrorCard.value = true;
      setTimeout(() => { showSuccessErrorCard.value = false; }, 2800);

      // Reset any previous file state
      profileImg.value = null;
      isFileUploaded.value = false;
      showImageError.value = true;
      return;
    }

    profileImg.value = files;
    isFileUploaded.value = true;
    showImageError.value = false;
  } else {
    profileImg.value = null;
    isFileUploaded.value = false;
  }
};


const onInputChange = () => {
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(fetchAddressSuggestions, 1000);
};

const goToLogin = () => {
  router.push({ name: 'login' });
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

const selectAddress = (suggestion) => {
  address.value = suggestion.display_name;
  lat.value = suggestion.lat;
  lon.value = suggestion.lon;
  suggestions.value = [];
};

const isPasswordValid = () => {
  const minLength = /.{9,}/;
  const hasNumber = /\d/;
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    minLength.test(password.value) &&
    hasNumber.test(password.value) &&
    hasSymbol.test(password.value)
  );
};


const handleSubmit = () => {
  if (!agreedToTerms.value) {
    return;
  }

  if (!isPasswordValid()) {
    text.value = t("Password must be at least 9 characters long and contain at least one symbol and one number.");
    type.value = "error";
    showSuccessErrorCard.value = true;
    setTimeout(() => { showSuccessErrorCard.value = false; }, 2800);
    return;
  }

  if (!profileImg.value || profileImg.value.length === 0) {
    showImageError.value = true;
    text.value = t("Please upload a profile image");
    type.value = "error";
    showSuccessErrorCard.value = true;
    setTimeout(() => { showSuccessErrorCard.value = false; }, 2800);
    return;
  }

  if (!lat.value || !lon.value) {
    text.value = t("Please select a valid address from the dropdown.");
    type.value = "error";
    showSuccessErrorCard.value = true;
    setTimeout(() => { showSuccessErrorCard.value = false; }, 2800);
    return;
  }

  if (!language.value) {
    text.value = t("Please select a language.");
    type.value = "error";
    showSuccessErrorCard.value = true;
    setTimeout(() => { showSuccessErrorCard.value = false; }, 2800);
    return;
  }

  store.commit("setLoading", true);

  swapResource
    .register({
      name: name.value,
      address: {
        street: address.value,
        latitude: lat.value,
        longitude: lon.value,
      },
      email: email.value,
      password: password.value,
      language: language.value,
      profileImg: profileImg.value
    })
    .then(() => {
      type.value = "success";
      text.value = t("Account created! Please verify your email.");
      showSuccessErrorCard.value = true;
      setTimeout(() => { showSuccessErrorCard.value = false; }, 2800);
      router.push({ name: 'verifyEmail'});
    })
    .catch((error) => {
      text.value = error;
      showSuccessErrorCard.value = true;
      setTimeout(() => { showSuccessErrorCard.value = false; }, 2800);
    })
    .finally(() => {
      store.commit("setLoading", false);
    });
};
</script>

<style scoped>
.register-page {
  min-height: calc(var(--vh, 1vh) * 100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--primary-font, 'Poppins', sans-serif);
}

.container {
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: var(--border-radius, 24px);
  padding: 30px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
}

.cont_logo {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--light-shade-bg, #f0f5f3);
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cont_logo:hover {
  border-color: var(--accent-color, #2ecc71);
}

.upload-icon {
  color: var(--text-dark, #2c3e50);
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.cont_logo:hover .upload-icon {
  opacity: 0.8;
}

.selected {
  border-color: var(--accent-color, #2ecc71);
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.3);
}

.error-border {
  border-color: #ff4444;
  animation: shake 0.5s ease-in-out;
}

.iconStyle{
    position: relative;
    /* top: 20px;
    left: 20px; */
    width: 60px;
    height: 60px;
    color: rgb(224, 224, 224);
}

@keyframes shake {
  0%, 100% { transform: translateX(-50%) }
  25% { transform: translateX(-55%) }
  75% { transform: translateX(-45%) }
}

.title {
  text-align: center;
  font-size: 1.8rem;
  margin-top: 35px;
  margin-bottom: 5px;
  color: var(--text-dark, #2c3e50);
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  position: relative;
}

.inputLogin {
  width: 100%;
  padding: 12px 20px;
  border: 1px solid var(--light-shade-bg, #f0f5f3);
  background-color: var(--light-shade-bg, #f0f5f3);
  border-radius: 50px;
  /* font-size: 1rem; */
  transition: all 0.3s ease;
  font-family: var(--primary-font, 'Poppins', sans-serif);
}

.inputLogin:focus {
  outline: none;
  border-color: var(--accent-color, #2ecc71);
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.2);
}

.address-input {
  position: relative;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  margin-top: 5px;
}

.dropdown-item {
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: var(--light-shade-bg, #f0f5f3);
}

.terms-container {
  margin-top: 10px;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.terms-checkbox input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--accent-color, #2ecc71);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  position: relative;
}

.terms-checkbox input[type="checkbox"]:checked {
  background-color: var(--accent-color, #2ecc71);
  border-color: var(--accent-color, #2ecc71);
}

.terms-checkbox input[type="checkbox"]:checked::after {
  content: '✔';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}

.terms-text {
  font-size: 0.8rem;
  color: var(--text-dark, #2c3e50);
  opacity: 0.8;
}

.terms-text a {
  color: var(--accent-color, #2ecc71);
  text-decoration: none;
}

.submit-button {
  width: 100%;
  padding: 12px;
  border-radius: 50px;
  background-color: var(--text-dark);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  margin-top: 10px;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.login-link {
  text-align: center;
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-dark, #2c3e50);
  opacity: 0.7;
  cursor: pointer;
}

.login-link:hover {
  text-decoration: underline;
  opacity: 1;
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
