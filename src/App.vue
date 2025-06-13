<template>
    <!-- Display the overlay if loading is true -->
    <overlay v-if="loading"></overlay>
    <router-view></router-view>

</template>

<script setup>
    import { useStore } from 'vuex';
    import { computed, onMounted, watch, onBeforeUnmount  } from 'vue';
    import overlay from "./views/components/overlay.vue";
    import { useRouter } from 'vue-router';
    // import { initEcho, disconnectEcho } from './echo';

    const router = useRouter()

    const store = useStore();

    // Use computed to bind to the reactive Vuex state
    const loading = computed(() => store.getters.getLoading);

    onMounted(() => {

        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        const token = localStorage.getItem('access_token');
        const userId = localStorage.getItem('user_id');
        if (token && userId) {
            store.commit("setToken", token);
            store.commit("setUserId", userId);
        }

        window.addEventListener('resize', setViewportHeight);
        setViewportHeight();

        store.dispatch('fetchData');

    });


    function handleBackGround(data){
        router.push({ name: 'chats' });
    }

    function handleFontGround(data){
        switch (data.type) {
            case "newMessage": {
                store.dispatch('pushNewMessageOther', data.data);
            }
            case "newChat":{
                store.commit("addMatches", data.data);
            }
            case "newOffer":{
                store.commit('addUserOffer', { userId: data.data.userId , newOffer: data.data });
            }
            case "newOfferStatus":{
                store.commit("updateUserOfferStatus", { userId: data.data.userId , offerId: data.data.offerId , newStatusId: data.data.newStatusId, chat_id: data.data.chat_id });
            }
            default:
                return false
        }
    }


    /*

        All these, if return true, means it went trough and worked perfectly, if return false, it did not work

        When a new offer is gotten call this one
        store.commit('addUserOffer', { userId, newOffer: response }); done

        When a offer already existent, its status gets updated
        store.commit("updateUserOfferStatus", { userId, offerId, newStatusId: 3 });

        When a new match/chat gets created, the data has to be an array with the json
        store.commit("addMatches", response.new_chats); done

        When a new message is gotten, message = whole json model
        store.dispatch('pushNewMessageOther', message); done

    */


</script>
