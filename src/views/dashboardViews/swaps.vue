<template>
    <div style="overflow: hidden !important;">
        <overlay v-if="loadingSearching"></overlay>
        <successErrorCard :type="typeSuccessErrorCard" :text="textSuccessErrorCard" :launch="showSuccessErrorCard"></successErrorCard>
        <searchElement @searchThingsEmit="searchThings" @showFiltersEmit="showFiltersEmit()"></searchElement>
        <h2 class="noSwaps" v-if="showThingsAfterSearch && isThingsEmpty">{{ $t("Looks like you've seen everything! Try searching for something new or expanding your range to discover more.") }}</h2>
        <swipeCard v-if="showThingsAfterSearch"   @adViewed="trackAdView" :things="thingsForSwipe" @swipeRight="onSwipeRight" @swipeLeft="onSwipeLeft"  @allSwiped="onAllSwiped"/>
    </div>
</template>

<script setup>

    import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
    import Swal from 'sweetalert2'
    import overlay from "../components/overlay.vue";
    import searchElement from "../components/searchElement.vue";
    import swipeCard from "../components/swipeCard.vue";
    import swapApiResource from "../../api/swapResource"
    import feather from "feather-icons";
    import { useStore } from 'vuex'
    import { useI18n } from 'vue-i18n';

    const { t, locale } = useI18n();

    const store = useStore();

    onBeforeUnmount(() => {
        store.commit("setLoading", true);
        loadSwipes();
    })

    const trackAdView = (data) => {
        console.log('Ad viewed:', data.direction, 'at', new Date(data.timestamp));
        // Send analytics to your tracking system
    };

    import successErrorCard from "../components/successErrorCard.vue";
    const typeSuccessErrorCard = ref('');
    const textSuccessErrorCard = ref('');
    const showSuccessErrorCard = ref(false);


    const thingsForSwipe = reactive([]);

    const swapResource = new swapApiResource();

    onMounted(async () => {
        store.commit("setLoading", true);

        feather.replace();

        const cachedSwipes = store.getters.getCachedSwipes;

        if (cachedSwipes && cachedSwipes.length > 0) {
            thingsForSwipe.value = cachedSwipes;
            showThingsAfterSearch.value = true;
            store.commit("setLoading", false);
        } else {
            await swapResource
                .getFilteredThings()
                .then((response) => {
                    thingsForSwipe.value = response;
                    store.commit("setCachedSwipes", response);
                    showThingsAfterSearch.value = true;
                    if(response == null){ onAllSwiped(); };
                    store.commit("setLoading", false);
                });
        }

        store.commit("setLoading", false);

    });

    const isThingsEmpty = computed(() => thingsForSwipe.value.length === 0);

    const matchMessages = reactive({
        en: [
            {
            title: '🎉 Match Found!',
            message: "You've found a swap partner! Ready to exchange your items? Let's make this happen!"
            },
            {
            title: '🤝 It’s a Match!',
            message: "Great news! You both want to swap. Tap below to chat and finalize the exchange!"
            },
            {
            title: '🥳 Swap Time!',
            message: "You matched! Let’s get this swap rolling—hit the button to connect!"
            },
            {
            title: '🚀 Match Alert!',
            message: "You’ve got a match! Don’t miss out—click below to start your swap journey!"
            },
            {
            title: '🎊 It’s a Match!',
            message: "You and your match are ready to swap! Message them to arrange the details!"
            },
            {
            title: '💥 Exciting Match!',
            message: "You found someone to swap with! Let’s make this exchange happen!"
            },
            {
            title: '✨ Match Made!',
            message: "Congratulations! You’ve found a great swap partner. Time to chat!"
            },
            {
            title: '🎈 You Matched!',
            message: "Awesome! You matched with someone interested in swapping. Connect now!"
            },
            {
            title: '🌟 Swap Partner Found!',
            message: "You’ve found a swap partner! Ready to chat and arrange the exchange?"
            },
            {
            title: '🎶 It’s a Perfect Match!',
            message: "What a coincidence! You both want to swap. Let’s get started!"
            },
            {
            title: '🔔 Match Notification!',
            message: "You matched with someone looking to swap. Don’t wait—message them now!"
            },
            {
            title: '🏆 Match Success!',
            message: "Great job! You have a match. Time to coordinate your swap!"
            },
            {
            title: '💖 It’s a Great Match!',
            message: "You’ve matched with a fellow swapper! Let’s talk details!"
            },
            {
            title: '💫 You Matched Up!',
            message: "Fantastic! You found a swap partner. Click below to start chatting!"
            },
            {
            title: '🔥 Hot Match!',
            message: "You’ve got a match! Time to connect and finalize your swap!"
            },
            {
            title: '📦 Swap Partner Alert!',
            message: "You matched with someone ready to swap. Reach out to them now!"
            },
            {
            title: '🚦 Match Confirmed!',
            message: "You’ve found a swap partner! Ready to exchange details?"
            },
            {
            title: '💡 Match Found!',
            message: "Great news! You have a match. Start chatting to arrange the swap!"
            },
            {
            title: '🍀 Lucky Match!',
            message: "You matched with someone who wants to swap. Don’t miss your chance!"
            },
            {
            title: '🔗 Connection Established!',
            message: "You’ve got a match! Let’s connect and make that swap happen!"
            },
            {
            title: '🥇 It’s a Winner!',
            message: "You found a swap partner! Ready to start your exchange journey?"
            }
        ],
        es: [
            {
            title: '🎉 ¡Intercambio Encontrado!',
            message: "¡Has encontrado un compañero para intercambiar! ¿Listo para hacer el cambio? ¡Hagámoslo realidad!"
            },
            {
            title: '🤝 ¡Es un Match!',
            message: "¡Buenas noticias! Ambos quieren intercambiar. ¡Toca abajo para chatear y cerrar el trato!"
            },
            {
            title: '🥳 ¡Hora de Intercambiar!',
            message: "¡Tienes un match! Vamos a empezar el intercambio—¡haz clic para conectar!"
            },
            {
            title: '🚀 ¡Alerta de Match!',
            message: "¡Tienes un match! No lo dejes pasar—haz clic abajo para comenzar tu intercambio."
            },
            {
            title: '🎊 ¡Es un Match!',
            message: "¡Tú y tu compañero están listos para intercambiar! Escríbele para coordinar los detalles."
            },
            {
            title: '💥 ¡Match Emocionante!',
            message: "¡Encontraste a alguien para intercambiar! ¡Hagamos este intercambio realidad!"
            },
            {
            title: '✨ ¡Match Perfecto!',
            message: "¡Felicidades! Has encontrado un gran compañero de intercambio. ¡Hora de chatear!"
            },
            {
            title: '🎈 ¡Tienes un Match!',
            message: "¡Genial! Hiciste match con alguien interesado en intercambiar. ¡Conecta ahora!"
            },
            {
            title: '🌟 ¡Compañero de Intercambio Encontrado!',
            message: "¡Has encontrado un compañero para intercambiar! ¿Listo para chatear y organizar el intercambio?"
            },
            {
            title: '🎶 ¡Es un Match Perfecto!',
            message: "¡Qué coincidencia! Ambos quieren intercambiar. ¡Empecemos!"
            },
            {
            title: '🔔 ¡Notificación de Match!',
            message: "Has hecho match con alguien interesado en intercambiar. ¡No esperes—envíale un mensaje ahora!"
            },
            {
            title: '🏆 ¡Match Exitoso!',
            message: "¡Buen trabajo! Tienes un match. ¡Hora de coordinar el intercambio!"
            },
            {
            title: '💖 ¡Gran Match!',
            message: "¡Has hecho match con otro intercambiador! ¡Hablemos de los detalles!"
            },
            {
            title: '💫 ¡Tienes un Match!',
            message: "¡Fantástico! Has encontrado un compañero de intercambio. ¡Haz clic abajo para empezar a chatear!"
            },
            {
            title: '🔥 ¡Match Caliente!',
            message: "¡Tienes un match! ¡Es hora de conectar y cerrar el intercambio!"
            },
            {
            title: '📦 ¡Alerta de Intercambio!',
            message: "Hiciste match con alguien listo para intercambiar. ¡Contáctalo ahora!"
            },
            {
            title: '🚦 ¡Match Confirmado!',
            message: "¡Has encontrado un compañero de intercambio! ¿Listo para intercambiar detalles?"
            },
            {
            title: '💡 ¡Match Encontrado!',
            message: "¡Buenas noticias! Tienes un match. ¡Empieza a chatear para organizar el intercambio!"
            },
            {
            title: '🍀 ¡Match Afortunado!',
            message: "Hiciste match con alguien que quiere intercambiar. ¡No pierdas tu oportunidad!"
            },
            {
            title: '🔗 ¡Conexión Establecida!',
            message: "¡Tienes un match! ¡Conectemos y hagamos que el intercambio suceda!"
            },
            {
            title: '🥇 ¡Es un Ganador!',
            message: "¡Encontraste un compañero de intercambio! ¿Listo para comenzar tu experiencia?"
            }
        ]
    });



    const showThingsAfterSearch = ref(false);
    const showFiltersEmit = () => {
        showThingsAfterSearch.value = false;
    }

    const loadingSearching = ref(false);

    const searchThings = (obj) => {
        loadingSearching.value = true;
        showThingsAfterSearch.value = false;
        swapResource
            .getFilteredThings({ range: obj.range, category_id: obj.category, condition_id: obj.condition , material_id: obj.material , color_id: obj.color , weight: [ 0 , obj.weight ], price: [ 0 , obj.price ], search: obj.searchTerm })
            .then((response) => {
                thingsForSwipe.value = response;
                store.commit("setCachedSwipes", thingsForSwipe.value);
                showThingsAfterSearch.value = true;
                loadingSearching.value = false;
                if(response == null){ onAllSwiped(); };
            });
    };

    // const onSwipeRight = (thingId) => {
    //     swapResource
    //         .swipeRight({ thing_id: thingId })
    //         .then((response) => {
    //             if(response.match){
    //                 Swal.fire({
    //                     title: matchMessages[Math.floor(Math.random() * matchMessages.length)].title,
    //                     text: matchMessages[Math.floor(Math.random() * matchMessages.length)].message,
    //                     icon: "success",
    //                     iconHtml: '<i data-feather="shuffle" class="custom-icon"></i>',
    //                     timer: 2800,
    //                     timerProgressBar: true,
    //                     showConfirmButton: false, // Remove the OK button
    //                     backdrop: true,
    //                     customClass: {
    //                         popup: 'custom-modal', // Custom modal class
    //                         icon: 'custom-icon-wrapper', // Custom icon wrapper class
    //                     },
    //                     willOpen: () => {
    //                         feather.replace(); // Replace <i> tags with Feather icons
    //                     },
    //                 });
    //             }
    //         });
    // };

    // const onSwipeLeft = (thingId) => {
    //     swapResource
    //         .swipeLeft({ thing_id: thingId })
    //         .then((response) => {
    //         });
    // };

    const swaps = ref([]);

    const onSwipeRight = (swipedThing) => {

        swaps.value.push({ thing_id: swipedThing.id, user_id: swipedThing.user_id, liked: true, matched: swipedThing.liked });

        if(swaps.value.length == 10){
            loadSwipes();
        }

        if(swipedThing.liked){
            Swal.fire({
                // title: matchMessages[Math.floor(Math.random() * matchMessages.length)].title,
                // text: matchMessages[Math.floor(Math.random() * matchMessages.length)].message,
                title: matchMessages[locale.value][Math.floor(Math.random() * matchMessages[locale.value].length)].title,
                text: matchMessages[locale.value][Math.floor(Math.random() * matchMessages[locale.value].length)].message,
                icon: "success",
                iconHtml: '<i data-feather="shuffle" class="custom-icon"></i>',
                timer: 2800,
                timerProgressBar: true,
                showConfirmButton: false, // Remove the OK button
                backdrop: true,
                customClass: {
                    popup: 'custom-modal', // Custom modal class
                    icon: 'custom-icon-wrapper', // Custom icon wrapper class
                },
                willOpen: () => {
                    feather.replace(); // Replace <i> tags with Feather icons
                },
            })
        }

    }

    const onSwipeLeft = (swipedThing) => {
        swaps.value.push({ thing_id: swipedThing.id, user_id: swipedThing.user_id, liked: false, matched: false });

        if(swaps.value.length == 10){
            loadSwipes();
        }
    };

    // const loadSwipes = async () => {
    //     const currentSwipes = [...swaps.value];
    //     swaps.value = [];

    //     try {
    //         await swapResource.loadSwipes({ swipes: currentSwipes });
    //         store.commit("setCachedSwipes", thingsForSwipe.value);
    //     } catch (error) {
    //         console.error("Failed to send swipes:", error);
    //     }
    // };

    const loadSwipes = async () => {

        if (swaps.value.length === 0) return;

        const currentSwipes = [...swaps.value];
        const swipedThingIds = currentSwipes.map(swipe => swipe.thing_id);
        const thingsNotSwipedYet = thingsForSwipe.value.filter(
            thing => !swipedThingIds.includes(thing.id)
        );

        try {
            swaps.value = [];

            store.commit("setCachedSwipes", thingsNotSwipedYet);

            const response = await swapResource.loadSwipes({ swipes: currentSwipes });

            if(response.success){
                store.commit("addMatches", response.new_chats);
            }

        } catch (error) {
            console.error("Failed to send swipes:", error);
        }
    };

    const onAllSwiped = () => {
        typeSuccessErrorCard.value = 'info';
        textSuccessErrorCard.value = t('Try Searching for Something Else');
        showSuccessErrorCard.value = true;
        setTimeout(() => {
            showSuccessErrorCard.value = false;
        }, 2800);
        thingsForSwipe.value.length = 0;
        store.commit("setCachedSwipes", []);
        loadSwipes();
    };

