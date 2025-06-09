<template>
    <div class="rating-card">
      <div class="card-header">
        <h5 class="labelRate">{{ $t(type) }}:</h5>$
        <input
          v-model="cash"
          class="comment-input"
          :type="$t('number')"
          :placeholder="$t('Enter the amount')"
          :disabled="isDisabled"
        />
      </div>
    </div>
</template>

<script setup>
    import { ref, computed, onBeforeMount, watch } from 'vue';
    import { defineEmits } from 'vue';
    import { useI18n } from 'vue-i18n';
    const { t } = useI18n();

    const emit = defineEmits(['changeCashValue']);

    const props = defineProps({
        type: { type: String, required: true, default: "Requested" },
        isDisabled: { type: Boolean, required: false, default: false },
        cashValue: { type: Number, required: false, default: 0}
    });

    // User input states
    const cash = ref(props.cashValue);

    // Optional: Watch for external changes to cash value
    watch(cash, (newValue) => {
        emit('changeCashValue', newValue);
    });

    watch(() => props.cashValue, (newCashValue) => {
        cash.value = newCashValue; // Update cash when prop changes
    });

</script>


<style scoped>
.rating-card {
  margin: auto;
  width: 96%;
  min-height: 60px;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 20px;
  margin-bottom: 10px;
  box-sizing: border-box;
  position: relative;
  background-color: white;
}

.labelRate {
  width: 50%;
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-input {
  width: 50%;
  font-size: 1rem;
  padding: 5px;
  flex-grow: 1;
  margin-right: 10px;
  border: 1px solid #ccc; /* Lighter border */
  border-radius: 5px;
  resize: none; /* Prevent resizing */
  border: transparent;
}
</style>
