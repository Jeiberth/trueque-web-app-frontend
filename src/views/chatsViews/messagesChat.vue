<template>
    <div class="message-container">
        <div class="messages">
            <template v-for="(group, index) in groupedMessages" :key="index">
                <div class="date-separator">
                    {{ group.displayDate }}
                </div>
                <div
                    v-for="message in group.messages"
                    :key="message.id"
                    :class="[
                    'message',
                    {
                        sent: message.user_id === userIdAuth,
                        received: message.user_id !== userIdAuth,
                    },
                    ]"
                >
                    <div class="message-content">
                        <!-- Barter Item Display -->
                        <div v-if="message.thing" class="barter-item">
                            <img :src="message.thing.imagesUrl" :alt="message.thing.name" class="item-image" @error="onImgError">
                            <p class="item-text">{{ $t("Hey! I like your ") }}{{ message.thing.name }}!</p>
                        </div>
                        <!-- Text Message Display -->
                        <div v-else  style="width: 100%">
                        <p class="messageTextContent">{{ message.content }}</p>
                        </div>
                        <span class="date">{{ formatTime(message.created_at) }}</span>
                    </div>
                </div>
            </template>
        </div>
        <div class="input-container" v-show="isMounted">
            <input
                v-model="messageToBeSend"
                type="text"
                :placeholder="$t('Type your message...')"
                class="inputText"
                @keypress.enter="sendMessage"
            />
            <button @click="sendMessage" class="sendButton">
                <div class="sendButtonText">{{ $t("Send") }}</div>
            </button>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed, nextTick, watch, onBeforeUnmount } from "vue";
    import { useRoute } from 'vue-router'
    import { useStore } from 'vuex'
    import { useI18n } from 'vue-i18n';
    import overlay from "../components/overlay.vue";
    import fallbackImage from '@/assets/fallback_thing_msg.jpg'

    function onImgError(event) {
        event.target.src = fallbackImage
    }
    const { t } = useI18n();
    const messageToBeSend = ref("");
    const store = useStore();
    const userIdAuth = store.getters.getUserId;
    const route = useRoute();
    const chatId = route.query.chatId;
    const isMounted = ref(false);

    // Date formatting helpers
    const formatDisplayDate = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const date = new Date(dateString);
        date.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const diffDays = Math.round((today - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return t("Today");
        if (diffDays === 1) return t("Yesterday");
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };


    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Message data
    const Messages = computed(() => {
        const messages = store.getters.getMessagesByChatId(chatId) || [];
        return messages.filter(m => m._status !== 'failed');
    });

    // Group messages by date
    const groupedMessages = computed(() => {
        const groups = {};
        const sorted = [...Messages.value].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        sorted.forEach(message => {
            const dateKey = new Date(message.created_at).toDateString();
            if (!groups[dateKey]) {
                groups[dateKey] = {
                    date: dateKey,
                    displayDate: formatDisplayDate(message.created_at),
                    messages: []
                };
            }
            groups[dateKey].messages.push(message);
        });

        return Object.values(groups);
    });

    // Message sending
    const sendMessage = async () => {
        const content = messageToBeSend.value.trim();
        if (!content) return;

        try {
            messageToBeSend.value = "";
            await store.dispatch('sendNewMessage', {
                chatId,
                content
            });
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    // Component lifecycle
    onMounted(async () => {
        try {
            store.commit('RESET_UNREAD_MESSAGES_COUNT', chatId);
            store.commit("setLoading", true);
            await store.dispatch('fetchMessages', chatId);
            await store.dispatch('markMessagesRead', chatId);

            nextTick(() => {
                const container = document.querySelector(".messages");
                container?.scrollTo({ top: container.scrollHeight });
            });
        } finally {
            store.commit("setLoading", false);
        }
        isMounted.value = true;
    });

    onBeforeUnmount(() => {
      store.commit('RESET_UNREAD_MESSAGES_COUNT', chatId);
    });

    watch(Messages, () => {
        nextTick(() => {
            const container = document.querySelector(".messages");
            container?.scrollTo({ top: container.scrollHeight });
        });
    }, { deep: true });
</script>

<style scoped>
.message-container {
  margin-top: 10px;
  height: calc(calc(var(--vh, 1vh) * 100) - 250px)
;
  position: relative;
}

.messages {
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: calc(100% - 7px);
  overflow-y: auto;
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    white 5%,
    white 95%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    white 5%,
    white 95%,
    transparent 100%
  );
  position: relative;
}

.messages::-webkit-scrollbar {
    display: none;
}

.input-container {
  display: flex;
  /* width: calc(100vw - 16px); */
  width: 97%;
  height: 50px;
  border: 0px solid #000000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  border-radius: 50px;
  background-color: white;
  justify-content: space-between;
  position: relative;
  margin: auto;
}

.message {
  min-width: 40%;
  max-width: 70%;
  height: auto;
  border-radius: 30px;
  margin: 0;
  margin-top: 10px;
  padding: 10px;
  position: relative;
  border: 1px solid #ddd;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
}

.sent {
  align-self: flex-end;
  background-color: white;
  border-bottom-right-radius: 0;
}

.received {
  align-self: flex-start;
  background-color: white;
  border-bottom-left-radius: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message.sent .message-content {
  align-items: flex-end;
}

.messageTextContent {
  margin-bottom: 0px;
  margin-left: 2px;
  margin-top: 2px;
  line-height: 1.2;
    text-align: left;
}

.date {
  font-size: 0.8em;
  color: #888;
  margin-top: 2px;
  margin-bottom: 0px;
  margin-right: 6px;
  align-self: flex-end;
}

.inputText {
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: transparent;
  background-color: transparent;
  margin-left: 5px;
}

.sendButton {
  background-color: var(--text-dark);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-family: var(--primary-font, 'Poppins', sans-serif);
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

/* Date separator styling */
.date-separator {
  text-align: center;
  margin: 15px 0;
  position: relative;
  color: white;
  font-size: 0.85em;
  font-weight: 500;
}

.date-separator::before,
.date-separator::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #ddd;
}

.date-separator::before {
  left: 0;
}

.date-separator::after {
  right: 0;
}

/* Barter item styling */
.barter-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.item-image {
  max-width: 200px;
  max-height: 150px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #eee;
}

.item-text {
  font-weight: 500;
  text-align: left;
  margin: 5px 0;
}
</style>
