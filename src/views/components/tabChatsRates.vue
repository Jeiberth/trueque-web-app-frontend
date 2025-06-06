<template>
  <div>
    <div class="tabs-container">
      <div class="tab" :class="{ active: selectedTab === 'firstTap' }" @click="selectTab('firstTap')">
        {{tab1}}
      </div>
      <div class="tab" :class="{ active: selectedTab === 'secondTap' }" @click="selectTab('secondTap')">
        {{tab2}}
      </div>
    </div>

    <div class="tab-content-container" :class="{ 'chat-user-route': isChatUserRoute, 'profile-route': isProfileRoute, 'offer-route': isOfferRoute  }">
      <transition name="fade" mode="out-in">
        <div v-if="selectedTab === 'firstTap'" class="tab-content" key="firstTap">
          <slot name="firstTap"></slot>
        </div>
        <div v-else class="tab-content" key="secondTap">
          <slot name="secondTap"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';

  const { t } = useI18n();
  const selectedTab = ref('firstTap');
  const route = useRoute();

  function selectTab(tab) {
    selectedTab.value = tab;
  }

  const props = defineProps({
    tab1: { type: String, required: true },
    tab2: { type: String, required: true },
  });

  // Check if current route matches the chat user pattern
    const isChatUserRoute = computed(() => {
        return route.path.startsWith('/dashboard/chat/user') && route.query.userId;
    });

    // Check if current route is the profile route
    const isProfileRoute = computed(() => {
        return route.path === '/dashboard/profile';
    });

    const isOfferRoute = computed(() => {
        return route.path === '/dashboard/chat/makeOffer' || route.path === '/dashboard/chat/watchOffer';
    });

</script>

<style scoped>
    .tabs-container {
        display: flex;
        justify-content:space-evenly;
        margin-bottom: 10px;
        margin-top: 20px;
        font-weight: 600;
        font-size:larger;
    }

    .tab {
        width: 42%;
        height: 50px;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 50px;
        padding: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
        text-align: center;
        cursor: pointer;
        transition: background-color 1s ease, color 1s ease, box-shadow 1s ease, border 1s ease;
    }

    .tab.active {
        background-color: white; /* Change to desired active background color */
        color: black;
        /* border: 2px solid darkslategray;
        box-shadow: inset 0 4px 15px rgba(65, 155, 95, 0.5), 0 4px 15px rgba(0, 0, 0, 0.219); */
        border: 2px solid rgb(0, 0, 0);
        box-shadow: inset 0 4px 15px rgba(0, 0, 0, 0.5), 0 4px 15px rgba(0, 0, 0, 0.219);
    }

    .tab:not(.active) {
        border: 2px solid transparent; /* or a default color */
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219); /* Default shadow */
    }

    .tab-content {
        margin-top: 10px;
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

    /* .tab-content-container{
        height: calc(100vh - 300px - 85px);
        overflow-y: auto;
    } */

    .tab-content-container {
        display: flex;
        flex-direction: column;
        padding: 0px;
        /* height: calc(100vh - 300px - 85px); */
        overflow-y: auto;
        mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            white 4%,
            white 96%,
            transparent 100%
        );
        -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            white 4%,
            white 96%,
            transparent 100%
        );
        position: relative;
    }


    .tab-content-container.chat-user-route {
        height: calc(100vh - 260px - 85px);
    }

    .tab-content-container.profile-route {
        height: calc(100vh - 300px - 85px);
    }

    .tab-content-container.offer-route {
        height: calc(100vh - 260px - 85px);
    }

    .tab-content-container::-webkit-scrollbar {
        display: none;
    }


</style>
