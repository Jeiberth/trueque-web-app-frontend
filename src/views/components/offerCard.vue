<template>
    <div style="cursor: pointer;">
        <div class="card" @click="openOffer">
        <div class="rap">
            <i data-feather="check-circle" v-if="iconAccepted" class="iconStyle" style="color: green;"></i>
            <i data-feather="x-circle" v-if="iconRejected" class="iconStyle" style="color: red;"></i>
            <i data-feather="clock" v-if="iconPending" class="iconStyle" style="color: darkcyan;"></i>
        </div>
        <div class="card-body">
            <div class="user-info">
            <p class="offer">{{ offerSend ? $t("Offer Sent") : $t("Offer Received") }}</p>
            <p class="stats">{{ status }}</p>
            <p class="stats">{{ formatDate(created_at) }}</p>
            </div>
        </div>
        </div>
    </div>
</template>


<script setup>

    import { ref, onMounted, reactive, nextTick } from "vue";
    import feather from "feather-icons";
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();
    const iconAccepted = ref(false);
    const iconRejected = ref(false);
    const iconPending = ref(false);
    const status = ref("");

    const props = defineProps({
    offerId: {
        type: Number,
    },
    offerStatus: {
        type: Number,
        default: 5,
    },
    offerSend: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: String,
        default: "30/10/2024",
    },
    });

    onMounted(async () => {
    if (props.offerStatus === 1 || props.offerStatus === 2) {
        status.value = t("Accepted");
        iconAccepted.value = true;
    } else if (props.offerStatus == 3 || props.offerStatus == 4) {
        status.value = t("Rejected");
        iconRejected.value = true;
    } else if (props.offerStatus == 5) {
        status.value = t("Pending");
        iconPending.value = true;
    }

    // Wait for DOM updates before replacing icons
    await nextTick();
    feather.replace();
    });

    // Emits
    const emit = defineEmits(["openOffer"]);

    // Emit functions
    const openOffer = () => {
    emit("openOffer", props.offerId);
    };

    const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleString(); // Format as desired
        };

</script>


<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  display: flex;
  height: 90px;
  width: 96%;
  margin-left: 2%;
  margin-top: 10px;
  align-items: center;
  justify-content: space-between; /* Space between children */
  border-radius: 50px;
  flex-direction: row;
  background-color: white;
}

.iconStyle {
  display: inline;
  align-self: flex-start;
  margin-right: 10px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
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
  top: 4px;
  height: 30px;
}

.stats{
    margin: 0;
}

.card-circle {
  margin-right: 10px; /* Add margin to the left */
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab {
  text-align: center;
  cursor: pointer;
  padding: 10px;
  transition:
    background-color 1s ease,
    color 1s ease,
    box-shadow 1s ease,
    border 1s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  border-radius: 20px;
  margin: 0 5px;
  width: 50px;
  height: 50px;
}
</style>
