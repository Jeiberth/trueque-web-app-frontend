<template>
  <div ref="tinderContainer" class="tinder-container">
    <div class="tinder--cards">
      <div
        v-for="(card, index) in displayedThings"
        :key="card.id"
        class="tinder--card"
        :style="cardStyle(index)"
      >
        <!-- <div class="swipe-overlay swipe-left"><i class="fa-solid fa-thumbs-down like" ></i></div>
        <div class="swipe-overlay swipe-right"><i class="fa-solid fa-thumbs-up like"></i></div> -->
        <div class="swipe-overlay swipe-left"><i data-feather="thumbs-down" class="like"></i></div>
        <div class="swipe-overlay swipe-right"><i data-feather="thumbs-up" class="like"></i></div>
        <img :src="card.imagesUrl" alt="Card image" class="card-image" @error="onImgError"/>
        <div class="card-details">
          <h3 class="title-card">{{ card.name }}</h3>
          <div class="badges">
            <span class="badge badge-price">~${{ card.price }}</span>
            <span class="badge badge-condition">{{ card.condition.name }}</span>
          </div>
          <p class="description-card">{{ card.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeMount, computed, nextTick } from 'vue';
import Hammer from 'hammerjs';
import feather from "feather-icons";
import fallbackImage from '@/assets/fallback.jpg'

function onImgError(event) {
  event.target.src = fallbackImage
}

// Props
const props = defineProps({
  things: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["swipeRight", "swipeLeft", "allSwiped"]);

// Refs and Reactive State
const tinderContainer = ref(null);
const allThings = ref([]);
const displayedThings = ref([]);
const currentIndex = ref(0);
const swipeDirection = ref(null);
const isAnimating = ref(false);

const cardStyle = computed(() => (index) => {
  if (index === 0) {
    return {
      transform: swipeDirection.value
        ? `translateX(${swipeDirection.value * 100}%) rotate(${swipeDirection.value * 30}deg)`
        : '',
      opacity: swipeDirection.value ? 0 : 1,
      transition: isAnimating.value ? 'transform 0.4s ease-out, opacity 0.4s ease-out' : 'none',
      zIndex: allThings.value.length - index,
    };
  } else if (index > 0 && index < 3) {
    const scale = 1 - index * 0.05;
    const translateY = -index * 10;
    return {
      transform: `scale(${scale}) translateY(${translateY}px)`,
      zIndex: allThings.value.length - index,
    };
  } else {
    return {
      display: 'none',
      zIndex: allThings.value.length - index,
    };
  }
});

const resetCardStyle = (el) => {
  if (el) {
    el.classList.remove('moving');
    el.style.transform = '';
    el.style.opacity = '';
    el.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
  }
  swipeDirection.value = null;
  isAnimating.value = false;
};

const handlePan = (event, el) => {
  if (isAnimating.value || displayedThings.value.length === 0) return;

  el.classList.add("moving");
  const container = tinderContainer.value;
  const deltaX = event.deltaX;

  container.classList.toggle("tinder_love", deltaX > 0);
  container.classList.toggle("tinder_nope", deltaX < 0);

  el.style.transform = `translate(${deltaX}px, ${event.deltaY}px) rotate(${deltaX * 0.03}deg)`;

  const opacity = Math.abs(deltaX) / 200;
  const leftOverlay = el.querySelector('.swipe-left');
  const rightOverlay = el.querySelector('.swipe-right');

  if (leftOverlay) leftOverlay.style.opacity = deltaX < 0 ? opacity : 0;
  if (rightOverlay) rightOverlay.style.opacity = deltaX > 0 ? opacity : 0;
  feather.replace();

};

const handlePanEnd = (event, el) => {
  if (isAnimating.value || displayedThings.value.length === 0) return;

  const deltaX = event.deltaX;
  const isRight = deltaX > 0;
  const threshold = 80;

  if (Math.abs(deltaX) > threshold) {
    swipeDirection.value = isRight ? 1 : -1;
    isAnimating.value = true;
    const swipedCardId = displayedThings.value[0]?.id;

    setTimeout(() => {
      if (swipedCardId) {
        // allThings.value = allThings.value.map(thing =>
        //   thing.id === swipedCardId ? { ...thing, swiped: true } : thing
        // );
        // emit(isRight ? "swipeRight" : "swipeLeft", swipedCardId);

        const swipedThing = allThings.value.find(thing => thing.id === swipedCardId);

        allThings.value = allThings.value.map(thing =>
            thing.id === swipedCardId ? { ...thing, swiped: true } : thing
        );

        if (swipedThing) {
            console.log(isRight);
            emit(isRight ? "swipeRight" : "swipeLeft", swipedThing );
        }

        currentIndex.value++;
        updateDisplayedThings();
        nextTick(() => resetCardStyle(el));
      }
    }, 300);
  } else {
    resetCardStyle(el);
    const leftOverlay = el.querySelector('.swipe-left');
    const rightOverlay = el.querySelector('.swipe-right');
    if (leftOverlay) leftOverlay.style.opacity = 0;
    if (rightOverlay) rightOverlay.style.opacity = 0;
  }
};

const updateDisplayedThings = () => {
  displayedThings.value = allThings.value
    .slice(currentIndex.value, currentIndex.value + 3)
    .filter(thing => !thing.swiped);
  if (displayedThings.value.length === 0 && allThings.value.some(thing => !thing.swiped)) {
    emit("allSwiped");
  } else if (displayedThings.value.length === 0 && allThings.value.every(thing => thing.swiped)) {
    emit("allSwiped");
  }
};

const initSwipe = () => {
  const cardElement = document.querySelector(".tinder--card");
  if (cardElement) {
    const hammertime = new Hammer(cardElement);
    hammertime.on("pan", (event) => handlePan(event, cardElement));
    hammertime.on("panend", (event) => handlePanEnd(event, cardElement));
  }
};

onMounted(() => {
  allThings.value = props.things.value.map(thing => ({ ...thing, swiped: false }));
  updateDisplayedThings();
  nextTick(initSwipe);
});


watch(displayedThings, () => {
  nextTick(initSwipe);
});

watch(() => props.things, (newThings) => {
  allThings.value = newThings.map(thing => ({ ...thing, swiped: false }));
  currentIndex.value = 0;
  updateDisplayedThings();
});
</script>

<style scoped>
.tinder-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* min-height: 100vh; */
  height: auto;
  padding-top: 0px;
}

.tinder--cards {
  position: relative;
  width: 90vw;
  max-width: 400px;
  height: calc(92vh - 110px);
  /* max-height: 600px; */
}

.tinder--card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--border-radius, 24px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
  background-color: white;
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}

