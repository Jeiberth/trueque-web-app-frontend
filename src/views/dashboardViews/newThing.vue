<template>
  <div class="whole-page">
    <successErrorCard :type="typeSuccessErrorCard" :text="textSuccessErrorCard" :launch="showSuccessErrorCard"></successErrorCard>
    <div class="container">
      <div class="cont_logo" id="ImageInput" @click="triggerFileInput" :class="{'selected': isFileUploaded, 'error-border': showImageError}">
        <i
          data-feather="image"
          class="iconStyle"
        ></i>
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            @change="handleFileUpload"
            accept="image/*"
            multiple
          >
      </div>
      <h1 class="title">{{ $t("Add Item") }}</h1>
      <form @submit.prevent="handleSubmit" class="form">

        <div class="input-group">
          <input type="text" id="name" v-model="name" required class="inputLogin" :placeholder="$t('Thing Name')" />
        </div>

        <div class="input-group">
          <textarea id="description" v-model="description" required class="inputLogin" :placeholder="$t('Description')" rows="3"></textarea>
        </div>
        <div class="input-group half-input-group">
          <input type="number" id="price" v-model="price" required class="inputLogin half-input" :placeholder="$t('Price')" />
          <select id="condition" v-model="condition" required class="inputLogin half-input">
            <option value="" disabled>{{ $t("Condition") }}</option>
            <option v-for="cond in conditionArray" :key="cond.id" :value="cond.id">{{ $t(cond.name) }}</option>
          </select>
        </div>

        <div class="input-group third-input-group">
          <input type="number" id="weight" v-model="weight" class="inputLogin third-input" :placeholder="$t('Weight')" />
          <select id="color" v-model="color" required class="inputLogin third-input">
            <option value="" disabled>{{ $t("Color") }}</option>
            <option v-for="colorOption in colorArray" :key="colorOption.id" :value="colorOption.id">{{ $t(colorOption.name) }}</option>
          </select>
          <select id="material" v-model="material" required class="inputLogin third-input">
            <option value="" disabled >{{ $t("Material") }}</option>
            <option v-for="materialOption in materialArray" :key="materialOption.id" :value="materialOption.id">{{ $t(materialOption.name) }}</option>
          </select>
        </div>

        <div class="input-group">

          <select id="category" v-model="selectedCategory" required class="inputLogin">
            <option value="" disabled >{{ $t("Categories") }}</option>
            <option v-for="cat in categoryArray" :key="cat.id" :value="cat.id">{{ $t(cat.name) }}</option>
          </select>

          </div>

        <button type="submit" class="submit-button">{{ $t("Add Item") }}</button>
        </form>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount, defineComponent, reactive, nextTick } from "vue";
    import swapApiResource from "../../api/swapResource"
    import { useStore } from 'vuex';
    import feather from "feather-icons";
    import successErrorCard from "../components/successErrorCard.vue";
    import { useRoute, useRouter } from "vue-router";
    import { useI18n } from 'vue-i18n';

    const { t } = useI18n();
    // Using useRoute to access route params
    const route = useRoute();
    const router = useRouter();

    const typeSuccessErrorCard = ref('');
    const textSuccessErrorCard = ref('');
    const showSuccessErrorCard = ref(false);

    const store = useStore();
    const swapResource = new swapApiResource();

    const name = ref('');
    const description = ref('');
    const price = ref('');
    const condition = ref('');
    const weight = ref('');
    const color = ref('');
    const material = ref('');
    const selectedCategory = ref('');
    const selectedCategories = reactive([]);


    const conditionArray = ref([]);
    const colorArray = ref([]);
    const materialArray = ref([]);
    const categoryArray = ref([]);

    const fileInput = ref(null);
    const images = ref([]);
    const isFileUploaded = ref(false);

    const showImageError = ref(false);

    const triggerFileInput = () => {
        fileInput.value.click();
    };

    // const handleFileUpload = (event) => {
    //     const files = Array.from(event.target.files);
    //     if (files.length > 0) {
    //         images.value = files;
    //         isFileUploaded.value = true;
    //         showImageError.value = false;
    //     } else {
    //         images.value = null;
    //         isFileUploaded.value = false;
    //     }
    // };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);

        if (files.length > 0) {
            const isImage = files.every(file => file.type.startsWith('image/'));

            if (!isImage) {

                textSuccessErrorCard.value = t("Only image files are allowed.");
                typeSuccessErrorCard.value = "error";
                showSuccessErrorCard.value = true;
                setTimeout(() => {
                    showSuccessErrorCard.value = false;
                }, 2800);
                    
                // Reset any previous file state
                images.value = null;
                isFileUploaded.value = false;
                showImageError.value = true;
                return;
            }

            images.value = files;
            isFileUploaded.value = true;
            showImageError.value = false;
        } else {
            images.value = null;
            isFileUploaded.value = false;
        }
    };


    onBeforeUnmount(() => {
        store.commit("setLoading", true);
    })

    onMounted(async () => {
        conditionArray.value = store.getters.getConditions;
        categoryArray.value = store.getters.getCategories;
        materialArray.value = store.getters.getMaterials;
        colorArray.value = store.getters.getColors;

        feather.replace();

        store.commit("setLoading", false);
    });


    const nullValues = () => {
        name.value = null;
        description.value = null;
        price.value = null;
        condition.value = null;
        weight.value = null;
        color.value  = null;
        material.value = null;
        selectedCategory.value = null;
        images.value = [];
    };

    const handleSubmit = async () => {

        if (!images.value || images.value.length === 0) {
            showImageError.value = true;
            textSuccessErrorCard.value = t("Please upload an image");
            typeSuccessErrorCard.value = "error";
            showSuccessErrorCard.value = true;
            setTimeout(() => {
                showSuccessErrorCard.value = false;
            }, 2800);
            return;
        }

        store.commit("setLoading", true);

        const formData = new FormData();

        // Append all fields
        formData.append('name', name.value);
        formData.append('description', description.value);
        formData.append('price', price.value);
        formData.append('condition_id', condition.value);
        formData.append('weight', weight.value);
        formData.append('color_id', color.value);
        formData.append('material_id', material.value);
        formData.append('category_id', selectedCategory.value);

        // Append images
        images.value.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });

        try {
            const response = await swapResource.newThing(formData);
            nullValues();

            // Add the new thing to the store
            store.commit("addNewThing", response);

            router.push({ name: "profile" });
            typeSuccessErrorCard.value = 'success';
            textSuccessErrorCard.value = t('Thing Successfully Created');
            showSuccessErrorCard.value = true;


            setTimeout(() => {
                showSuccessErrorCard.value = false;
            }, 2800);
        } catch (error) {
            typeSuccessErrorCard.value = 'error';
            textSuccessErrorCard.value = t('Error creating thing');
            showSuccessErrorCard.value = true;
            setTimeout(() => {
                showSuccessErrorCard.value = false;
            }, 2800);
        } finally {
            store.commit("setLoading", false);
        }

        // await swapResource
        // .newThing(formData)
        //     .then((response) => {
        //         nullValues();
        //         store.commit("setLoading", false);

        //         typeSuccessErrorCard.value = 'success';
        //         textSuccessErrorCard.value = t('Thing Succesfully Created');
        //         showSuccessErrorCard.value = true;
        //         setTimeout(() => {
        //             showSuccessErrorCard.value = false;
        //             router.push({ name: "profile" })
        //         }, 2800);
        //     });

    };


    // this is for future multi category implementations

    // const getCategoryName = (id) => {
    //   const category = categoryArray.find(cat => cat.id === id);
    //   return category ? category.value : '';
    // };

    // const addCategory = () => {
    //   if (selectedCategory.value && !selectedCategories.includes(selectedCategory.value)) {
    //     selectedCategories.push(selectedCategory.value);
    //   }
    //   selectedCategory.value = null; // Reset selection
    // };

    // const removeCategory = (id) => {
    //   const index = selectedCategories.indexOf(id);
    //   if (index !== -1) selectedCategories.splice(index, 1);
    // };


