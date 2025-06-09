<template>
    <!-- Desktop background wrapper -->
    <div class="desktop-wrapper">
        <!-- Animated background elements for desktop -->
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
        <div class="bg-orb orb-3"></div>
        <div class="bg-orb orb-4"></div>
        <div class="bg-orb orb-5"></div>
        <div class="bg-orb orb-6"></div>
        <div class="bg-orb orb-7"></div>
        <div class="bg-orb orb-8"></div>

        <!-- Main mobile container -->
        <div class="content-container" :class="{ 'animate-shrink': shouldAnimateBorder && isDesktop }">
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
                    <i class="fa-regular fa-comment icon" :class="{ iconwhite: $route.path.startsWith('/dashboard/chats') }"></i>
                </router-link>

                <router-link to="/dashboard/swaps" class="tab tab-swap" :class="{ active: $route.path.startsWith('/dashboard/swaps') }">
                    <i class="fa-solid fa-shuffle icon" :class="{ iconwhite: $route.path.startsWith('/dashboard/swaps') }"></i>
                </router-link>

                <router-link to="/dashboard/profile" class="tab third" :class="{ active: $route.path.startsWith('/dashboard/profile') }">
                    <i class="fa-regular fa-user icon" :class="{ iconwhite: $route.path.startsWith('/dashboard/profile') }"></i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed, ref, onMounted, onUnmounted } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore();
    const totalUnreadAndOffersCount = computed(() => store.getters.totalUnreadAndOffersCount);

    const shouldAnimateBorder = ref(false);
    const isDesktop = ref(false);

    const checkScreenSize = () => {
        isDesktop.value = window.innerWidth > 500;
    };

    onMounted(() => {
        checkScreenSize();
        if (isDesktop.value) {
            // Start the animation immediately
            requestAnimationFrame(() => {
                shouldAnimateBorder.value = true;
            });
        }
        window.addEventListener('resize', checkScreenSize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', checkScreenSize);
    });
</script>

<style scoped>
/* Desktop wrapper - only visible on larger screens */
.desktop-wrapper {
    width: 100%;
    min-height: calc(var(--vh, 1vh) * 100);
    /* background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); */
    background: #0a0d11;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
}

/* Content container shrink animation for desktop */
@media (min-width: 501px) {
    .content-container.animate-shrink {
        animation: shrinkContainer 1.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
    }

    /* Apply final styles after animation */
    .content-container.animate-shrink {
        animation-fill-mode: forwards;
    }

    @keyframes shrinkContainer {
        0% {
            width: 100vw;
            height: calc(var(--vh, 1vh) * 100);
            max-width: 100vw;
            border-radius: 0;
            box-shadow: none;
            transform: scale(1);
        }
        20% {
            width: 95vw;
            height: calc(var(--vh, 1vh) * 95);
            max-width: 95vw;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(255, 255, 255, 0.2);
        }
        60% {
            width: 520px;
            height: calc(var(--vh, 1vh) * 99);
            max-width: 520px;
            border-radius: 20px;
            box-shadow: 0 15px 45px rgba(255, 255, 255, 0.35);
        }
        100% {
            width: 100%;
            height: calc(var(--vh, 1vh) * 98);
            max-width: 500px;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(255, 255, 255, 0.418);
            transform: scale(1);
        }
    }
}

.bg-orb {
    position: absolute;
    border-radius: 50%;
    opacity: 0.15;
    animation: float 8s ease-in-out infinite;
    filter: blur(1px);
    z-index: 1;
}

/* Large orb - top left corner */
.orb-1 {
    width: 280px;
    height: 280px;
    background: radial-gradient(circle at 30% 30%, #2ecc71 0%, #27ae60 40%, transparent 80%);
    top: 5%;
    left: 8%;
    animation-delay: 0s;
}

/* Medium orb - top right */
.orb-2 {
    width: 220px;
    height: 220px;
    background: radial-gradient(circle at 40% 40%, #79fab5 0%, #2ecc71 50%, transparent 75%);
    top: 15%;
    right: 12%;
    animation-delay: 2.5s;
}

/* Small orb - bottom left */
.orb-3 {
    width: 160px;
    height: 160px;
    background: radial-gradient(circle at 35% 35%, #27ae60 0%, #219653 45%, transparent 70%);
    bottom: 25%;
    left: 15%;
    animation-delay: 5s;
}

/* Large orb - bottom right corner */
.orb-4 {
    width: 320px;
    height: 320px;
    background: radial-gradient(circle at 25% 25%, #2ecc71 0%, #27ae60 35%, #2c3e50 70%, transparent 85%);
    bottom: 8%;
    right: 6%;
    animation-delay: 1s;
}

/* Medium orb - left side */
.orb-5 {
    width: 180px;
    height: 180px;
    background: radial-gradient(circle at 45% 45%, #79fab5 0%, #2ecc71 60%, transparent 80%);
    top: 45%;
    left: 5%;
    animation-delay: 3.5s;
}

/* Small accent orb - right side */
.orb-6 {
    width: 140px;
    height: 140px;
    background: radial-gradient(circle at 40% 40%, #27ae60 0%, #219653 55%, transparent 75%);
    top: 65%;
    right: 8%;
    animation-delay: 6s;
}

/* Additional small orbs for depth */
.orb-7 {
    width: 100px;
    height: 100px;
    background: radial-gradient(circle at 50% 50%, #79fab5 0%, transparent 60%);
    top: 35%;
    left: 25%;
    animation-delay: 4s;
    opacity: 0.08;
}

.orb-8 {
    width: 120px;
    height: 120px;
    background: radial-gradient(circle at 30% 30%, #2ecc71 0%, #27ae60 50%, transparent 70%);
    bottom: 45%;
    right: 25%;
    animation-delay: 7s;
    opacity: 0.1;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
        opacity: 0.15;
    }
    25% {
        transform: translateY(-15px) translateX(8px) scale(1.05) rotate(45deg);
        opacity: 0.12;
    }
    50% {
        transform: translateY(-25px) translateX(15px) scale(1.1) rotate(90deg);
        opacity: 0.18;
    }
    75% {
        transform: translateY(-15px) translateX(8px) scale(1.05) rotate(135deg);
        opacity: 0.12;
    }
}

/* Main mobile container - unchanged mobile design */
.content-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--gradient-reverse);
    align-items: center;
    height: calc(var(--vh, 1vh) * 100);
    width: 100%;
    max-width: 500px;
    margin: auto;
    position: relative;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
    border-radius: 0;
    z-index: 2;
}

/* Desktop enhancements */
@media (min-width: 501px) {
    .content-container {
        /* Initial state for animation - start at full screen */
        width: 100vw;
        height: calc(var(--vh, 1vh) * 100);
        max-width: 100vw;
        border-radius: 0;
        box-shadow: none;
        border: 0px solid rgb(255, 255, 255);
        padding-left: 10px;
        padding-right: 10px;
    }

    /* Final state - only applied after animation completes */
    .content-container:not(.animate-shrink) {
        width: 100%;
        height: calc(var(--vh, 1vh) * 98);
        max-width: 500px;
        border-radius: 24px;
        box-shadow: 0 20px 60px rgba(255, 255, 255, 0.418);
        transition: all 0.3s ease;
    }

    .tabs-container{
        margin-bottom: 5px !important;
    }

    .scrollable-content {
        height: calc(calc(var(--vh, 1vh) * 98) - 95px) !important;
    }


/*
    .desktop-wrapper {
        padding: 20px;
    } */
}

/* All your existing mobile styles remain exactly the same */
.scrollable-content {
    max-width: 500px;
    width: 100%;
    height: 100%;
}

.tabs-container {
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    bottom: 0;
    width: 100%;
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

.tab.active {
    background-color: #2c3e50;
}

.tab.active i {
    color: white;
}

.iconwhite {
    color: white;
}

.iconBackwhite {
    background-color: white !important;
}

.circleNotf {
    background-color: #2c3e50;
    position: fixed;
    width: 15px;
    height: 15px;
    transform: translate(30px, -15px);
    border-radius: 25pc;
}

.first {
    align-self: flex-end;
    background-color: white;
}

.tab-swap {
    position: relative;
    width: 65px;
    height: 65px;
    border-radius: 50px;
    align-content: center;
    background-color: white;
    margin: 0 auto;
}

.third {
    align-self: flex-end;
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

/* Mobile-first: Hide desktop wrapper on small screens */
@media (max-width: 501px) {
    .desktop-wrapper {
        background: none;
        padding: 0;
        min-height: auto;
    }

    .bg-orb {
        display: none;
    }

    .content-container {
        box-shadow: none;
        border: none;
        border-radius: 0;
        height: calc(var(--vh, 1vh) * 100);
    }
}
</style>
