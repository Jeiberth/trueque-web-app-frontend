<template>
<div class="landing-page">
  <div class="container">
    <div class="cont_logo"></div>
    <h1 class="title">{{ $t("Log In") }}</h1>
    <form @submit.prevent="handleSubmit" class="form">
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
        <p class="forgot" @click="goToRecoverPassword">{{  $t("Forgot your password?")  }}</p>
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
        {{ $t("Log In") }}
      </button>

      <p class="createLabel" @click="goToRegister">
        {{ $t("Don't have an account?") }} <strong>{{ $t("Create one")  }}</strong>
      </p>
    </form>

    <successErrorCard
      :type="type"
      :text="text"
      :launch="showSuccessErrorCard"
    ></successErrorCard>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import swapApiResource from "../api/swapResource"
import overlay from "./components/overlay.vue"
import successErrorCard from './components/successErrorCard.vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const store = useStore();
const swapResource = new swapApiResource();
const router = useRouter();

const type = ref("error");
const text = ref("The provided credentials are incorrect");
const showSuccessErrorCard = ref(false);

const email = ref('');
const password = ref('');
const agreedToTerms = ref(false);

onMounted(() => {
  store.commit("setLoading", false);
})

const goToRegister = () => {
  router.push({ name: 'register' });
};

const goToRecoverPassword = () => {
  router.push({ name: 'emailPasswordReset' });
};

const handleSubmit = () => {
  if (!agreedToTerms.value) {
    return;
  }

  store.commit("setLoading", true);
  swapResource
    .login({ email: email.value, password: password.value })
    .then((response) => {
      if ('token' in response) {
        store.dispatch('setAuthData', { token: response.token , userId: response.user_id });
        localStorage.setItem('access_token', response.token);
        store.dispatch('initEcho');
        locale.value = response.language;

        store.commit("setCachedSwipes", response.things);
        store.commit('setUserDetails', response.userDetails);
        store.commit('setMatches', response.userChats);

        router.push({ name: 'swaps' });
      } else if('verify' in response) {
        type.value = "info";
        text.value = t(response.message);
        showSuccessErrorCard.value = true;
        setTimeout(() => {
          showSuccessErrorCard.value = false;
        }, 2800);
        router.push({ name: 'verifyEmail'});
      } else {
        showSuccessErrorCard.value = true;
        setTimeout(() => {
          showSuccessErrorCard.value = false;
        }, 2800);
      }
    })
    .catch((error) => {
      text.value = t("Email or password are incorrect.");
      showSuccessErrorCard.value = true;
      setTimeout(() => {
        showSuccessErrorCard.value = false;
      }, 2800);
    })
    .finally(() => {
        store.commit("setLoading", false);

    });
};
</script>

<style scoped>

.landing-page {
  position: relative;
  min-height: calc(var(--vh, 1vh) * 100);
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
  margin: auto;
  padding: 30px 20px;
  border-radius: var(--border-radius, 24px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.cont_logo {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: url("../assets/logotruequeRounded.webp") no-repeat center center;
  background-size: cover;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
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
  gap: 15px;
}

.input-group {
  margin-top: 10px;
}

.inputLogin {
  padding: 12px 20px;
  border: 1px solid var(--light-shade-bg, #f0f5f3);
  background-color: var(--light-shade-bg, #f0f5f3);
  /* box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); */
  border-radius: 50px;
  width: 100%;
  font-family: var(--primary-font, 'Poppins', sans-serif);
}

.forgot {
  width: 100%;
  text-align: right;
  margin-top: 10px;
  margin-bottom: 0;
  font-size: 0.8rem;
  color: var(--text-dark, #2c3e50);
  opacity: 0.7;
  cursor: pointer;
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
}

.terms-checkbox input[type="checkbox"]:checked {
  background-color: var(--accent-color, #2ecc71);
  border-color: var(--accent-color, #2ecc71);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='10' viewBox='0 0 12 10' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='1 5.5 4 8.5 11 1.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

.terms-text {
  font-size: 0.7rem;
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
  font-family: var(--primary-font, 'Poppins', sans-serif);
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.createLabel {
  text-align: center;
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-dark, #2c3e50);
  opacity: 0.7;
  cursor: pointer;
}

.createLabel strong {
  color: var(--accent-color, #2ecc71);
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
