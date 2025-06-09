<template>
    <div style="cursor: pointer;">
        <div class="card" @click="clicked">
            <div class="rap">
                <i :data-feather="icon" class="iconStyle" style="color: black;"></i>
            </div>
            <div class="card-body">
                <div class="user-info">
                    <p class="offer">{{ $t(text) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, reactive, nextTick } from "vue";
import feather from "feather-icons";


onMounted(async () => {
  feather.replace();
});

// Emits
const emit = defineEmits(["clicked"]);

// Emit functions
const clicked = () => {
  emit("clicked");
};

const props = defineProps({
    text: { type: String, required: true },
    icon: { type: String, required: true },
});

</script>


<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  display: flex;
  height: 60px;
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
  width: 40px;
  height: 40px;
  border-radius: 0;
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
  top: 2px;
  height: 30px;
  color: black;
}

</style>