</script>

<style scoped>

    .whole-page {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .error-border {
        border: 2px solid #ff4444 !important;
        animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
        0% { transform:  translateX(-50%) }
        25% { transform: translateX(-55%); }
        50% { transform: translateX(-50%); }
        75% { transform: translateX(-55%); }
        100% { transform:  translateX(-50%) }
    }

    .container {
        width: 90%;
        max-width: 400px;
        position: relative;
        background-color: white;
        height: auto;
        /* margin: 50vh auto 0; */
        padding: 30px 20px;
        border-radius: var(--border-radius, 24px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        /* transform: translateY(-50%); */
    }

    .cont_logo {
        position: absolute;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 1px solid transparent; /* Initially transparent border */
        background-color: rgb(245, 255, 244);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
        transition: all 2s ease;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .selected{
        border: 1px solid #053b00; /* Add the border color */
        box-shadow: 0 0 10px rgba(5, 59, 0, 0.52); /* Create a blurry effect */
    }

    .iconStyle{
    position: relative;

    width: 60px;
    height: 60px;
    color: rgb(224, 224, 224);
    }

    .title {
        text-align: center;
        font-size: 1.8rem;
        margin-top: 30px;
        margin-bottom: 20px;
        color: var(--text-dark, #2c3e50);
        font-family: var(--primary-font, 'Poppins', sans-serif);
    }

    .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    }

    .input-group {
    position: relative;
    }

    .inputLogin {
    padding: 12px 20px;
    border: 1px solid var(--light-shade-bg, #f0f5f3);
    background-color: var(--light-shade-bg, #f0f5f3);
    border-radius: 50px;
    width: 100%;
    font-family: var(--primary-font, 'Poppins', sans-serif);
    box-sizing: border-box;
    }

    textarea.inputLogin {
    border-radius: 20px;
    resize: vertical;
    }

    .half-input-group {
    display: flex;
    gap: 10px;
    }

    .half-input {
    width: calc(50% - 5px);
    }

    .third-input-group {
    display: flex;
    gap: 10px;
    }

    .third-input {
    width: calc(33.33% - 7px);
    }

    .tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    }

    .tag {
    background-color: #347d27;
    color: white;
    padding: 5px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    }

    .remove-tag {
    margin-left: 5px;
    cursor: pointer;
    }

    .submit-button {
    width: 100%;
    padding: 12px;
    border-radius: 50px;
    margin-top: 20px;
    background-color: var(--accent-color, #2ecc71);
    color: white;
    border: none;
    cursor: pointer;
    font-family: var(--primary-font, 'Poppins', sans-serif);
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .submit-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    /* Responsive Adjustments */
    /* @media screen and (max-width: 375px) {
    .container {
        width: 95%;
        padding: 20px 15px;
    }

    .cont_logo {
        width: 80px;
        height: 80px;
        top: -40px;
    }

    .iconStyle {
        width: 40px;
        height: 40px;
    }

    .title {
        font-size: 1.6rem;
        margin-top: 40px;
        margin-bottom: 15px;
    }

    .half-input-group,
    .third-input-group {
        flex-direction: column;
        gap: 10px;
    }

    .half-input,
    .third-input {
        width: 100%;
    }
    }

    @media screen and (min-width: 768px) {
    .container {
        max-width: 450px;
    }
    } */
</style>
