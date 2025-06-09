<template>
    <div>
        <h1 class="tittle">{{  $t("Chats")  }}</h1>
        <div class="line"></div>
        <h2 class="noChats" v-if="usersWithMatch.length == 0">{{ $t("No matches, no messages—yet! Swipe more to find great exchanges.") }}</h2>
        <div class="scrolling">
            <matchCard
                v-for="(user, index) in usersWithMatch"
                :key="index"
                :chatId="user.chatId"
                :userName="user.name"
                :image="user.profile_picture"
                :offer="user.offers_count"
                :message="user.unread_messages_count"
                @selectChat="selectChat(user)"
            />
        </div>
    </div>
</template>

<script setup>

    import matchCard from "./components/matchCard.vue";
    import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
    import swapApiResource from "../api/swapResource";
    import { useRouter } from 'vue-router';
    import feather from "feather-icons";
    import overlay from "./components/overlay.vue";
    import { useStore } from 'vuex'


    const store = useStore();

    const router = useRouter()
    const swapResource = new swapApiResource();

    onBeforeUnmount(() => {
        store.commit("setLoading", true);
    })

    //const usersWithMatch = ref([]);
    const usersWithMatch = computed(() => store.getters.getMatches || []);

    onMounted( async () => {
        feather.replace();

        // await swapResource
        //     .getUserChats()
        //     .then((response) => {
        //         usersWithMatch.value = response;
        //     });

        if (!store.getters.getMatches) {
            try {
                store.commit("setLoading", true);
                await store.dispatch("fetchMatches");
            } catch (error) {
                console.error("Error loading matches:", error);
            } finally {
                store.commit("setLoading", false);
            }
        } else {
            store.commit("setLoading", false);
        }

        store.commit("setLoading", false);
    });


    const selectChat = (user) => {
      router.push({
        name: 'messages',
        query: {
            chatId: user.chat_id,
            userName: user.name,
            image: user.profile_picture,
            userId: user.userId
        }
      });
    };

</script>

<style scoped>

    .noChats {
        display: block;
        text-align: center;
        color: rgba(255, 255, 255, 0.856);
        font-family: monospace; /* Ensures even spacing */
        white-space: pre-line; /* Keeps line breaks */
        margin: 25px;
    }

    .tittle{
        color: white;
        margin-top: 15px;
        margin-left: 15px;
    }

    .line {
        display: block;
        width: 90%;
        margin-left: 5%;
        height: 2px;
        margin-top: 0px;
        margin-bottom: 15px;
        background-color: white;
    }


   .scrolling {
        display: flex;
        flex-direction: column;
        padding: 0px;
        height: calc(calc(var(--vh, 1vh) * 100) - 100px - 85px)
;
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

    .scrolling::-webkit-scrollbar {
        display: none;
    }


</style>
