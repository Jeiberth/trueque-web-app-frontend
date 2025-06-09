<template>
  <div ref="tinderContainer" class="tinder-container">
    <div class="tinder--cards">
      <div
        v-for="(card, index) in displayedThings"
        :key="card.id"
        class="tinder--card"
        :class="{ 'ad-card': card.isAd }"
        :style="cardStyle(index)"
      >
        <div class="swipe-overlay swipe-left"><i data-feather="thumbs-down" class="like"></i></div>
        <div class="swipe-overlay swipe-right"><i data-feather="thumbs-up" class="like"></i></div>

        <!-- Regular Card Content -->
        <template v-if="!card.isAd">
          <img :src="card.imagesUrl" alt="Card image" class="card-image" @error="onImgError"/>
          <div class="card-details">
            <h3 class="title-card">{{ card.name }}</h3>
            <div class="badges">
              <span class="badge badge-price">~${{ card.price }}</span>
              <span class="badge badge-condition">{{ card.condition.name }}</span>
            </div>
            <p class="description-card">{{ card.description }}</p>
          </div>
        </template>

        <!-- AdSense Ad Card Content -->
        <template v-else>
          <div class="ad-indicator">
            <span class="ad-label">Sponsored</span>
          </div>
          <div class="ad-content">
            <div 
              :id="`adsense-${card.id}`"
              class="adsense-container"
              v-html="card.adHtml"
            ></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick, onBeforeUnmount } from 'vue';
import Hammer from 'hammerjs';
import feather from "feather-icons";
import fallbackImage from '@/assets/fallback_swipe.jpg'

function onImgError(event) {
  event.target.src = fallbackImage
}

// Props
const props = defineProps({
  things: {
    type: Array,
    required: true,
  },
  adConfig: {
    type: Object,
    default: () => ({
      frequency: 5,
      enabled: true,
      adClient: 'ca-pub-2219376995096244', // Your AdSense client ID
      adSlot: '6240019370', // Your ad slot ID
      adLayoutKey: '+5y+s5-1j-50+eq' // Your layout key
    })
  }
});

const emit = defineEmits(["swipeRight", "swipeLeft", "allSwiped", "adViewed"]);

// Refs and Reactive State
const tinderContainer = ref(null);
const allThings = ref([]);
const displayedThings = ref([]);
const currentIndex = ref(0);
const swipeDirection = ref(null);
const isAnimating = ref(false);
const adCounter = ref(0);
const adsenseLoaded = ref(false);

