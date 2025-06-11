<template>
  <div class="edit-thing-page">
    <successErrorCard
      :type="typeSuccessErrorCard"
      :text="textSuccessErrorCard"
      :launch="showSuccessErrorCard"
    ></successErrorCard>
    <div class="container">
      <div class="cont_logo selected" id="ImageInput" @click="triggerFileInput">
        <i data-feather="image" class="iconStyle">
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            @change="handleFileUpload"
            accept="image/*"
            multiple
          >
        </i>
      </div>
      <h1 class="title">{{ $t("Edit Item") }}</h1>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="input-group">
          <input
            type="text"
            id="name"
            v-model="name"
            required
            class="inputLogin"
            :placeholder="$t('Thing Name')"
          />
        </div>

        <div class="input-group">
          <textarea
            id="description"
            v-model="description"
            required
            class="inputLogin"
            :placeholder="$t('Description')"
            rows="3"
          ></textarea>
        </div>
        <div class="input-group half-input-group">
          <input
            type="number"
            id="price"
            v-model="price"
            required
            class="inputLogin half-input"
            :placeholder="$t('Price')"
          />
          <select
            id="condition"
            v-model="condition"
            required
            class="inputLogin half-input"
          >
            <option value="" disabled>{{ $t("Condition") }}</option>
            <option
              v-for="cond in conditionArray"
              :key="cond.id"
              :value="cond.id"
            >
              {{ $t(cond.name) }}
            </option>
          </select>
        </div>

        <div class="input-group third-input-group">
          <input
            type="number"
            id="weight"
            v-model="weight"
            class="inputLogin third-input"
            :placeholder="$t('Weight')"
          />
          <select
            id="color"
            v-model="color"
            required
            class="inputLogin third-input"
          >
            <option value="" disabled>{{ $t("Color") }}</option>
            <option
              v-for="colorOption in colorArray"
              :key="colorOption.id"
              :value="colorOption.id"
            >
              {{ $t(colorOption.name) }}
            </option>
          </select>
          <select
            id="material"
            v-model="material"
            required
            class="inputLogin third-input"
          >
            <option value="" disabled>{{ $t("Material") }}</option>
            <option
              v-for="materialOption in materialArray"
              :key="materialOption.id"
              :value="materialOption.id"
            >
              {{ $t(materialOption.name) }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <select
            id="category"
            v-model="selectedCategory"
            class="inputLogin"
          >
            <option value="" disabled>{{ $t("Categories") }}</option>
            <option
              v-for="cat in categoryArray"
              :key="cat.id"
              :value="cat.id"
            >
              {{ $t(cat.name) }}
            </option>
          </select>
        </div>

        <div class="buttons-container">
          <button type="button" class="delete-button" @click.prevent="deleteItem">{{ $t("Delete Item") }}</button>
          <button type="submit" class="submit-button" @click.prevent="confirmEdit">{{ $t("Save Changes") }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import feather from "feather-icons";
import successErrorCard from "../components/successErrorCard.vue";
import swapApiResource from "../../api/swapResource";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useStore();
const swapResource = new swapApiResource();

const typeSuccessErrorCard = ref("");
const textSuccessErrorCard = ref("");
const showSuccessErrorCard = ref(false);

const name = ref("");
const description = ref("");
const price = ref("");
const condition = ref("");
const weight = ref("");
const color = ref("");
const material = ref("");
const selectedCategory = ref("");

const conditionArray = ref([]);
const colorArray = ref([]);
const materialArray = ref([]);
const categoryArray = ref([]);

const fileInput = ref(null);
const images = ref([]);
const thingId = ref(null);

onBeforeUnmount(() => {
  store.commit("setLoading", true);
});

onMounted(() => {
  feather.replace();
  conditionArray.value = store.getters.getConditions;
  categoryArray.value = store.getters.getCategories;
  materialArray.value = store.getters.getMaterials;
  colorArray.value = store.getters.getColors;

  const thingData = JSON.parse(route.query.thing);
  name.value = thingData.name;
  description.value = thingData.description;
  price.value = thingData.price;
  condition.value = thingData.condition_id;
  weight.value = thingData.weight;
  color.value = thingData.color_id;
  material.value = thingData.material_id;
  selectedCategory.value = thingData.category_id;
  thingId.value = thingData.id;

  store.commit("setLoading", false);
});

const triggerFileInput = () => {
  fileInput.value.click();
};

// const handleFileUpload = (event) => {
//   const files = Array.from(event.target.files);
//   images.value = files;
// };

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);

  if (files.length > 0) {
    const isImage = files.every(file => file.type.startsWith('image/'));

    if (!isImage) {

      typeSuccessErrorCard.value = "error";
      textSuccessErrorCard.value = t("Only image files are allowed.");
      showSuccessErrorCard.value = true;
      setTimeout(() => {
        showSuccessErrorCard.value = false;
      }, 2800);

      // Reset any previous file state
      images.value = null;
      return;
    }

    images.value = files;
  } else {
    images.value = null;
  }
};



