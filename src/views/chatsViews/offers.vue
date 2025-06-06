<template>
    <div>
        <overlay v-if="loading"></overlay>
        <div class="cont-offer">
            <cardForClick text="Make an Offer" icon="plus-circle" @clicked="makeAnOffer"></cardForClick>
            <offerCard @openOffer="openOffer(offer.id, offer.offer)"
                        v-for="(offer, index) in offers"
                        :offerStatus="offer.status_id"
                        :offerSend="offer.offerSend"
                        :created_at="offer.created_at"
                        :offerId="offer.id">
            </offerCard>
        </div>
    </div>
</template>

<script setup>
    import overlay from "../components/overlay.vue";
    import cardForClick from "../components/cardForClick.vue";
    import offerCard from "../components/offerCard.vue";
    import { ref, onMounted, reactive , onBeforeUnmount, computed } from "vue";
    import feather from "feather-icons";
    import swapApiResource from "../../api/swapResource"
    import { useRoute, useRouter } from "vue-router";
    import { useStore } from 'vuex'
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();

    const store = useStore();

    // Using useRoute to access route params
    const route = useRoute();
    const router = useRouter();

    const loading = ref(false);
    const userId = route.query.userId;
    const chatId = route.query.chatId;
    const swapResource = new swapApiResource();


    onBeforeUnmount(() => {
        store.commit("setLoading", true);
    })

    // const makeOffer = ref(null);
    // const offers = ref([]);

    // onMounted(async () => {
    //     feather.replace();

    //     //Look at offers
    //     await swapResource
    //         .getOffersBetweenUsers({ userId: userId })
    //         .then((response) => {
    //             offers.value = response.offers;
    //             makeOffer.value = response.makeOffer;
    //         });

    //     store.commit("setLoading", false);
    // });


    const offersData = computed(() => store.getters.getUserOffers(userId));
    const offers = computed(() => offersData.value.offers);
    const makeOffer = computed(() => offersData.value.makeOffer);

    onMounted(async () => {
        try {
            store.commit('RESET_OFFERS_COUNT', chatId);
            store.commit("setLoading", true);
            feather.replace();

            await store.dispatch('fetchUserOffers', userId);
        } catch (error) {
            console.error("Error loading offers:", error);
        } finally {
            store.commit("setLoading", false);
        }
    });



    const openOffer = (offerId, offer) => {
        router.push({ name: "watchOffer", query: { offerId: offerId, offer: JSON.stringify(offer), userId: userId } });
    }

    const makeAnOffer = () => {
        router.push({ name: "makeOffer", query: { userId: userId, chatId: chatId, data: JSON.stringify(makeOffer.value) } });
    }

</script>

<style scoped>

    .cont-offer {
        display: flex;
        flex-direction: column;
        padding: 0px;
        height: calc(100vh - 115px - 85px);
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
        margin-top: 5px;
        position: relative;
    }



</style>
