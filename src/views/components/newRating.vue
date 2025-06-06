<template>
    <div class="rating-card">
        <div class="card-header">
            <h5 class="labelRate">{{ $t("Make a Review") }}</h5>
            <div class="rating-stars">
                <span
                v-for="index in 5"
                :key="index"
                class="star"
                :class="{ filled: index <= userRating }"
                @click="setRating(index)"
                >
                ★
                </span>
            </div>
        </div>
        <div class="input-container">
            <textarea
                v-model="userComment"
                class="comment-input"
                :placeholder="$t('Enter your comment')"
            ></textarea>
            <button @click="submitRating" class="submit-button">{{ $t("Submit") }}</button>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const emit = defineEmits(['submitRating']);

// User input states
const userComment = ref('');
const userRating = ref(0);

// Set rating based on user selection
const setRating = (rating) => {
    userRating.value = rating;
};

// Emit user input data when submitting
const submitRating = () => {
    emit('submitRating', { comment: userComment.value, rating: userRating.value });
    userComment.value = '';
    userRating.value = 0;
};
</script>

<style scoped>
.rating-card {
    margin: auto;
    width: 96%;
    min-height: 100px;
    border-radius: 30px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 20px;
    margin-bottom: 10px;
    box-sizing: border-box;
    position: relative;
    background-color: white;
}

.labelRate {
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.input-container {
    display: flex;
    width: 100%;
}

.comment-input {
    font-size: 1rem;
    padding: 5px;
    flex-grow: 1;
    margin-right: 10px;
    height: 72px; /* Height for multi-line input */
    border: 1px solid #ccc; /* Lighter border */
    border-radius: 5px;
    resize: none; /* Prevent resizing */
    border: transparent;
}

.rating-stars {
    display: flex;
    font-size: 1.5rem;
}

.star {
    color: lightgray;
    cursor: pointer;
    transition: color 0.2s;
}

.star.filled {
    color: #ffd700;
}

.submit-button {
    margin-top: 40px; /* Remove margin-top */
    padding: 8px 12px;
    font-size: 1rem;
    height: 40px;
    border-radius: 20px;
    color: black;
    border-width: 1px;
    border-style: solid;
    cursor: pointer;
    background-color: rgba(246, 250, 29, 0.15);
    border-color: #ffd700;
    transition: background-color .5s ease, box-shadow .5s ease;
}

.submit-button:hover {
    background-color: rgba(255, 218, 52, 0.15);
    box-shadow: inset 0 4px 15px rgba(176, 179, 9, 0.15), 0 4px 15px rgba(0, 0, 0, 0.219);
}

</style>

