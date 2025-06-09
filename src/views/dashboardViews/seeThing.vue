<template>
  <div class="landing-page">
    <successErrorCard
      :type="typeSuccessErrorCard"
      :text="textSuccessErrorCard"
      :launch="showSuccessErrorCard"
    ></successErrorCard>
    <div class="container">
      <div class="cont_logo selected" id="ImageInput">
        <img :src="imagesUrl" alt="Thing Image" class="profile-image" />
      </div>
      <h1 class="title">{{ $t("Look At Thing") }}</h1>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="input-group">
          <input
            type="text"
            id="name"
            v-model="name"
            disabled
            required
            class="inputLogin"
            :placeholder="$t('Thing Name')"
          />
        </div>

        <div class="input-group">
          <textarea
            id="description"
            v-model="description"
            disabled
            required
            class="inputLogin textarea-description"
            :placeholder="$t('Description')"
            rows="3"
          ></textarea>
        </div>
        <div class="input-group half-row-group">
          <input
            type="number"
            id="price"
            v-model="price"
            disabled
            required
            class="inputLogin input-half"
            :placeholder="$t('Price')"
          />
          <select
            id="condition"
            v-model="condition"
            required
            disabled
            class="inputLogin input-half"
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

        <div class="input-group third-row-group">
          <input
            type="number"
            id="weight"
            v-model="weight"
            disabled
            class="inputLogin input-third"
            :placeholder="$t('Weight')"
          />
          <select
            id="color"
            v-model="color"
            required
            disabled
            class="inputLogin input-third"
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
            disabled
            required
            class="inputLogin input-third"
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
            disabled
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
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import swapApiResource from "../../api/swapResource";
import { useStore } from "vuex";
import successErrorCard from "../components/successErrorCard.vue";
import { useRoute } from "vue-router";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
// Using useRoute to access route params
const route = useRoute();

const typeSuccessErrorCard = ref("");
const textSuccessErrorCard = ref("");
const showSuccessErrorCard = ref(false);

const store = useStore();
const swapResource = new swapApiResource();

const name = ref("");
const description = ref("");
const price = ref("");
const condition = ref("");
const weight = ref("");
const color = ref("");
const material = ref("");
const selectedCategory = ref("");
const imagesUrl = ref("");

const thing = ref({
  name: "",
  description: "",
  price: 0,
  condition_id: 0,
  weight: 0,
  color_id: "",
  material_id: 0,
  category_id: 0,
  availability: 0,
  imagesUrl: "",
});

onBeforeUnmount(() => {
  store.commit("setLoading", true);
});

onMounted(() => {
  //get default values from the db
  conditionArray.value = store.getters.getConditions;
  categoryArray.value = store.getters.getCategories;
  materialArray.value = store.getters.getMaterials;
  colorArray.value = store.getters.getColors;

  thing.value = JSON.parse(route.query.thing);

  //getting the values passed by querry parameters
  name.value = thing.value.name;
  description.value = thing.value.description;
  price.value = thing.value.price;
  condition.value = thing.value.condition_id;
  weight.value = thing.value.weight;
  color.value = thing.value.color_id;
  material.value = thing.value.material_id;
  selectedCategory.value = thing.value.category_id;
  imagesUrl.value = thing.value.imagesUrl;

  store.commit("setLoading", false);
});

const conditionArray = ref();
const colorArray = ref();
const materialArray = ref();
const categoryArray = ref();
</script>

<style scoped>
.landing-page {
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
  /* top: 50%; */
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
  overflow: hidden; /* Clip the image to the circle */
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selected {
  border: 1px solid #053b00;
  box-shadow: 0 0 10px rgba(5, 59, 0, 0.52);
}

.title {
  text-align: center;
  font-size: 1.8rem;
  margin-top: 30px;
  margin-bottom: 20px; /* Adjust margin to match edit page */
  color: var(--text-dark, #2c3e50);
  font-family: var(--primary-font, 'Poppins', sans-serif);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Adjust gap to match edit page */
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
  box-sizing: border-box; /* Ensure padding doesn't affect width */
}

.textarea-description {
  border-radius: 20px; /* More rounded for textarea */
  resize: vertical;
}

.half-row-group {
  display: flex;
  gap: 10px;
}

.third-row-group {
  display: flex;
  gap: 10px;
}

.input-half {
  width: calc(50% - 5px); /* Adjust for gap */
}

.input-third {
  width: calc(33.33% - 6.66px); /* Adjust for gap */
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

  .title {
    font-size: 1.6rem;
  }

  .half-row-group,
  .third-row-group {
    flex-direction: column;
    gap: 10px;
  }

  .input-half,
  .input-third {
    width: 100%;
  }
}

@media screen and (min-width: 768px) {
  .container {
    max-width: 450px;
  }
} */
</style>
