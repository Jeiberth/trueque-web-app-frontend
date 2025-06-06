<template>
    <div>
        <div>
            <div class="wait"></div>
            <!-- <div class="spinner"><i data-feather="shuffle" class="shuffle"></i></div> -->
            <div class="spinner"><i class="fa-solid fa-shuffle shuffle"></i></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import feather from "feather-icons";

onMounted(() => {
  feather.replace();
});
</script>

<style>
body,
html {
  overflow: hidden; /* Prevents scrolling */
}
</style>

<style scoped>
.wait {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgb(106, 197, 88, 0.4);  */
  background-color: rgba(0, 0, 0, 0.4); /* Green background */
  backdrop-filter: blur(4px); /* Applies blur to the background */
  z-index: 3000000;
}

.spinner {
  position: fixed; /* Center the spinner */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centering adjustment */
  width: 50px;
  height: 50px;
  background-color: white; /* Black spinner */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 3300000;
}

@keyframes spin {
  from {
    transform: translate(-50%, -50%) rotateY(0deg) scale(0.1);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -50%) rotateY(360deg) scale(1.5);
    opacity: 0;
  }
}

.shuffle {
  margin-top: 13px;
  margin-left: 13px;
  z-index: 33;
  font-size: 24px;
  color: black;
}
</style>
