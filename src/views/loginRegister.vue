<template>
  <div class="landing-page">
    <div class="container">
      <div class="cont_logo" @click="openLogoLink"></div>
      <h1 class="title">{{ $t("Welcome to Trueque") }}</h1>
      <div class="button-group">
        <button @click="signIn" class="submit-button sign-in">{{ $t("Sign In") }}</button>
        <button @click="signUp" class="submit-button sign-up">{{ $t("Sign Up") }}</button>
      </div>
      <!-- <p class="create-account">{{ $t("{{ $t("New to Trueque?") }}") }}<span @click="signUp" style="margin-left: 5px;">{{ $t("{{ $t("Create an account") }}") }}</span></p> -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const signUp = () => {
  router.push({ name: 'register' });
};

const signIn = () => {
  router.push({ name: 'login' });
};

const openLogoLink = () => {
  window.open('https://www.trueque.art/#/how-it-works', '_blank');
}

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

/* .background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  z-index: -1;
} */

.container {
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: 24px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.cont_logo {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 50%;
  background: url("../assets/logotruequeRounded.webp") no-repeat center center;
  background-size: cover;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.title {
  margin-top: 40px;
  color: var(--text-dark);
  font-size: 1.8rem;
  font-weight: 600;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
}

.submit-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sign-in {
  background: var(--text-dark);
  color: white;
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
}

.sign-up {
  background: var(--accent-color-darker);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.create-account {
  margin-top: 20px;
  color: var(--text-dark);
  opacity: 0.7;
  font-size: 0.9rem;
}

.create-account span {
  color: var(--accent-color);
  cursor: pointer;
  font-weight: 600;
}

/* Responsive Adjustments */
@media screen and (max-width: 375px) {
  .container {
    width: 95%;
    padding: 20px 15px;
  }

  .title {
    font-size: 1.6rem;
  }

  .logo-container {
    width: 80px;
    height: 80px;
    top: -40px;
  }
}

/* Ensure proper display on different devices */
@media screen and (min-width: 768px) {
  .container {
    max-width: 450px;
  }
}
</style>
