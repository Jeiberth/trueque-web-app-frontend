<template>
    <div>
        <successErrorCard :type="typeSuccessErrorCard" :text="textSuccessErrorCard" :launch="showSuccessErrorCard"></successErrorCard>
        <profileInfo :userProfileImg="userProfile.userProfileImg"
                    :userName="userProfile.userName"
                    :owner='false'
                    :rating="userProfile.rating"
                    :things="userProfile.things"
                    :swaps="userProfile.swaps"
                    :topProfile="false"/>
        <tabChatsRates :tab1="$t('Things')" :tab2="$t('Reviews')">
            <template #firstTap>
                <div>
                    <thingCard
                        v-for="thing in things"
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
                        @seeThing="seeThing(thing)"
                    />
                </div>
            </template>
            <template #secondTap>
                <div>
                    <newRating @submitRating="submitRating" v-if="canRate"></newRating>
                    <ratingCard
                        v-for="(rating, index) in ratings"
                        :key="index"
                        :userName="rating.userName"
                        :ratingScore="rating.ratingScore"
                        :ratingComment="rating.ratingComment"
                        :ratingCreatedAt="rating.ratingCreatedAt"
                    />
                    <h2 class="thereNo" v-if="!ratings || (Array.isArray(ratings) && ratings.length === 0)">{{ $t("No reviews yet—be the first to trade!") }}</h2>
                </div>
            </template>
        </tabChatsRates>
    </div>
</template>

<script setup>
    import { ref, onMounted, reactive, onBeforeUnmount, computed } from "vue";
    import feather from "feather-icons";
    import profileInfo from "../components/profileInfo.vue";
    import thingCard from "../components/thingCard.vue";
    import tabChatsRates from "../components/tabChatsRates.vue";
    import ratingCard from "../components/ratingCard.vue";
    import newRating from "../components/newRating.vue";
    import swapApiResource from "../../api/swapResource"
    import { useRoute, useRouter } from "vue-router";
    import successErrorCard from "../components/successErrorCard.vue";
    import { useStore } from 'vuex'
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const store = useStore(); // Access Vuex store
    const swapResource = new swapApiResource();
    const router = useRouter();
    const route = useRoute();
    const userId = route.query.userId;

    const userIdAuth = store.getters.getUserId;

    const profileData = ref(null);
    const things = ref();
    const ratings = ref();
    const canRate = ref();

    const typeSuccessErrorCard = ref('');
    const textSuccessErrorCard = ref('');
    const showSuccessErrorCard = ref(false);

    const userProfile = computed(() => {
        if (!profileData.value) return {
            userProfileImg: '',
            userName: '',
            owner: false,
            rating: 0,
            things: 0,
            swaps: 0
        };

        return {
            userProfileImg: profileData.value.user.profile_picture,
            userName: profileData.value.user.name,
            owner: profileData.value.owner,
            rating: profileData.value.average_rating,
            things: profileData.value.things_count,
            swaps: profileData.value.swaps
        };
    });

    onBeforeUnmount(() => {
        store.commit("setLoading", true);
    })

    onMounted(async () => {

        try {
            store.commit("setLoading", true);

            // Load profile from store or API
            profileData.value = await store.dispatch('fetchUserProfile', userId);

            // Set component data from profile
            things.value = profileData.value.things;
            ratings.value = profileData.value.ratings;
            canRate.value = profileData.value.rateable;

            feather.replace();
        } catch (error) {
            console.error("Error loading user profile:", error);
        } finally {
            store.commit("setLoading", false);
        }

    });

    // const submitRating = async (obj) => {
    //     store.commit("setLoading", true);
    //     await swapResource
    //         .newRating({user_id: userIdAuth, rated_user_id: userId, score: obj.rating, comment: obj.comment})
    //         .then(async (response) => {
    //             typeSuccessErrorCard.value = 'success';
    //             textSuccessErrorCard.value = t('Rating Submitted Successfully');
    //             store.commit("setLoading", false);

    //             await swapResource
    //                 .getUserDetails({userId: userId})
    //                 .then((response) => {
    //                     ratings.value = response.ratings;
    //                 });

    //             showSuccessErrorCard.value = true;
    //             setTimeout(() => {
    //                 showSuccessErrorCard.value = false;
    //             }, 2800);
    //         });
    // };

    const submitRating = (ratingData) => {
        try {
            // store.commit("setLoading", true);

            store.dispatch('submitUserRating', {
                userId: userIdAuth,
                ratedUserId: userId,
                ratingData
            });


            // Show success message
            typeSuccessErrorCard.value = 'success';
            textSuccessErrorCard.value = t('Rating Submitted Successfully');
            showSuccessErrorCard.value = true;

            setTimeout(() => {
                showSuccessErrorCard.value = false;
            }, 2800);
        } catch (error) {
            console.error("Failed to submit rating:", error);
            typeSuccessErrorCard.value = 'error';
            textSuccessErrorCard.value = t('Error submitting rating');
            showSuccessErrorCard.value = true;
            setTimeout(() => {
            showSuccessErrorCard.value = false;
            }, 2800);
        } finally {
            store.commit("setLoading", false);
        }
    };


    const seeThing = (thing) => {
      router.push({ name: "seeThing", query: { thing: JSON.stringify(thing) } });
    };

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
