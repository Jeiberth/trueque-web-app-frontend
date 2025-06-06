<template>
    <div>
        <successErrorCard :type="type" :text="text" :launch="showSuccesError"></successErrorCard>
        <div class="card" @click="sendOffer" style="cursor: pointer;">
            <div class="rap">
                <i data-feather="send" class="iconStyle" style="color: black;"></i>
            </div>
            <div class="card-body">
                <div class="user-info">
                    <p class="offer">{{ $t("Send Offer") }}</p>
                </div>
            </div>
        </div>
        <tabChatsRates :tab1="$t('My Items')" :tab2="$t('Their Items')">
            <template #firstTap>
                <div>
                    <cashCard @changeCashValue="changecashRequestedValue" :cashValue='cashRequestedValue' :type="$t('Add cash amount (optional)')"/>
                    <thingCard
                        v-for="thing in myThingsSelected"
                        :key="thing.id"
                        :thing_id="thing.id"
                        :name="thing.name"
                        :description="thing.description"
                        :price="thing.price"
                        :condition="thing.condition_name"
                        :imageUrl="thing.imagesUrl"
                        :owner="false"
                        :noOwner="false"
                        :forOffer="true"
                        :isForOffer="true"
                        :liked="thing.liked"
                        @selectThingForOffer="handleSelectForMyThingsSelected(thing)"
                    />
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
                        :noOwner="false"
                        :forOffer="true"
                        :isForOffer="false"
                        :liked="thing.liked"
                        @selectThingForOffer="handleSelectForMyThings(thing)"
                    />
                </div>
            </template>
            <template #secondTap>
                <div>
                    <cashCard @changeCashValue="changecashOfferedValue" :cashValue='cashOfferedValue' :type="$t('Add cash amount (optional)')"/>
                    <thingCard
                        v-for="thing in HisThingsSelected"
                        :key="thing.id"
                        :thing_id="thing.id"
                        :name="thing.name"
                        :description="thing.description"
                        :price="thing.price"
                        :condition="thing.condition_name"
                        :imageUrl="thing.imagesUrl"
                        :owner="false"
                        :noOwner="false"
                        :forOffer="true"
                        :isForOffer="true"
                        :liked="thing.liked"
                        @selectThingForOffer="handleSelectForHisThingsSelected(thing)"
                    />
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
                        :noOwner="false"
                        :forOffer="true"
                        :isForOffer="false"
                        :liked="thing.liked"
                        @selectThingForOffer="handleSelectForHisThings(thing)"
                    />
                </div>
            </template>
        </tabChatsRates>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, onBeforeUnmount } from "vue";
    import tabChatsRates from "../components/tabChatsRates.vue";
    import thingCard from "../components/thingCard.vue";
    import cashCard from "../components/cashCard.vue";
    import successErrorCard from "../components/successErrorCard.vue";
    import feather from "feather-icons";
    import { useStore } from 'vuex'
    import swapApiResource from "../../api/swapResource"
    import { useRoute, useRouter } from "vue-router";
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();

    const swapResource = new swapApiResource();
    const store = useStore();

    const route = useRoute();
    const router = useRouter();

    const userId = route.query.userId;
    const chatId = route.query.chatId;

    onMounted(async () => {

        // await swapResource
        //     .getUserThings({ userId: userId })
        //     .then((response) => {
        //         myThings.value = response.myThings;
        //         hisThings.value = response.hisThings;
        //     });

        const data = JSON.parse(route.query.data);

        myThings.value = data.myThings;
        hisThings.value = data.hisThings;


        feather.replace();
        store.commit("setLoading", false);
    });

    // onBeforeUnmount(() => {
    //     store.commit("setLoading", true);
    // });

    const myThings = ref([]); // Array of things for the current user
    const hisThings = ref([]); // Array of things for the other user
    const myThingsSelected = ref([]); // Selected things from myThings
    const HisThingsSelected = ref([]); // Selected things from hisThings
    const cashRequestedValue = ref(0);
    const cashOfferedValue = ref(0);
    const type = ref('');
    const text = ref('');
    const showSuccesError = ref(false);

    // Emits
    const emit = defineEmits(["sendOfferEmit"]);

    const sendOffer = async () => {

        if(myThingsSelected.value.length == 0 && HisThingsSelected.value.length == 0 && cashRequestedValue.value == 0 && cashOfferedValue.value == 0){
            type.value = 'error';
            text.value = t('Select what you do not need anymore and choose what you want!');
            showSuccesError.value = true;
            setTimeout(() => {
                showSuccesError.value = false;
            }, 2800);
            return ;
        }

        store.commit("setLoading", true);
        await swapResource
            .createOffer({"to_user_id": userId, "chat_id": chatId, "cash_value_requested": cashRequestedValue.value, "things_from_user": myThingsSelected.value, "cash_value_offered":cashOfferedValue.value, "things_to_user": HisThingsSelected.value})
            .then((response) => {
                store.commit("setLoading", false);
                store.commit('addUserOffer', { userId, newOffer: response });
                type.value = 'success';
                text.value = t('Your offer was send');
                showSuccesError.value = true;
                setTimeout(() => {
                    showSuccesError.value = false;
                }, 2800);
            });

        router.push({ name: "offers", query: { chatId: chatId, userId: userId } });

    }

    const changecashRequestedValue = (cash) => {
      cashRequestedValue.value = cash;
    };

    const changecashOfferedValue = (cash) => {
      cashOfferedValue.value = cash;
    };

    // Function to handle selection of things from myThings
    const handleSelectForMyThings = (thing) => {
        myThingsSelected.value.push(thing);
        myThings.value = myThings.value.filter(t => t.id !== thing.id);
    };

    // Function to handle selection of things from hisThings
    const handleSelectForHisThings = (thing) => {
        HisThingsSelected.value.push(thing);
        hisThings.value = hisThings.value.filter(t => t.id !== thing.id);
    };

    // Function to handle selection of things from myThings
    const handleSelectForMyThingsSelected = (thing) => {
        myThings.value.push(thing);
        myThingsSelected.value = myThingsSelected.value.filter(t => t.id !== thing.id);
    };

    // Function to handle selection of things from hisThings
    const handleSelectForHisThingsSelected = (thing) => {
        hisThings.value.push(thing);
        HisThingsSelected.value = HisThingsSelected.value.filter(t => t.id !== thing.id);
    };

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

</style>