// Load AdSense script
const loadAdSenseScript = () => {
  return new Promise((resolve, reject) => {
    if (window.adsbygoogle) {
      adsenseLoaded.value = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${props.adConfig.adClient}`;
    script.crossOrigin = 'anonymous';
    script.async = true;
    
    script.onload = () => {
      adsenseLoaded.value = true;
      resolve();
    };
    
    script.onerror = () => {
      console.error('Failed to load AdSense script');
      reject();
    };
    
    document.head.appendChild(script);
  });
};

//Generate AdSense HTML
// const generateAdSenseHTML = (adId) => {
//   return `
//     <ins class="adsbygoogle"
//          style="display:block; width: 100%; height: 100%;"
//          data-ad-format="fluid"
//          data-ad-layout-key="${props.adConfig.adLayoutKey}"
//          data-ad-client="${props.adConfig.adClient}"
//          data-ad-slot="${props.adConfig.adSlot}"
//          data-ad-test="${process.env.NODE_ENV !== 'production' ? 'on' : 'off'}">
//     </ins>
//   `;
// };

// const generateAdSenseHTML = (adId) => {
//   return `
//     <ins class="adsbygoogle"
//          style="display:block; width: 100%; height: 100%;"
//          data-ad-format="fluid"
//          data-ad-layout-key="${props.adConfig.adLayoutKey}"
//          data-ad-client="${props.adConfig.adClient}"
//          data-ad-slot="${props.adConfig.adSlot}"
//          data-ad-test="${process.env.NODE_ENV !== 'production' ? 'on' : 'on'}">
//     </ins>
//   `;
// };

const generateAdSenseHTML = (adId) => {
  return `
    <ins class="adsbygoogle"
          style="display:block; width: 100%; height: 100%;"
          data-ad-client="ca-pub-2219376995096244"
          data-ad-slot="7745126010"
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-ad-test="${process.env.NODE_ENV !== 'production' ? 'on' : 'on'}">
    </ins>
  `;
};




// Create ad object
const createAdCard = () => {
  const adId = `ad_${Date.now()}_${adCounter.value}`;
  adCounter.value++;
  
  return {
    id: adId,
    isAd: true,
    adHtml: generateAdSenseHTML(adId),
    swiped: false
  };
};

// Insert ads into content array
const insertAds = (items) => {
  if (!props.adConfig.enabled) return items;
  
  const result = [];
  const frequency = props.adConfig.frequency;
  
  for (let i = 0; i < items.length; i++) {
    result.push(items[i]);
    
    // Insert ad after every N cards (but not after the last card)
    if ((i + 1) % frequency === 0 && i < items.length - 1) {
      result.push(createAdCard());
    }
  }
  
  return result;
};

// Initialize AdSense ads
const initializeAds = async () => {
  if (!adsenseLoaded.value) return;
  
  await nextTick();
  
  // Find all AdSense containers that haven't been initialized
  const adContainers = document.querySelectorAll('.adsense-container ins.adsbygoogle');
  
  adContainers.forEach((adContainer) => {
    if (!adContainer.dataset.adsbygoogleStatus) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    }
  });
};



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

    const leftOverlay = el.querySelector('.swipe-left');
    const rightOverlay = el.querySelector('.swipe-right');
    if (leftOverlay) leftOverlay.style.opacity = 0;
    if (rightOverlay) rightOverlay.style.opacity = 0;

    feather.replace();
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
    const swipedCard = displayedThings.value[0];

    setTimeout(() => {
      if (swipedCard) {
        allThings.value = allThings.value.map(thing =>
          thing.id === swipedCard.id ? { ...thing, swiped: true } : thing
        );

        // Handle ad interactions
        if (swipedCard.isAd) {
          emit("adViewed", { 
            ad: swipedCard, 
            direction: isRight ? 'right' : 'left',
            timestamp: Date.now()
          });
        } else {
          emit(isRight ? "swipeRight" : "swipeLeft", swipedCard);
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
  
  // Initialize ads after updating displayed things
  if (displayedThings.value.some(thing => thing.isAd)) {
    nextTick(() => {
      initializeAds();
    });
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

const handleKeyboardSwipe = (isRight) => {
  if (isAnimating.value || displayedThings.value.length === 0) return;

  const cardElement = document.querySelector(".tinder--card");
  const swipedCard = displayedThings.value[0];
  if (!cardElement || !swipedCard) return;

  const direction = isRight ? 1 : -1;
  swipeDirection.value = direction;
  isAnimating.value = true;

  const leftOverlay = cardElement.querySelector(".swipe-left");
  const rightOverlay = cardElement.querySelector(".swipe-right");

  if (leftOverlay) leftOverlay.style.opacity = direction === -1 ? 1 : 0;
  if (rightOverlay) rightOverlay.style.opacity = direction === 1 ? 1 : 0;

  feather.replace();

  cardElement.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
  cardElement.style.transform = `translateX(${direction * 100}%) rotate(${direction * 30}deg)`;
  cardElement.style.opacity = 0;

  setTimeout(() => {
    allThings.value = allThings.value.map(thing =>
      thing.id === swipedCard.id ? { ...thing, swiped: true } : thing
    );

    if (swipedCard.isAd) {
      emit("adViewed", { 
        ad: swipedCard, 
        direction: isRight ? 'right' : 'left',
        timestamp: Date.now()
      });
    } else {
      emit(isRight ? "swipeRight" : "swipeLeft", swipedCard);
    }

    currentIndex.value++;
    updateDisplayedThings();
    nextTick(() => resetCardStyle(cardElement));
  }, 400);
};

const handleKeyDown = (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    handleKeyboardSwipe(false);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    handleKeyboardSwipe(true);
  }
};

onMounted(async () => {
  try {
    // Load AdSense script first
    await loadAdSenseScript();
    
    // Then setup cards with ads
    const itemsWithAds = insertAds(props.things.value);
    allThings.value = itemsWithAds.map(thing => ({ ...thing, swiped: false }));
    updateDisplayedThings();
    nextTick(initSwipe);

    window.addEventListener('keydown', handleKeyDown);
  } catch (error) {
    console.error('Failed to initialize ads:', error);
    // Fallback: load without ads
    allThings.value = props.things.value.map(thing => ({ ...thing, swiped: false }));
    updateDisplayedThings();
    nextTick(initSwipe);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

watch(displayedThings, () => {
  nextTick(initSwipe);
});

watch(() => props.things, async (newThings) => {
  const itemsWithAds = insertAds(newThings);
  allThings.value = itemsWithAds.map(thing => ({ ...thing, swiped: false }));
  currentIndex.value = 0;
  adCounter.value = 0;
  updateDisplayedThings();
});



</script>

<style scoped>
.tinder-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  padding-top: 0px;
}

.tinder--cards {
  position: relative;
  width: 90vw;
  max-width: 400px;
  height: calc(calc(var(--vh, 1vh) * 92) - 110px);
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

/* Ad-specific styling */
.ad-card {
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(45deg, #667eea, #764ba2) border-box;
}

.ad-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.ad-label {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
}

.ad-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}


.adsense-container {
  width: 100%;
  min-height: 280px;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.adsense-container .adsbygoogle {
  width: 100% !important;
  height: 100% !important;
  min-height: 250px;
}

.card-image {
  width: 100%;
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
  z-index: 5;
}

.swipe-left {
  background-color: #c0392b;
}

.swipe-right {
  background-color: #23c16b;
}

.like {
  width: 200px;
  height: 200px;
  color: white;
}
</style>