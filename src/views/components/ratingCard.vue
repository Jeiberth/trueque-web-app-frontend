<template>
    <div class="rating-card">
      <div class="card-header">
        <h5 class="user-name">{{ userName }}</h5>
        <div class="rating-stars">
          <span v-for="index in 5" :key="index" class="star" :class="{ filled: index <= ratingScore }">★</span>
        </div>
      </div>
      <p class="rating-comment">{{ ratingComment }}</p>
      <p class="rating-date">{{ formattedDate }}</p>
    </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { defineProps } from 'vue';

  const props = defineProps({
    userName: { type: String, required: true },
    ratingScore: { type: Number, required: true, validator: value => value >= 0.5 && value <= 5 },
    ratingComment: { type: String, required: true },
    ratingCreatedAt: { type: String, required: true },
  });

  // Format the date to show only YYYY-MM-DD
  const formattedDate = computed(() => props.ratingCreatedAt.split(' ')[0]);
</script>

<style scoped>
  .rating-card {
    margin: auto;
    width: 96%;
    height: auto;
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

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user-name {
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
  }

  .rating-stars {
    display: flex;
    font-size: 1rem;
    color: #ffd700; /* Gold color for filled stars */
  }

  .star {
    color: lightgray;
  }

  .star.filled {
    color: #ffd700;
  }

  .rating-comment {
    font-size: 0.9rem;
    color: #333;
    margin-top: 5px;
    flex-grow: 1;
    overflow-wrap: break-word;
    margin-bottom: 3px;
  }

  .rating-date {
    font-size: 0.8rem;
    color: #777;
    align-self: flex-end;
    margin-bottom: 0px;
  }
</style>
