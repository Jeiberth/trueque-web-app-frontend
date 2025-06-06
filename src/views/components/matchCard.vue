<template>
  <div class="chat-card" @click="selectChat">
    <div class="chat-card-image">
      <img :src="image" alt="User Avatar" class="avatar" @error="onImgError">
    </div>
    <div class="chat-card-body">
      <h5 class="title-card username">{{ userName }}</h5>
      <div class="notifications">
        <span v-if="offer > 0" :class="['badge', 'offer-badge']">
          {{ offer }} {{ offer === 1 ? $t('New Offer') :  $t('New Offers') }}
        </span>
        <span v-if="message > 0" :class="['badge', 'message-badge']">
          {{ message }} {{ message === 1 ?  $t('New Message') :  $t('New Messages') }}
        </span>
      </div>
    </div>
    <div v-if="offer > 0 || message > 0" class="notification-bubble">
      <span>{{ offer + message }}</span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import fallbackImage from '@/assets/fallback_user.jpg'

function onImgError(event) {
    event.target.src = fallbackImage
}

const props = defineProps({
  chatId: {
    type: Number,
  },
  userName: {
    type: String,
    default: 'Username',
  },
  image: {
    type: String,
    default: 'src/assets/images/p2.jpg',
  },
  message: {
    type: Number,
    default: 0,
  },
  offer: {
    type: Number,
    default: 0,
  },
});

// Emits
const emit = defineEmits(['selectChat']);

// Emit functions
const selectChat = () => {
  emit('selectChat');
};
</script>

<style scoped>
.chat-card {
  display: flex;
  align-items: center;
  width: 96%;
  margin-left: 2%;
  margin-top: 10px;
  padding: 10px 15px;
  border-radius: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: white;
  cursor: pointer;
  position: relative; /* For notification bubble positioning */
}

.chat-card-image {
  margin-right: 15px;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden; /* To handle long usernames */
}

.title-card.username {
  font-weight: 500;
  font-size: 1rem;
  color: var(--text-dark, #2c3e50);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notifications {
  display: flex;
  gap: 5px;
  align-items: center;
}

.badge {
  font-size: 0.75rem;
  padding: 5px 8px;
  border-radius: 50px;
  color: black;
  border: 1px solid lightgray;
  background-color: rgba(0, 0, 0, 0.05); /* Light background */
  white-space: nowrap;
}

.offer-badge {
  background-color: rgba(65, 155, 95, 0.15);
  border-color: #2ecc71; /* Accent color */
  color: #27ae60;
}

.message-badge {
  background-color: rgba(0, 123, 255, 0.1);
  border-color: #007bff; /* Primary color */
  color: #0056b3;
}

.notification-bubble {
  position: absolute;
  top: 35px;
  right: 20px;
  background-color: var(--text-dark);
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
}

.notification-bubble span {
  font-weight: bold;
}
</style>
