<template>
    <div class="profile-container">
        <profileInfo :userProfileImg="userProfile.userProfileImg"
                    :userName="userProfile.userName"
                    :owner='true'
                    :rating="userProfile.rating"
                    :things="userProfile.things"
                    :swaps="userProfile.swaps"
                    @addThing="addThing()"
                    @editUser="editUser()"
                    @editProfile="editProfile()"/>
        <tabChatsRates :tab1="$t('Things')" :tab2="$t('Reviews')">
            <template #firstTap>
                <div class="scroll-content">
                    <thingCard
                        v-for="thing in things"
                        :key="thing.id"
                        :thing_id="thing.id"
                        :name="thing.name"
                        :description="thing.description"
                        :price="thing.price"
                        :condition="thing.condition_name"
                        :imageUrl="thing.imagesUrl"
                        :owner="true"
                        :noOwner="false"
                        :forOffer="false"
                        @editThing="handleEdit(thing)"
                    />
                </div>
                <h2 class="thereNo" v-if="!things || (Array.isArray(things) && things.length === 0)">{{ $t("Add your first item and start trading today!") }}</h2>
            </template>
            <template #secondTap>
                <div class="scroll-content">
                    <ratingCard
                        v-for="(rating, index) in ratings"
                        :key="index"
                        :userName="rating.userName"
                        :ratingScore="rating.ratingScore"
                        :ratingComment="rating.ratingComment"
                        :ratingCreatedAt="rating.ratingCreatedAt"
                    />
                    <h2 class="thereNo" v-if="!ratings || (Array.isArray(ratings) && ratings.length === 0)">{{ $t("Complete a trade to get your first review!") }}</h2>
                </div>
            </template>
        </tabChatsRates>
    </div>
</template>


<script setup>
    import { ref, onMounted, computed } from "vue";
    import feather from "feather-icons";
    import profileInfo from "../components/profileInfo.vue";
    import thingCard from "../components/thingCard.vue";
    import tabChatsRates from "../components/tabChatsRates.vue";
    import ratingCard from "../components/ratingCard.vue";
    import swapApiResource from "../../api/swapResource"
    import { useRoute, useRouter } from "vue-router";
    import { useStore } from 'vuex'
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();
    const store = useStore();
    const swapResource = new swapApiResource();
    const router = useRouter();
    const route = useRoute();

    const userIdAuth = store.getters.getUserId;
    const things = ref([]);
    const ratings = ref([]);

    const userDetails = computed(() => store.getters.getUserDetails);

    const userProfile = computed(() => {
        if (!userDetails.value) return {
            userProfileImg: '',
            userName: '',
            owner: false,
            rating: 0,
            things: 0,
            swaps: 0
        };

        return {
            userProfileImg: userDetails.value.user.profile_picture,
            userName: userDetails.value.user.name,
            owner: userDetails.value.owner,
            rating: userDetails.value.average_rating,
            things: userDetails.value.things_count,
            swaps: userDetails.value.swaps
        };
    });

    onMounted(async () => {
        store.commit("setLoading", true);

        // Only fetch if we don't already have the data
        if (!userDetails.value) {
            try {
                await store.dispatch('fetchUserDetails');
                // Update local component state with data from store
                things.value = userDetails.value.things;
                ratings.value = userDetails.value.ratings;
            } catch (error) {
                console.error('Failed to load user details:', error);
            }
        } else {
            // Use existing data from store
            things.value = userDetails.value.things;
            ratings.value = userDetails.value.ratings;
        }

        feather.replace();
        store.commit("setLoading", false);
    });

    // Rest of your component methods remain the same...
    const handleEdit = (thing) => {
        router.push({ name: "editThing", query: { thing: JSON.stringify(thing) } });
    };

    const addThing = () => {
        router.push({ name: "newthing" });
    };

    const editProfile = () => {
        router.push({ name: "editProfile" });
    };

    const editUser = async () => {
        store.commit("setLoading", true);
        await swapResource.logout();
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        // await swapResource.unregisterFcmToken({ token: store.getters.getFcmToken })
        store.dispatch('logout');
        router.push({ name: 'login' });
    }

</script>


<style scoped>

    .thereNo {
        display: block;
        text-align: center;
        color: rgba(255, 255, 255, 0.856);
        font-family: monospace; /* Ensures even spacing */
        white-space: pre-line; /* Keeps line breaks */
        margin: 25px;
    }

</style>



<!-- <script setup>
    import { ref, onMounted, reactive, onBeforeUnmount } from "vue";
    import feather from "feather-icons";
    import profileInfo from "../components/profileInfo.vue";
    import thingCard from "../components/thingCard.vue";
    import tabChatsRates from "../components/tabChatsRates.vue";
    import ratingCard from "../components/ratingCard.vue";
    import swapApiResource from "../../api/swapResource"
    import { useRoute, useRouter } from "vue-router";
    import { useStore } from 'vuex'
    import { useI18n } from 'vue-i18n';    const { t } = useI18n();

    const store = useStore(); // Access Vuex store
    const swapResource = new swapApiResource();
    const router = useRouter();
    const route = useRoute();

    const userIdAuth = store.getters.getUserId;
    const userProfile = ref({
        userProfileImg: '',
        userName: '',
        owner: false,
        rating: 0,
        things: 0,
        swaps: 0
    });
    const things = ref();
    const ratings = ref();

    onBeforeUnmount(() => {
        store.commit("setLoading", true);
    })

    onMounted(async () => {

        await swapResource
            .getUserDetails({userId: userIdAuth})
            .then((response) => {

                things.value = response.things;
                ratings.value = response.ratings;

                //profile info component props
                userProfile.value.userProfileImg = response.user.profile_picture;
                userProfile.value.userName = response.user.name;
                userProfile.value.owner = response.owner;
                userProfile.value.rating = response.average_rating;
                userProfile.value.things = response.things_count;
                userProfile.value.swaps = response.swaps;

            });

        feather.replace();
        store.commit("setLoading", false);
    });

    const handleEdit = (thing) => {
      router.push({ name: "editThing", query: { thing: JSON.stringify(thing) } });
    };

    const addThing = () => {
      router.push({ name: "newthing" });
    };

    const editProfile = () => {
      router.push({ name: "editProfile" });
    };

    const editUser = async () => {
      store.commit("setLoading", true);
      await swapResource
            .logout()
            .then((response) => {
        });
        store.dispatch('logout');
      router.push({ name: 'login' });
    }

</script> -->
