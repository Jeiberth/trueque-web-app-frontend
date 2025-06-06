<template>
    <div class="message-container">
        <overlay v-if="loading"></overlay>
        <div class="messages">
            <div
                v-for="message in sortedMessages"
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
                    <p class="messageTextContent">{{ message.content }}</p>
                    <span class="date">{{ formatDate(message.created_at) }}</span>
                </div>
            </div>
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
    import { ref, onMounted, reactive, watch, nextTick, computed, onBeforeMount, onBeforeUnmount } from "vue";
    import feather from "feather-icons";
    import { useRoute } from 'vue-router'
    import swapApiResource from "../../api/swapResource"
    import overlay from "../components/overlay.vue";
    import { useStore } from 'vuex'
    import Echo from 'laravel-echo'
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();

    const swapResource = new swapApiResource();
    const messageToBeSend = ref("");

    const store = useStore();

    onBeforeUnmount(() => {
        store.commit("setLoading", true);
    })



    const userIdAuth = store.getters.getUserId;

    const loading = ref(false);
    const route = useRoute();  // Access the current route object
    const chatId = route.query.chatId; // Get the "id" parameter from the route

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // Format as desired
    };

    const Messages = computed(() => {
        const messages = store.getters.getMessagesByChatId(chatId) || [];
        return messages.filter(m => m._status !== 'failed');
    });

    const sortedMessages = computed(() => {
        return [...Messages.value].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at),
        );
    });

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
            // You might want to show an error message to the user
        }
    };

    const isMounted = ref(false);

    onMounted(async () => {
        try {
            store.commit('RESET_UNREAD_MESSAGES_COUNT', chatId);
            store.commit("setLoading", true);
            await store.dispatch('fetchMessages', chatId);

            // Mark messages as read in both store and server
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

    watch(Messages, () => {
        nextTick(() => {
            const container = document.querySelector(".messages");
            container?.scrollTo({ top: container.scrollHeight });
        });
    }, { deep: true });


    // const Messages = ref([]);

    // const sortedMessages = computed(() => {
    //     return Messages.value.slice().sort(
    //         (a, b) => new Date(a.created_at) - new Date(b.created_at),
    //     );
    // });

    // const sendMessage = () => {
    //     if (messageToBeSend.value.trim()) {
    //         swapResource
    //           .sendMessage({ chat_id: chatId, content:messageToBeSend.value  })
    //           .then((response) => {
    //               Messages.value = [...Messages.value, response];
    //           });
    //         messageToBeSend.value = "";
    //     }
    // };

    // onMounted(async () => {

    //     await swapResource
    //         .getMessagesByChatId({ chat_Id: chatId })
    //         .then((response) => {
    //             Messages.value = response;
    //         });



    //     // Scroll to bottom on mount
    //     nextTick(() => {
    //         const container = document.querySelector(".messages");
    //         if (container) {
    //             container.scrollTop = container.scrollHeight;
    //         }
    //     });

    //     store.commit("setLoading", false);
    // });

    // watch(Messages, () => {
    //     nextTick(() => {
    //         const container = document.querySelector(".messages");
    //         if (container) {
    //             container.scrollTop = container.scrollHeight;
    //         }
    //     });
    // });


</script>

<style scoped>
/* .message-container {
    margin-top: 5px;
  height: calc(80vh - 85px);
  overflow-y: auto;
} */

/* Hide scrollbar for Webkit browsers (Chrome, Safari, Edge) */
.message-container::-webkit-scrollbar {
    display: none; /* Hide the scrollbar */
}

/* .messages {
  display: flex;
  flex-direction: column;
  padding: 10px;

} */

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
  background-color: white; /* Color for sent messages */
  border-bottom-right-radius: 0; /* No rounding on the bottom right */
}

.received {
  align-self: flex-start;
  background-color: white; /* Color for received messages */
  border-bottom-left-radius: 0; /* No rounding on the bottom left */
}

.message-content {
  display: flex;
  flex-direction: column;
}

.messageTextContent {
  margin-bottom: 0px;
  margin-left: 2px;
  margin-top: 2px;
  line-height: 1.2;
}

.date {
  font-size: 0.8em;
  color: #888;
  margin-top: 2px;
  margin-bottom: 0px;
  margin-right: 6px;
  align-self: flex-end; /* Align date to the right */
}

/* .input-container {
  display: flex;
  width: 94%;
  height: 50px;
  margin-left: 3%;
  border: 0px solid #000000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  border-radius: 50px;
  background-color: white;
  justify-content: space-between;
  position: absolute;
  bottom: 85px;
  z-index: 8000;
} */

.inputText {
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: transparent;
  background-color: transparent;
  margin-left: 5px;
}

/* .sendButton {
  position: relative;
  height: 40px;
  margin-top: 4px;
  margin-right: 5px;
  padding: 10px 15px;
  border: 0px solid #000000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  border-radius: 50px;
  background-color:#abde97;
  color: black;
  cursor: pointer;
  align-items: center;
} */

.sendButton {
  background-color: var(--accent-color-darker);
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

/* .sendButtonText {
  position: relative;
  top: -3px;
} */


.message-container {
  margin-top: 10px;
  height: calc(100vh - 250px);
  position: relative;
  /* overflow: hidden; */

}



.messages {
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: calc(100% - 7px);
  overflow-y: auto;
  /* New mask properties */
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
  position: relative; /* Add this for better mask positioning */
}


/* Move the scrollbar hiding to .messages */
.messages::-webkit-scrollbar {
    display: none;
}

.input-container {
  display: flex;
  width: calc(100vw - 16px);
  height: 50px;
  border: 0px solid #000000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  border-radius: 50px;
  background-color: white;
  justify-content: space-between;
  /* position: fixed;
  bottom: 85px; */
  position: relative;
}


</style>