const deleteItem = async () => {
  try {
    store.commit("setLoading", true);
    const response = await swapResource.deleteThing(thingId.value);
    if (response.success) {
      store.commit("deleteThingFromStore", thingId.value);
      router.push({ name: "profile" });
      typeSuccessErrorCard.value = "success";
      textSuccessErrorCard.value = t("Thing deleted successfully");
      showSuccessErrorCard.value = true;
    } else {
      throw new Error("Delete failed");
    }
  } catch (error) {
    typeSuccessErrorCard.value = "error";
    textSuccessErrorCard.value = t("Error deleting thing");
    showSuccessErrorCard.value = true;
    setTimeout(() => {
      showSuccessErrorCard.value = false;
    }, 2800);
  } finally {
    store.commit("setLoading", false);
  }
};


const confirmEdit = async () => {
  store.commit("setLoading", true);

  const updatedThing = {
    thingID: thingId.value,
    name: name.value,
    description: description.value,
    price: price.value,
    condition_id: condition.value,
    weight: weight.value,
    color_id: color.value,
    material_id: material.value,
    category_id: selectedCategory.value,
    imagesUrl: images.value,
  };

 try {
    const response = await swapResource.updateThing(updatedThing);
    if (response.success && response.thing) {
      // Update store with the updated thing
      store.commit("updateThingInStore", response.thing);
      router.push({ name: "profile" });

      typeSuccessErrorCard.value = "success";
      textSuccessErrorCard.value = t("Thing Successfully Edited");
      showSuccessErrorCard.value = true;
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    typeSuccessErrorCard.value = "error";
    textSuccessErrorCard.value = t("Error editing thing");
    showSuccessErrorCard.value = true;
    setTimeout(() => {
      showSuccessErrorCard.value = false;
    }, 2800);
  } finally {
    store.commit("setLoading", false);
  }
};



</script>

<style scoped>

.edit-thing-page {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
  border: 1px solid transparent;
  background-color: rgb(245, 255, 244);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  transition: all 2s ease;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.selected {
  border: 1px solid #053b00;
  box-shadow: 0 0 10px rgba(5, 59, 0, 0.52);
}

.iconStyle {
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

.buttons-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.submit-button,
.delete-button {
  padding: 12px 20px;
  border-radius: 50px;
  color: white;
  border: none;
  cursor: pointer;
  font-family: var(--primary-font, 'Poppins', sans-serif);
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.submit-button {
  background-color: var(--accent-color, #2ecc71);
}

.delete-button {
  background-color: #e74c3c;
}

.submit-button:hover,
.delete-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

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

  .buttons-container {
    flex-direction: column;
    width: 100%;
  }

  .submit-button,
  .delete-button {
    width: 100%;
  }
}

@media screen and (min-width: 768px) {
  .container {
    max-width: 450px;
  }
} */
</style>
