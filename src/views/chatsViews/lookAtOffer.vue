<template>
    <div>
        <successErrorCard :type="type" :text="text" :launch="showSuccesError"></successErrorCard>
        <div class="card" v-if="!AcceptedYet">
            <div class="rap">
                <i data-feather="check-circle" v-if="iconAccepted" class="iconStyle" style="color: green;"></i>
                <i data-feather="x-circle" v-if="iconRejected" class="iconStyle" style="color: red;"></i>
                <i data-feather="clock" v-if="iconPending" class="iconStyle" style="color: darkcyan;"></i>
            </div>
            <div class="card-body">
                <div class="user-info">
                    <p class="offer">{{ status }}</p>
                </div>
            </div>
        </div>
        <div class="containerDoubleCard" v-if="AcceptedYet">
            <div class="doubleCard" @click="acceptOffer">
                <div class="rap">
                    <i data-feather="check-circle"  class="iconStyle" style="color: green;"></i>
                </div>
                <div class="card-body">
                    <div class="user-info">
                        <p class="offer">{{ $t("Accept") }}</p>
                    </div>
                </div>
            </div>
            <div class="doubleCard" @click="denieOffer" >
                <div class="rap">
                    <i data-feather="x-circle"  class="iconStyle" style="color: red;"></i>
                </div>
                <div class="card-body">
                    <div class="user-info">
                        <p class="offer">{{ $t("Deny") }}</p>
                    </div>
                </div>
            </div>
        </div>
        <tabChatsRates :tab1="$t('My Items')" :tab2="$t('Their Items')">
            <template #firstTap>
                <div>
                    <cashCard type="Cash amount" :isDisabled="true" :cashValue="parseInt(myCash)"/>
                    <thingCard
                        v-for="thing in myThings"
                        :key="thing.id"
                        :thing_id="thing.id"
                        :name="thing.name"
                        :description="thing.description"
                        :price="thing.price"
                        :condition="thing.condition_name"
                        :imageUrl="thing.imagesUrl"
                        :owner="false"
                        :noOwner="true"
                        :forOffer="false"
                        :isForOffer="false"
                        @seeThing="seeThing(thing)"
                    />
                </div>
            </template>
            <template #secondTap>
                <div>
                    <cashCard type="Cash amount" :isDisabled="true" :cashValue="parseInt(hisCash)"/>
                    <thingCard
                        v-for="thing in hisThings"
                        :key="thing.id"
                        :thing_id="thing.id"
                        :name="thing.name"
                        :description="thing.description"
                        :price="thing.price"
                        :condition="thing.condition_name"
                        :imageUrl="thing.imagesUrl"
                        :owner="false"
                        :noOwner="true"
                        :forOffer="false"
                        :isForOffer="false"
                        @seeThing="seeThing(thing)"
                    />
                </div>
            </template>
        </tabChatsRates>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, nextTick, onBeforeMount, onBeforeUnmount } from "vue";
    import tabChatsRates from "../components/tabChatsRates.vue";
    import thingCard from "../components/thingCard.vue";
    import cashCard from "../components/cashCard.vue";
    import successErrorCard from "../components/successErrorCard.vue";
    import feather from "feather-icons";
    import swapApiResource from "../../api/swapResource"
    import { useRoute, useRouter } from "vue-router";
    import overlay from "../components/overlay.vue";
    import { useStore } from 'vuex'
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();

    const store = useStore();



    // Using useRoute to access route params
    const route = useRoute();
    const router = useRouter();
    const swapResource = new swapApiResource();
    const offerId = route.query.offerId;

    const cashOfferedValue = ref(0);
    const cashRequestedValue = ref(0);
    const type = ref('');
    const text = ref('');
    const showSuccesError = ref();

    const iconAccepted = ref();
    const iconRejected = ref();
    const iconPending = ref();
    const status = ref();

    const offerStatus = ref();
    const myThings = ref();
    const hisThings = ref();
    const myCash = ref();
    const hisCash = ref();

    const userId = route.query.userId;

    const AcceptedYet = ref();

    onBeforeUnmount(() => {
        store.commit("setLoading", true);
    })

    // Mock data (replace with your data fetching logic)
    onMounted(async () => {

        // await swapResource
        //     .getOfferWithDetails({ offerId: offerId })
        //     .then((response) => {
        //         offerStatus.value = response.offerStatus;
        //         myThings.value = response.myThings;
        //         hisThings.value = response.hisThings;
        //         myCash.value = response.myCash;
        //         hisCash.value = response.hisCash;
        //     });

        const offer = JSON.parse(route.query.offer);

        offerStatus.value = offer.offerStatus;
        myThings.value = offer.myThings;
        hisThings.value = offer.hisThings;
        myCash.value = offer.myCash;
        hisCash.value = offer.hisCash;

        checkOfferStatus();

        // Wait for DOM updates before replacing icons
        await nextTick();
        feather.replace();

        store.commit("setLoading", false);

    });


    const seeThing = (thing) => {
      router.push({ name: "seeThing", query: { thing: JSON.stringify(thing) } });
    };

    const checkOfferStatus = async () => {
        if (offerStatus.value == 1 || offerStatus.value == 2) {
            status.value = t("Accepted");
            iconAccepted.value = true;
            iconRejected.value = false;
            iconPending.value = false;
            AcceptedYet.value = false;
        } else if (offerStatus.value == 3 || offerStatus.value == 4) {
            status.value = t("Rejected");
            iconAccepted.value = false;
            iconRejected.value = true;
            iconPending.value = false;
            AcceptedYet.value = false;
        } else if (offerStatus.value == 5) {
            status.value = t("Pending");
            iconAccepted.value = false;
            iconRejected.value = false;
            iconPending.value = true;
            AcceptedYet.value = false;
        } else if (offerStatus.value == 6) {
            status.value = "";
            iconAccepted.value = false;
            iconRejected.value = false;
            iconPending.value = false;
            AcceptedYet.value = true;
        };

         // Wait for DOM updates after the state changes
        await nextTick(() => {
            feather.replace(); // Replace icons (if needed)
        });
    };


    const denieOffer = async () => {
        store.commit("setLoading", true);
        await swapResource
            .changeOfferStatus({ offer_id: offerId, status_id: 3 })
            .then((response) => {
                type.value = 'success';
                text.value = t('The offer was denied');
                showSuccesError.value = true;
                offerStatus.value = 3;
                checkOfferStatus();

                store.commit("updateUserOfferStatus", { userId, offerId, newStatusId: 3 });

                setTimeout(() => {
                    showSuccesError.value = false;
                }, 2800);

            });
        store.commit("setLoading", false);
    }

    const acceptOffer = async () => {
        store.commit("setLoading", true);
        await swapResource
            .changeOfferStatus({ offer_id: offerId, status_id: 1 })
            .then((response) => {
                type.value = 'success';
                text.value = t('The offer was accepted');
                showSuccesError.value = true;

                offerStatus.value = 1;
                checkOfferStatus();

                store.commit("updateUserOfferStatus", { userId, offerId, newStatusId: 1 });

                setTimeout(() => {
                    showSuccesError.value = false;
                }, 2800);
            });
        store.commit("setLoading", false);
    }

</script>

<style scoped>


.card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  display: flex;
  height: 60px;
  width: 180px;
  margin-left: calc((100% - 180px) / 2);
  margin-top: 10px;
  align-items: center;
  justify-content: center; /* Space between children */
  border-radius: 50px;
  flex-direction: row;
  background-color: white;
}

.iconStyle {
  display: inline;
  align-self: flex-start;
  margin-right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 0;
  margin: 0;
}

.card-body {
  display: inline-flex;
  flex-grow: 1; /* Allow card-body to grow */
  padding: 0;
  margin-left: 10px
}

.offer {
  position: relative;
  margin: 0px;
  font-weight: 600;
  font-size: larger;
  padding-bottom: 0px;
  margin-bottom: 0px;
  top: 2px;
  height: 30px;
  color: black;
}

.containerDoubleCard{
    display: flex;
    justify-content:space-evenly;
    margin-bottom: 20px;
    margin-top: 20px;
    font-weight: 600;
    font-size:larger;
}

.doubleCard{
    border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  display: flex;
  height: 60px;
  width: 42%;
  margin-top: 10px;
  align-items: center;
  justify-content: center; /* Space between children */
  border-radius: 50px;
  flex-direction: row;
  background-color: white;
}
</style>
