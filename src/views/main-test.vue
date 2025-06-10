<template>
    <div class="backback">
        <navMainMenu>
            <template #chats>
                <!-- <newThing></newThing> -->
                <!-- <chatContainer/> -->
                <!-- <LookAtOffer></LookAtOffer> -->
                <!--
                <cashCard @changeCashValue="changeCashValue"/>
                 -->
                <!-- <messagesChat></messagesChat> -->

                <!-- <makeOfferView :myThings="" :hisThings="" @sendOfferEmit="sendOffer"></makeOfferView> -->

                <!-- Offer views for a single chat -->
                <cardForClick :text="$t(`Make an Offer`)" icon="plus-circle" @clicked="makeAnOffer"></cardForClick>
                <offerCard @openOffer="openOffer(offer.id)" v-for="(offer, index) in offers" :offerStatus="offer.status_id" :offerSend="offer.offerSend" :created_at="offer.created_at" :offerId="offer.id"></offerCard>

                <!-- main Page -->
                <matchCard
                    v-for="(user, index) in usersWithMatch"
                    :key="index"
                    :chatId="user.chatId"
                    :userName="user.name"
                    :image="user.profile_picture"
                    :offer="user.offers_count"
                    :message="user.unread_messages_count"
                    @selectChat="selectChat(user.chatId)"
                />
            </template>
            <template #profile>
                <div>
                    <profileInfo :userProfileImg="userProfile.userProfileImg" :userName="userProfile.userName" :owner='userProfile.owner' :rating="userProfile.rating" :things="userProfile.things" :swaps="userProfile.swaps" @addThing="addThing()" @editUser="editUser()"/>
                    <tabChatsRates tab1="Things" tab2="Reviews">
                        <template #firstTap>
                            <div>
                                <thingCard
                                    v-for="thing in things"
                                    :key="thing.id"
                                    :thing_id="thing.id"
                                    :name="thing.name"
                                    :description="thing.description"
                                    :price="thing.price"
                                    :condition="thing.condition_id"
                                    :imageUrl="thing.imagesUrl"
                                    :owner="true"
                                    :noOwner="false"
                                    :forOffer="false"
                                    @editThing="handleEdit(thing.thing_id)"
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
                            </div>
                        </template>
                    </tabChatsRates>
                </div>
            </template>
            <template #swaps>
                <overlay v-if="loadingSearching"></overlay>
                <successErrorCard :type="typeSuccessErrorCard" :text="textSuccessErrorCard" :launch="showSuccessErrorCard"></successErrorCard>
                <searchElement @searchThingsEmit="searchThings" @showFiltersEmit="showFiltersEmit()"></searchElement>
                <swipeCard v-if="showThingsAfterSearch" :things="thingsForSwipe" @swipeRight="onSwipeRight" @swipeLeft="onSwipeLeft"  @allSwiped="onAllSwiped"/>
            </template>
        </navMainMenu>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted } from "vue";
    import Swal from 'sweetalert2'
    import matchCard from "./components/matchCard.vue";
    import profileInfo from "./components/profileInfo.vue";
    import thingCard from "./components/thingCard.vue";
    import navMainMenu from "./components/navMainMenu.vue";
    import ratingCard from "./components/ratingCard.vue";
    import tabChatsRates from "./components/tabChatsRates.vue";
    import newRating from "./components/newRating.vue";
    import cashCard from "./components/cashCard.vue";
    import swipeCard from "./components/swipeCard.vue";
    import offerCard from "./components/offerCard.vue";
    import chatContainer from "./components/chatContainer.vue";
    import messagesChat from "./components/messagesChat.vue";
    import overlay from "./components/overlay.vue";

    import successErrorCard from "./components/successErrorCard.vue";
    const typeSuccessErrorCard = ref('');
    const textSuccessErrorCard = ref('');
    const showSuccessErrorCard = ref(false);

    import lookAtOffer from "./components/lookAtOffer.vue";
    import cardForClick from "./components/cardForClick.vue";
    import makeOfferView from "./components/makeOfferView.vue";
    import newThing from "./components/newThing.vue";
    import searchElement from "./components/searchElement.vue";
    import Login from "./components/login.vue";
    import Register from "./components/register.vue";
    import feather from "feather-icons";
    import LookAtOffer from "./components/lookAtOffer.vue";
    import swapApiResource from "./components/swapResource"

    const swapResource = new swapApiResource();
    onMounted(() => {
        feather.replace();
        //Messages
        swapResource
            .getUserChats()
            .then((response) => {
                usersWithMatch.value = response;
            });

        //Look at offers
        swapResource
            .getOffersBetweenUsers("otherUserId")
            .then((response) => {
                offers.value = response;
            });

        //Swipe
        loadingSearching.value = true;
        showThingsAfterSearch.value = false;
        swapResource
            .getFilteredThings()
            .then((response) => {
                thingsForSwipe.value = response;
                showThingsAfterSearch.value = true;
                loadingSearching.value = false;
                if(response == null){ onAllSwiped(); };
            });

        //Profile
        swapResource
            .getUserDetails("myownid")
            .then((response) => {

                things.value = response.things;
                ratings.value = response.ratings;

                //v-if newRating
                canRate.value = response.rateable;

                //profile info component props
                userProfile.value.userProfileImg = response.user.profile_picture;
                userProfile.value.userName = response.user.name;
                userProfile.value.owner = response.owner;
                userProfile.value.rating = response.average_rating;
                userProfile.value.things = response.things_count;
                userProfile.value.swaps = response.swaps;
            });

    });

    const thingsForSwipe = reactive([
      {
        thing_id: 21,
        img: 'src/assets/images/t1.jpg',
        name: 'Item 1',
        price: '10',
        condition: 'New',
        description: 'This is a great item!'
      },
      {
        thing_id: 72,
        img: 'src/assets/images/t2.jpg',
        name: 'Item 2',
        price: '20',
        condition: 'Used',
        description: 'This item is in good condition.'
      },
      {
        thing_id: 10,
        img: 'src/assets/images/t3.jpg',
        name: 'Item 3',
        price: '30',
        condition: 'Like New',
        description: 'Almost new, barely used.'
      },
      {
        thing_id: 89,
        img: 'src/assets/images/t1.jpg',
        name: 'Item 4',
        price: '40',
        condition: 'Refurbished',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed, quis. Ex molestias perspiciatis expedita. Ratione tenetur vitae dolorum provident? Illo rerum dicta temporibus eaque eius amet ducimus blanditiis. Harum, quae!',
      },
    ]);

    const usersWithMatch = ref([
                {
                    userId: 0,
                    userName: "Pedro",
                    image: "src/assets/images/2.jpg",
                    offer: 1,
                    message: 8,
                },
                {
                    userId: 1,
                    userName: "Joe Arroyo",
                    offer: 5,
                    message: 1,
                },
                {
                    userId: 2,
                    userName: "Gonzales",
                    image: "src/assets/images/p2.jpg",
                    offer: 0,
                    message: 4,
                },
                {
                    userId: 3,
                    userName: "Sanchez",
                    image: "src/assets/images/p3.jpg",
                    offer: 0,
                    message: 0,
                },
                {
                    userId: 4,
                    userName: "Natalia",
                    image: "src/assets/images/p1.jpg",
                    offer: 1,
                    message: 0,
                },
                {
                    userId: 5,
                    userName: "Vanessa",
                    image: "src/assets/images/p2.jpg",
                    offer: 9,
                    message: 12, // Adjust if you want to show default values
                },
                {
                    userId: 0,
                    userName: "Pedro",
                    image: "src/assets/images/p2.jpg",
                    offer: 1,
                    message: 8,
                },
                {
                    userId: 1,
                    userName: "Joe Arroyo",
                    offer: 5,
                    message: 1,
                },
                {
                    userId: 2,
                    userName: "Gonzales",
                    image: "src/assets/images/p3.jpg",
                    offer: 0,
                    message: 4,
                },
                {
                    userId: 3,
                    userName: "Sanchez",
                    image: "src/assets/images/p1.jpg",
                    offer: 0,
                    message: 0,
                },
                {
                    userId: 4,
                    userName: "Natalia",
                    image: "src/assets/images/p1.jpg",
                    offer: 1,
                    message: 0,
                },
                {
                    userId: 5,
                    userName: "Vanessa",
                    image: "src/assets/images/p2.jpg",
                    offer: 9,
                    message: 12, // Adjust if you want to show default values
                },
            ],);

    const userProfile = ref({
                userProfileImg: 'src/assets/images/p1.jpg',
                userName: 'JohnDoe',
                owner: true,
                rating: 4.5,
                things: 10,
                swaps: 5,
                });

    const things = ref([
      {
        thing_id: 1,
        name: 'Camera',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam possimus eligendi repudiandae magni non atque facilis totam hic pariatur libero, voluptates dolores perspiciatis ab doloremque commodi voluptatibus corrupti aut quae, tempore sit blanditiis provident impedit. Eveniet quibusdam quidem illo velit autem aliquid nulla! Error in ducimus provident, animi ipsa eum!',
        price: 29.99,
        condition: 'New',
        imageUrl: 'src/assets/images/t3.jpg',
        owner: true,
        noOwner: false,
        forOffer: false,
      },
      {
        thing_id: 2,
        name: 'HeadPhones',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, quos!',
        price: 19.99,
        condition: 'Used',
        imageUrl: 'src/assets/images/t2.jpg',
        owner: false,
        noOwner: true,
        forOffer: false,
      },
      {
        thing_id: 3,
        name: 'Laptop',
        description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed, quis. Ex molestias perspiciatis expedita. Ratione tenetur vitae dolorum provident? Illo rerum dicta temporibus eaque eius amet ducimus blanditiis. Harum, quae!',
        price: 49.99,
        condition: 'New',
        imageUrl: 'src/assets/images/t2.jpg',
        owner: false,
        noOwner: false,
        forOffer: true,
      },
      {
        thing_id: 4,
        name: 'Shoes',
        description: 'Lorem ipsum dolor sit amet.',
        price: 15.00,
        condition: 'Used',
        imageUrl: 'src/assets/images/t2.jpg',
        owner: false,
        noOwner: false,
        forOffer: true,
      },
      {
        thing_id: 5,
        name: 'Watch',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci dolorem, accusantium voluptate corporis laudantium aut eius mollitia magnam voluptas, odit corrupti! Deleniti eligendi architecto cum facere nihil ipsa quos, molestiae fuga cupiditate aliquam, id aperiam tenetur, sint ipsam dolores laboriosam!',
        price: 10.00,
        condition: 'New',
        imageUrl: 'src/assets/images/t1.jpg',
        owner: true,
        noOwner: false,
        forOffer: false,
      },
    ]);

    const ratings = ref([
    {
        userName: 'Alice',
        ratingScore: 4.5,
        ratingComment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam possimus eligendi repudiandae magni non atque facilis totam hic pariatur libero, voluptates dolores perspiciatis ab doloremque commodi voluptatibus corrupti aut quae, tempore sit blanditiis provident impedit. Eveniet quibusdam quidem illo velit autem aliquid nulla! Error in ducimus provident, animi ipsa eum!',
        ratingCreatedAt: '2024-10-01 12:34:56',
    },
    {
        userName: 'Bob',
        ratingScore: 3,
        ratingComment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, quos!',
        ratingCreatedAt: '2024-10-02 14:20:30',
    },
    {
        userName: 'Charlie',
        ratingScore: 5,
        ratingComment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci dolorem, accusantium voluptate corporis laudantium aut eius mollitia magnam voluptas, odit corrupti! Deleniti eligendi architecto cum facere nihil ipsa quos, molestiae fuga cupiditate aliquam, id aperiam tenetur, sint ipsam dolores laboriosam!',
        ratingCreatedAt: '2024-10-03 16:15:45',
    },
    ]);

    const matchMessages = reactive([
    {
        title: '🎉 Match Found!',
        message: "You've found a swap partner! Ready to exchange your items? Let's make this happen!"
    },
    {
        title: '🤝 It’s a Match!',
        message: "Great news! You both want to swap. Tap below to chat and finalize the exchange!"
    },
    {
        title: '🥳 Swap Time!',
        message: "You matched! Let’s get this swap rolling—hit the button to connect!"
    },
    {
        title: '🚀 Match Alert!',
        message: "You’ve got a match! Don’t miss out—click below to start your swap journey!"
    },
    {
        title: '🎊 It’s a Match!',
        message: "You and your match are ready to swap! Message them to arrange the details!"
    },
    {
        title: '💥 Exciting Match!',
        message: "You found someone to swap with! Let’s make this exchange happen!"
    },
    {
        title: '✨ Match Made!',
        message: "Congratulations! You’ve found a great swap partner. Time to chat!"
    },
    {
        title: '🎈 You Matched!',
        message: "Awesome! You matched with someone interested in swapping. Connect now!"
    },
    {
        title: '🌟 Swap Partner Found!',
        message: "You’ve found a swap partner! Ready to chat and arrange the exchange?"
    },
    {
        title: '🎶 It’s a Perfect Match!',
        message: "What a coincidence! You both want to swap. Let’s get started!"
    },
    {
        title: '🔔 Match Notification!',
        message: "You matched with someone looking to swap. Don’t wait—message them now!"
    },
    {
        title: '🏆 Match Success!',
        message: "Great job! You have a match. Time to coordinate your swap!"
    },
    {
        title: '💖 It’s a Great Match!',
        message: "You’ve matched with a fellow swapper! Let’s talk details!"
    },
    {
        title: '💫 You Matched Up!',
        message: "Fantastic! You found a swap partner. Click below to start chatting!"
    },
    {
        title: '🔥 Hot Match!',
        message: "You’ve got a match! Time to connect and finalize your swap!"
    },
    {
        title: '📦 Swap Partner Alert!',
        message: "You matched with someone ready to swap. Reach out to them now!"
    },
    {
        title: '🚦 Match Confirmed!',
        message: "You’ve found a swap partner! Ready to exchange details?"
    },
    {
        title: '💡 Match Found!',
        message: "Great news! You have a match. Start chatting to arrange the swap!"
    },
    {
        title: '🍀 Lucky Match!',
        message: "You matched with someone who wants to swap. Don’t miss your chance!"
    },
    {
        title: '🔗 Connection Established!',
        message: "You’ve got a match! Let’s connect and make that swap happen!"
    },
    {
        title: '🥇 It’s a Winner!',
        message: "You found a swap partner! Ready to start your exchange journey?"
    }
    ]);

    const offers = reactive([]);
    const openOffer = (offerId) => {
        console.log("openOffer", offerId);
    }

    const makeAnOffer = () => {
        console.log("makeAnOffer");
    }

    const handleEdit = (thingId) => {
      console.log('Edit thing:', thingId);
    };

    const selectChat = (chatId) => {
      console.log('selectChat', chatId);
    };

    const changeCashValue = (cash) => {
      console.log('changeCashValue', cash);
    };

    const handleSee = (thingId) => {
      console.log('See thing:', thingId);
    };

    const handleSelectForOffer = (thingId) => {
      console.log('Select thing for offer:', thingId);
    };

    const canRate = ref(false);
    const submitRating = (obj) => {
      console.log('submitRating:', obj.comment, obj.rating);

    };

    const addThing = () => {
      console.log("addThing");
    };

    const editUser = () => {
      console.log("EditUser");
    };

    //swap tap
    const showThingsAfterSearch = ref(true);
    const showFiltersEmit = () => {
        showThingsAfterSearch.value = false;
    }

    const loadingSearching = ref(false); //overlay to show loading
    async const searchThings = (obj) => {
        loadingSearching.value = true;
        showThingsAfterSearch.value = false;
        console.log("searchThings", obj);
        await swapResource
            .getFilteredThings({ category_id: obj.category, condition_id: obj.condition , material_id: obj.material , color_id: obj.color , weight: [ 0 , obj.weight ], price: [ 0 , obj.price ], search: obj.searchTerm })
            .then((response) => {
                thingsForSwipe.value = response;
                showThingsAfterSearch.value = true;
                loadingSearching.value = false;
                if(response == null){ onAllSwiped(); };
            });
    };

    const onSwipeRight = (thingId) => {
        setTimeout(() => {
            thingsForSwipe.find(thing => thing.thing_id === thingId).swiped = true;
        }, 400);
        swapResource
            .swipeRight({ thing_id: thingId })
            .then((response) => {
                if(response.match){
                    Swal.fire({
                        title: matchMessages[Math.floor(Math.random() * matchMessages.length)].title,
                        text: matchMessages[Math.floor(Math.random() * matchMessages.length)].message,
                        icon: "success",
                        iconHtml: '<i data-feather="shuffle" class="custom-icon"></i>',
                        timer: 2800,
                        timerProgressBar: true,
                        showConfirmButton: false, // Remove the OK button
                        backdrop: true,
                        customClass: {
                            popup: 'custom-modal', // Custom modal class
                            icon: 'custom-icon-wrapper', // Custom icon wrapper class
                        },
                        willOpen: () => {
                            feather.replace(); // Replace <i> tags with Feather icons
                        },
                    });
                }
            });
    };

    const onSwipeLeft = (thingId) => {
        setTimeout(() => {
            thingsForSwipe.find(thing => thing.thing_id === thingId).swiped = true;
        }, 400);
        swapResource
            .swipeLeft({ thing_id: thingId })
            .then((response) => {
                console.log("SwipeLeft Recorded Succesfully", response);
            });
    };

    const onAllSwiped = () => {
        typeSuccessErrorCard.value = 'info';
        textSuccessErrorCard.value = 'Try Searching for Something Else';
        showSuccessErrorCard.value = true;
        setTimeout(() => {
            showSuccessErrorCard.value = false;
        }, 2800);
        console.log("AllSwiped");
    };

</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');

*{
  font-family: "Rubik", sans-serif;
  font-style: normal;
}
</style>

<style scoped>
/* Custom styles for the modal */
.custom-modal {
    background-color: white;/* Light background color */
    border-radius: 50px;
    padding: 20px;
    width: 80%;
    height: auto;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
    overflow: hidden;
}

/* Custom styles for the icon wrapper */
.custom-icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px; /* Larger circle around the icon */
    height: 70px;
    margin-bottom: 10px; /* Space below the icon */
    margin-top: 10px;
    border-radius: 50%;
    animation: rotateIcon 2s infinite linear; /* Rotate animation */
}

.swal2-title{
    padding: 0;
}

/* Style for the icon itself */
.custom-icon {
    width: 50px; /* Width of the icon */
    height: 50px; /* Height of the icon */
}

/* Blurred backdrop */
.swal2-backdrop-show{
    backdrop-filter: blur(5px); /* Adjust blur intensity */
}

/* Icon rotation animation */
@keyframes rotateIcon {
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(360deg);
    }
}

.swal2-html-container{
    margin: 0;
    margin-top: 10px;
}

.backback{
    background-color: #347d27;
}
</style>
