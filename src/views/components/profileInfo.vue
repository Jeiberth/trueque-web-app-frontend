<template>
    <div class="profile">
        <div v-if="topProfile">
            <div class="add-thing-icon" v-if="owner" @click="emitEditUser" style="cursor: pointer;">
                <!-- change when want to implement edit user -->
                <i data-feather="log-out" class="add-thing-icon-img"></i>
            </div>
            <div class="edit-profile-icon" v-if="owner"  @click="emitAddThing" style="cursor: pointer;">
                <i data-feather="plus-circle" class="edit-profile-icon-img"></i>
            </div>
            <h2 class="username">{{ userName }}</h2>
            <div class="card-image"  @click="emitEditprofile">
                <img :src="userProfileImg" alt="Profile Image" class="card-image-img" @error="onImgError"  style="cursor: pointer;">
            </div>
        </div>
        <div class="container-container-icons">
            <div class="card">
                <div class="container-icon icon-star">
                    <i data-feather="star" class="icon"></i>
                </div>
                <div class="container-value">
                    <h3 class="value">{{ rating.toFixed(1) }}</h3>
                    <p class="value-type">{{ $t("Stars") }}</p>
                </div>
            </div>
            <div class="card">
                <div class="container-icon icon-package">
                    <i data-feather="package" class="icon"></i>
                </div>
                <div class="container-value">
                    <h3 class="value">{{ things }}</h3>
                    <p class="value-type">{{ $t("Things") }}</p>
                </div>
            </div>
            <div class="card">
                <div class="container-icon icon-shuffle">
                    <i data-feather="shuffle" class="icon"></i>
                </div>
                <div class="container-value">
                    <h3 class="value">{{ swaps }}</h3>
                    <p class="value-type">{{ $t("Swaps") }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import feather from "feather-icons";
import fallbackImage from '@/assets/fallback_user.jpg'

function onImgError(event) {
  event.target.src = fallbackImage
}

// Props
const props = defineProps({
    userProfileImg: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    owner: {
        type: Boolean,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    things: {
        type: Number,
        required: true
    },
    swaps: {
        type: Number,
        required: true
    },
    topProfile: {
        type: Boolean,
        required: false,
        default: true
    },
});

// Emits
const emit = defineEmits(['addThing', 'editUser', 'editProfile']);

// Emit functions
const emitAddThing = () => {
    emit('addThing');
};

const emitEditUser = () => {
    emit('editUser');
};

const emitEditprofile = () => {
    emit('editProfile');
};


onMounted(() => {
    feather.replace();
});
</script>

<style scoped>
/* Profile container styling */
.profile {
    position: relative;
    text-align: center;
    margin-bottom: 20px
}

/* add-thing icon in the top left */
.add-thing-icon {
    position: absolute;
    top: 10px;
    left: 10px;
}

.add-thing-icon-img {
    color: #ffffff; /* Color for owner icon */
}

.edit-profile-icon {
    position: absolute;
    top: 10px;
    right: 10px;
}

.edit-profile-icon-img {
    color: #ffffff; /* Color for owner icon */
}

/* Center username below the profile image */
.username {
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 1.5em;
    font-weight: bold;
    color: white;
}

/* Center image and make it circular */
.card-image {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}

.card-image-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #000000; /* Green border for profile image */
}

/* Icons container - single row layout */
.container-container-icons {
    display: flex;
    justify-content:space-evenly;
    margin-top: 20px;
}

/* Card styling */
.card {
    border: 1px solid #ddd;
    border-radius: 50px;
    padding: 10px;
    height: 50px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
    display: flex;
    align-items: center;
    width: 25%;
    flex-direction: row;
    min-width: 110px;
    background-color: white;
}

/* Stack value and value-type vertically */
.container-value {
    text-align:left;
    margin-left: 10px;
}

.value {
    font-weight: 600;
    margin: 0;
    height: 25px;
}

.value-type {
    margin: 0;
    font-size: 0.9em;
    color: #777;

}

/* Icon styling with unique backgrounds */
.container-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.icon-star {
    background-color: rgba(255, 215, 0, 0.3); /* Gold for Rating */
}

.icon-package {
    background-color: rgba(173, 216, 230, 0.3); /* Light blue for Things */
}

.icon-shuffle {
    background-color: rgba(144, 238, 144, 0.3); /* Light green for Swaps */
}

.icon {
    color: darkslategray;
    width: 18px;
    height: 18px;
    margin: auto;
}


</style>