.card-image {
  width: 100%;
  /* height: 70%; */
  height: 80%;
  object-fit: cover;
  border-radius: var(--border-radius, 24px) var(--border-radius, 24px) 0 0;
}

.card-details {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 20%;
  background: rgb(255, 255, 255);
  padding: 15px;
  box-sizing: border-box;
  border-radius: 0 0 var(--border-radius, 24px) var(--border-radius, 24px);
}

.title-card {
  font-weight: 500;
  font-size: 1.2rem;
  color: var(--text-dark, #2c3e50);
  margin-top: 0;
  margin-bottom: 8px;
  font-family: var(--primary-font, 'Poppins', sans-serif);
}

.badges {
  display: flex;
  gap: 7px;
  margin-bottom: 8px;
}

.badge {
  font-size: 0.8rem;
  padding: 5px 10px;
  border-radius: 20px;
  color: black;
  border: 1px solid lightgray;
  background-color: rgba(0, 0, 0, 0.05);
  white-space: nowrap;
}

.badge-price {
  background-color: rgba(65, 155, 95, 0.15);
  border-color: #2ecc71;
  color: #27ae60;
}

.badge-condition {
  background-color: rgba(255, 204, 0, 0.15);
  border-color: #ffc107;
  color: #d4a000;
}

.description-card {
  margin-top: 10px;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--text-dark, #2c3e50);
  overflow: hidden;
}

.swipe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  opacity: 0;
}

/* .swipe-left {
  background-color: rgba(255, 0, 0, 0.5);
}

.swipe-right {
  background-color: rgba(0, 255, 0, 0.5);
} */

.swipe-left {
  background-color: #c0392b;
}

.swipe-right {
  background-color: #23c16b;
}

.like{
    width: 200px;
    height: 200px;
    color: white;
}

</style>
