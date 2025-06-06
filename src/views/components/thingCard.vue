<template>
    <div
        :class="['thing-container', { 'for-offer': isForOffer, 'liked': liked }]"
        @click="handleClick"
    >
        <!-- <div
            class="image-container"
            :style="{ backgroundImage: `url(${imageUrl})` }"
        ></div> -->

        <div class="image-container">
            <img
                :src="imageSrc"
                @error="onImageError"
                alt="Thing image"
            />
        </div>

        <!-- Content Section -->
        <div class="content">
            <h5 class="thing-name">{{ name }}</h5>
            <div class="thing-attributes">
                <span class="badge badge-price">~${{ price }}</span>
                <span class="badge badge-condition">{{ condition }}</span>
            </div>
            <p class="thing-description">{{ description }}</p>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import fallbackImage from '@/assets/fallback_thing_msg.jpg'



export default defineComponent({
    name: 'ThingCard',
    props: {
        thing_id: { type: Number, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: String, required: true },
        condition: { type: String, required: true },
        imageUrl: { type: String, required: true },
        owner: { type: Boolean, required: true },
        noOwner: { type: Boolean, required: true },
        forOffer: { type: Boolean, required: true },
        isForOffer: { type: Boolean, required: false },
        liked: { type: Boolean, required: false, default: false },
    },
    emits: ['editThing', 'seeThing', 'selectThingForOffer'],
    setup(props, { emit }) {
        const handleClick = () => {
            if (props.noOwner) {
                emit('seeThing');
            }
            if (props.owner) {
                emit('editThing');
            }
            if (props.forOffer) {
                emit('selectThingForOffer', props.thing_id);
            }
        };

        const imageSrc = ref(props.imageUrl);

        const onImageError = () => {
            imageSrc.value = fallbackImage;
        };


        return { handleClick, onImageError, imageSrc };
    },
    mounted() {
        if (window.feather) {
            window.feather.replace();
        }
    },
});
</script>


<style scoped>
    .thing-container {
        width: 96%;
        height: 110px;
        border-radius: 35px;
        margin: auto;
        margin-bottom: 8px;
        background-color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        display: flex;
        cursor: pointer;
        transition: border 0.3s ease, box-shadow 0.3s ease;
        overflow: hidden;
    }

    /* .thing-container.for-offer {
        border: 2px solid darkslategray;
    } */

    .thing-container.for-offer {
        border: 2px solid rgb(0, 0, 0);
        box-shadow: inset 0 4px 15px rgba(0, 0, 0, 0.5), 0 4px 15px rgba(0, 0, 0, 0.219);
    }


    /* .image-container {
        width: 30%;
        height: 100%;
        background-size: cover;
        background-position: center;
        border-radius: 20px 0 0 20px;
        flex-shrink: 0;
    } */

    .image-container {
        width: 30%;
        height: 100%;
        flex-shrink: 0;
        border-radius: 20px 0 0 20px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }


    .content {
        flex: 1;
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
    }

    .thing-name {
        font-size: 1rem;
        font-weight: bold;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .thing-attributes {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
    }

    .badge {
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
    }

    .badge-price {
        background-color: rgba(65, 155, 95, 0.15);
        border: 1px solid darkslategray;
    }

    .badge-condition {
        background-color: rgba(217, 255, 0, 0.15);
        border: 1px solid rgb(255, 187, 0);
    }

    .thing-description {
        flex: 1;
        font-size: 0.85rem;
        color: #666;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        margin-top: 4px;
    }
</style>
