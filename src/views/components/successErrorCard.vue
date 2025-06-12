<template>
    <div>

    </div>
</template>

<script setup>
import { onMounted, defineProps, watch, ref } from "vue";
import Swal from "sweetalert2";
import feather from "feather-icons";
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const props = defineProps({
  type: {
    type: String,
    default: "success",
  },
  text: {
    type: String,
    default: "good job",
  },
  launch: {
    type: Boolean,
    default: false,
  },
});

// // Optional: Watch for external changes to cash value
// watch(() => props.launch, (newValue) => {
//     if(newValue){
//         Swal.fire({
//             title: props.type.charAt(0).toUpperCase() + props.type.slice(1),
//             text: props.text,
//             icon: props.type,
//             timer: 2800,
//             timerProgressBar: true,
//             showConfirmButton: false, // Remove the OK button
//             backdrop: true,
//             customClass: {
//             popup: "custom-modal", // Custom modal class
//             icon: "custom-icon-wrapper", // Custom icon wrapper class
//             },
//             willOpen: () => {
//             feather.replace(); // Replace <i> tags with Feather icons
//             },
//         });
//     }
// });

// Optional: Watch for external changes to cash value
watch(() => props.launch, (newValue) => {
    if(newValue){
        Swal.fire({
            title: t(props.type.charAt(0).toUpperCase() + props.type.slice(1)),
            text: props.text,
            icon: props.type,
            timer: 2800,
            timerProgressBar: true,
            showConfirmButton: false, // Remove the OK button
            backdrop: true,
            customClass: {
            popup: "custom-modal", // Custom modal class
            icon: "custom-icon-wrapper", // Custom icon wrapper class
            },
            willOpen: () => {
            feather.replace(); // Replace <i> tags with Feather icons
            },
        });
    }
});


onMounted(() => {
  feather.replace();
});
</script>

<style scoped>
/* Custom styles for the modal */
.custom-modal {
  background-color: white; /* Light background color */
  border-radius: 50px;
  padding-bottom: 20px;
  width: 80%;
  height: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  overflow: hidden;
}

.swal2-title {
  padding: 0;
}

/* Blurred backdrop */
.swal2-backdrop-show {
  backdrop-filter: blur(5px); /* Adjust blur intensity */
}

.swal2-html-container {
  margin: 0;
  margin-top: 10px;
}
</style>