</script>


<style>
/* Custom styles for the modal */
.custom-modal {
    background-color: white;/* Light background color */
    border-radius: 50px;
    padding: 20px;
    width: 80%;
    height: auto;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.219);
    overflow: hidden;
}

/* Custom styles for the icon wrapper */
.custom-icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px; /* Larger circle around the icon */
    height: 70px;
    margin-bottom: 10px; /* Space below the icon */
    margin-top: 10px;
    border-radius: 50%;
    animation: rotateIcon 2s infinite linear; /* Rotate animation */
}

.swal2-title{
    padding: 0;
}

/* Style for the icon itself */
.custom-icon {
    width: 50px; /* Width of the icon */
    height: 50px; /* Height of the icon */
}

/* Blurred backdrop */
.swal2-backdrop-show{
    backdrop-filter: blur(5px); /* Adjust blur intensity */
}

/* Icon rotation animation */
@keyframes rotateIcon {
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(360deg);
    }
}

.swal2-html-container{
    margin: 0;
    margin-top: 10px;
}

.backback{
    background-color: #347d27;
}

.noSwaps {
    position: absolute;
    text-align: center;
    color: rgba(255, 255, 255, 0.856);
    font-family: monospace; /* Ensures even spacing */
    white-space: pre-line; /* Keeps line breaks */
    margin: 25px;
}


</style>
