<template>
    <div class="content-container">
      <!-- Scrollable content area -->
      <div class="scrollable-content">
        <transition name="fade" mode="out-in">
          <div v-if="selectedTab === 'chats'" class="tab-content" key="chats">
            <slot name="chats"></slot>
          </div>
          <div v-else-if="selectedTab === 'swaps'" class="tab-content" key="swaps">
            <slot name="swaps"></slot>
          </div>
          <div v-else class="tab-content" key="profile">
            <slot name="profile"></slot>
          </div>
        </transition>
      </div>

      <div class="backgmess"></div>
      <div class="backgprof"></div>

      <!-- Fixed tabs at the bottom -->
      <div class="tabs-container">
        <div class="tab" :class="{ active: selectedTab === 'chats' }" @click="selectTab('chats')">
            <i data-feather="message-square" :class="{ active: selectedTab === 'chats' }"></i>
        </div>
        <div class="tab tab-swap" :class="{ active: selectedTab === 'swaps' }" @click="selectTab('swaps')" style="background-color: white; ">
            <i data-feather="shuffle" :class="{ active: selectedTab === 'swaps' }"></i>
        </div>
        <div class="tab" :class="{ active: selectedTab === 'profile' }" @click="selectTab('profile')">
            <i data-feather="user" :class="{ active: selectedTab === 'profile' }"></i>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { onMounted, ref } from "vue";
  import feather from "feather-icons";

  const selectedTab = ref('chats');

  function selectTab(tab) {
    selectedTab.value = tab;
  }

    onMounted(() => {
        feather.replace();
    });
  </script>

  <style scoped>
    .content-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      background-color: white;
    }

    .scrollable-content {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 60px; /* Space for the fixed tabs */
    }

    .tabs-container {
        background-color: transparent;
        display: flex;
        justify-content: space-between;
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: 10px 10px;
        z-index: 21;
        align-items: center;
        overflow: hidden; /* Ensure pseudo-element is clipped */
        left: -1px !important;
    }

    .tab {
      text-align: center;
      cursor: pointer;
      padding: 10px;
      transition: background-color 1s ease, color 1s ease, box-shadow 1s ease, border 1s ease;
      border: 2px solid transparent;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
      border-radius: 20px;
      margin: 0 5px;
      width: 50px;
      height: 50px;

    }
/*
    .tab.active {
      background-color: white;
      color: black;
      border: 2px solid darkslategray;
      box-shadow: inset 0 4px 15px rgba(65, 155, 95, 0.5), 0 4px 15px rgba(0, 0, 0, 0.219);
    } */

    .tab.active {
      background-color: #2c3e50;
      color: white;
    }

    .tab-swap{
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 50px;
      align-content: center;
    }

    .backgmess{
        position: fixed;
        width: 160px;
        height: 160px;
        border-radius: 50px;
        background-color: white;
        filter: blur(10px);
        z-index: 20;
        left: -70px;
        bottom: -70px;
    }


    .backgprof{
        position: fixed;
        width: 160px;
        height: 160px;
        border-radius: 50px;
        background-color: white;
        filter: blur(10px);
        z-index: 20;
        right: -70px;
        bottom: -70px;
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
      transform: translateY(10px);
    }
  </style>
