<template>
  <div class="landing-page">
    <div class="container">
      <div class="cont_logo"></div>
      <h1 class="title">{{ $t("Reset Your Password")  }}</h1>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="input-group">
          <input
            type="text"
            id="verCode"
            v-model="verCode"
            required
            class="inputLogin"
            :placeholder="$t('Verification Code')"
          />
        </div>
        <div class="input-group">
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="inputLogin"
            :placeholder="$t('Enter your password')"
          />
        </div>
        <div class="input-group">
          <input
            type="password"
            id="passwordConfirm"
            v-model="passwordConfirm"
            required
            class="inputLogin"
            :placeholder="$t('Confirm your password')"
          />
        </div>
        <button
          type="submit"
          class="submit-button"
        >
          {{ $t("Confirm") }}
        </button>
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
import swapApiResource from "../api/swapResource"
import overlay from "./components/overlay.vue"
import successErrorCard from './components/successErrorCard.vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const store = useStore(); // Access Vuex store
const swapResource = new swapApiResource();
const router = useRouter();

const type = ref("error");
const text = ref("Check all the inputs");
const showSuccessErrorCard = ref(false);

const verCode = ref('');
const password = ref('');
const passwordConfirm = ref('');

const handleSubmit = () => {
  if(password.value !== passwordConfirm.value){
    text.value = t("Both passwords have to be the same.");
    type.value = "error";
    showSuccessErrorCard.value = true;
    setTimeout(() => {
      showSuccessErrorCard.value = false;
    }, 2800);
    return;
  }

  store.commit("setLoading", true);

  swapResource
    .verifyAndChanegPassword({ verCode: verCode.value, password: password.value })
    .then((response) => {
      if (response.success) {
        text.value = t("Password Successfully Changed.");
        type.value = "success";
        showSuccessErrorCard.value = true;
        setTimeout(() => {
          showSuccessErrorCard.value = false;
        }, 2800);
        router.push({ name: 'login' });
      } else {
        text.value = t("Check all inputs.");
        type.value = "error";
        showSuccessErrorCard.value = true;
        setTimeout(() => {
          showSuccessErrorCard.value = false;
        }, 2800);
      }
    })
    .catch((error) => {
      text.value = t("Check all inputs.");
      type.value = "error";
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
  gap: 5px;
}

.input-group {
  margin-top: 10px;
}

.inputLogin {
  padding: 12px 20px;
  border: 1px solid var(--light-shade-bg, #f0f5f3);
  background-color: var(--light-shade-bg, #f0f5f3);
  border-radius: 50px;
  width: 100%;
  font-family: var(--primary-font, 'Poppins', sans-serif);
}

.submit-button {
  width: 100%;
  margin-top: 15px;
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

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
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
