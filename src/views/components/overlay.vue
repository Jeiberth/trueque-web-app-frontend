<template>
  <div :class="['wait', { loaded: isReady }]">
  <!-- <div class="wait"> -->
    <div class="spinner">
      <i class="fa-solid fa-shuffle shuffle"></i>
    </div>
  </div>
</template>

<script setup>

  import { ref, onMounted, nextTick } from 'vue';

  const isReady = ref(false);

  // Set viewport height CSS variable
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  onMounted(async () => {
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);

    await nextTick();

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    isReady.value = true;
  });

</script>

<style>

  /* Global styles — should be in your base CSS or app setup */
  html,
  body {
    height: 100%;
    overflow: hidden;
  }
  
</style>

<style scoped>
.wait {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 3000000;

  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;

  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 800px; /* Enables 3D for children */
}

.wait.loaded {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.spinner {
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 50%;
  z-index: 3300000;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: spin3D 0.8s linear infinite;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;
}

.shuffle {
  font-size: 24px;
  color: black;
  pointer-events: none;
}

@keyframes spin3D {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}
</style>
