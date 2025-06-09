<template>
    <div class="content-container">
        <!-- Scrollable content area -->
        <div class="scrollable-content">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>

        <div class="backgmess"></div>
        <div class="backgprof"></div>

        <!-- Fixed tabs at the bottom -->
        <div class="tabs-container">
          <!-- Use router-link for tab navigation -->
            <router-link to="/dashboard/chats" class="tab first" :class="{ active: $route.path.startsWith('/dashboard/chats') }">
                <div v-if="totalUnreadAndOffersCount > 0" class="circleNotf" :class="{ iconBackwhite: $route.path.startsWith('/dashboard/chats') }"></div>
                <!-- <i data-feather="message-square" class="icon" :class="{ iconwhite: $route.path === '/dashboard/chats' }"></i> -->
                <i class="fa-regular fa-comment icon" :class="{ iconwhite: $route.path.startsWith('/dashboard/chats') }"></i>
            </router-link>

          <router-link to="/dashboard/swaps" class="tab tab-swap" :class="{ active: $route.path.startsWith('/dashboard/swaps') }">
                <!-- <i data-feather="shuffle" class="icon" :class="{ iconwhite: $route.path === '/dashboard/swaps' }"></i> -->
                <i class="fa-solid fa-shuffle icon" :class="{ iconwhite: $route.path.startsWith('/dashboard/swaps') }"></i>
          </router-link>

            <router-link to="/dashboard/profile" class="tab third" :class="{ active: $route.path.startsWith('/dashboard/profile') }">
                <!-- <i data-feather="user" class="icon" :class="{ iconwhite: $route.path === '/dashboard/profile' }"></i> -->
                <i class="fa-regular fa-user icon" :class="{ iconwhite: $route.path.startsWith('/dashboard/profile') }"></i>
            </router-link>
        </div>
    </div>
</template>

<script setup>

    import { computed } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore();

    const totalUnreadAndOffersCount = computed(() => store.getters.totalUnreadAndOffersCount);

</script>


<style scoped>
.content-container {
  display: flex;
  flex-direction: column;
  height: calc(var(--vh, 1vh) * 100);
  overflow: hidden;
  background-color: var(--primary-gradient);
  align-items: center;
}

.scrollable-content {
  /* flex: 1;
  overflow-y: auto;
  padding-bottom: 60px;  */
  max-width: 500px;
  width: 100%;
}

.tabs-container {
  background-color: transparent;
  display: flex;
  justify-content: space-between; /* To evenly space out the tabs */
  /* position: fixed; */
  bottom: 0;

  width: 100%; /* Same width as content but consider padding */

  max-width: 500px;
  margin: auto;
  margin-bottom: 10px;

  padding: 10px;
  z-index: 21;
  align-items: center;
  box-sizing: border-box;
  left: -1px;
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
  width: 55px;
  height: 55px;
}

.icon {
  color: black;
  font-size: 30px;
  width: 30px;
  height: 30px;
}

/* .tab.active {
  background-color: white;
  color: black;
  border: 2px solid darkslategray;
  box-shadow: inset 0 4px 15px rgba(65, 155, 95, 0.5), 0 4px 15px rgba(0, 0, 0, 0.219);
} */

.tab.active {
    background-color: #2c3e50;
    /* border: 1px solid rgb(255, 255, 255); */
    /* box-shadow: inset 0 2px 7px rgba(255, 255, 255, 0.5), 0 2px 7px rgba(0, 0, 0, 0.219); */
}

.tab.active i {
    color: white;
    /* box-shadow: inset 0 2px 7px rgba(255, 255, 255, 0.5), 0 2px 7px rgba(0, 0, 0, 0.219); */
}

.iconwhite{
    color: white ;
}

.iconBackwhite{
  background-color: white !important;
}

.circleNotf{
    background-color: #2c3e50;
    position: fixed;
    width: 15px;
    height: 15px;
    transform: translate(30px, -15px);
    border-radius: 25pc;
}

.first {
  align-self: flex-end; /* Position in the bottom left */
  background-color: white;

}

.tab-swap {
  position: relative;
  width: 65px;
  height: 65px;
  border-radius: 50px;
  align-content: center;
  background-color: white;
  margin: 0 auto; /* Center it in the middle */
}

.third {
  align-self: flex-end; /* Position in the bottom right */
  background-color: white;
}

.backgmess {
  position: fixed;
  width: 160px;
  height: 160px;
  border-radius: 50px;
  background-color: transparent;
  filter: blur(10px);
  z-index: 20;
  left: -70px;
  bottom: -70px;
}

.backgprof {
  position: fixed;
  width: 160px;
  height: 160px;
  border-radius: 50px;
  background-color: transparent;
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
