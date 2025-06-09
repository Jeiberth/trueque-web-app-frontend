import { createStore } from 'vuex';
import swapApiResource from "../api/swapResource"
import { initEcho, disconnectEcho } from '../echo'; // adjust path

const store = createStore({
  state: {
    token: null,  // Store token
    userId: null,  // Store user ID
    fcmToken: null,
    loading: false,
    conditions: null,
    categories: null,
    materials: null,
    colors: null,
    cachedSwipes: null,
    userDetails: null,
    matches: null,
    messages: {},
    userProfiles: {},
    userOffers: {},
    echo: null,
  },
  mutations: {
    setToken(state, token) {
        state.token = token;
    },
    setFcmToken(state, fcmToken) {
        state.token = fcmToken;
    },
    setUserId(state, userId) {
        state.userId = userId;
    },
    setLoading(state, loading) {
        state.loading = loading;
    },
    logout(state) {
        state.token = null;
        state.userId = null;
        state.userDetails = null;
    },
    setConditions(state, conditions) {
        state.conditions = conditions;
    },
    setCategories(state, categories) {
        state.categories = categories;
    },
    setMaterials(state, materials) {
        state.materials = materials;
    },
    setColors(state, colors) {
        state.colors = colors;
    },
    setCachedSwipes(state, swipes) {
      state.cachedSwipes = swipes;
    },
    clearCachedSwipes(state) {
      state.cachedSwipes = null;
    },
    setUserDetails(state, userDetails) {
      state.userDetails = userDetails;
    },
    addNewThing(state, newThing) {
        if (state.userDetails) {
            state.userDetails.things.unshift(newThing);
            state.userDetails.things_count++;
        }
    },
    updateThingInStore(state, updatedThing) {
        if (state.userDetails && state.userDetails.things) {
            const index = state.userDetails.things.findIndex(t => t.id === updatedThing.id);
            if (index !== -1) {
                // Preserve the existing images if not provided in update
                if (!updatedThing.imagesUrl && state.userDetails.things[index].imagesUrl) {
                    updatedThing.imagesUrl = state.userDetails.things[index].imagesUrl;
                }
                state.userDetails.things.splice(index, 1, updatedThing);
            }
        }
    },
    deleteThingFromStore(state, thingId) {
        if (state.userDetails && state.userDetails.things) {
            state.userDetails.things = state.userDetails.things.filter(t => t.id !== thingId);
            if (state.userDetails.things_count > 0) {
                state.userDetails.things_count--;
            }
        }
    },
    setMatches(state, matches) {
        state.matches = matches;
    },
    addMatches(state, newMatches) {
        try {
            if (Array.isArray(newMatches) && newMatches.length > 0) {
                const validMatches = newMatches.filter(
                    match => match && typeof match === 'object' && !Array.isArray(match)
                );
                if (validMatches.length > 0) {
                    state.matches = [...state.matches, ...validMatches];
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    },
    RESET_UNREAD_MESSAGES_COUNT(state, chat_id) {
      const match = state.matches.find(m => m.chat_id == chat_id);
      if (match) {
        match.unread_messages_count = 0;
      }
    },
    RESET_OFFERS_COUNT(state, chat_id) {
      const match = state.matches.find(m => m.chat_id == chat_id);
      if (match) {
        match.offers_count = 0;
      }
    },
    INCREMENT_OFFERS_COUNT(state, chat_id) {
        try {
            const match = state.matches.find(m => m.chat_id == chat_id);
            if (match) {
                match.offers_count++;
                return true;
            }
        } catch (error) {
            return false;
        }
    },
    INCREMENT_UNREAD_MESSAGES_COUNT(state, chat_id) {
        try {
            if (chat_id && Array.isArray(state.matches)) {
                const match = state.matches.find(m => m.chat_id == chat_id);
                if (match && typeof match.unread_messages_count === 'number') {
                    match.unread_messages_count++;
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    },
    setMessages(state, { chatId, messages }) {
        state.messages[chatId] = messages;
    },
    addMessageOptimistically(state, { chatId, tempId, message }) {
        if (!state.messages[chatId]) {
            state.messages[chatId] = [];
        }
        // Add temporary message with pending status
        state.messages[chatId].push({
            ...message,
            id: tempId,
            _status: 'pending'
        });
    },
    confirmMessageSent(state, { chatId, tempId, serverMessage }) {
        const messages = state.messages[chatId];
        if (messages) {
            const index = messages.findIndex(m => m.id === tempId && m._status === 'pending');
            if (index !== -1) {
                // Replace temporary message with server response
                messages.splice(index, 1, serverMessage);
            } else {
                // Add as new message if temp message not found
                messages.push(serverMessage);
            }
        }
    },
    pushMessageGotten(state, { message }) {
        try {
            if (message && message.chat_id && Array.isArray(state.messages[message.chat_id])) {
                state.messages[message.chat_id].push(message);
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    },
    markMessagesAsRead(state, chatId) {
        // Update unread count in matches
        if (state.matches) {
            const match = state.matches.find(m => m.chat_id == chatId);
            if (match) {
                match.unread_messages_count = 0;
            }
        }
    },
    setUserProfile(state, { userId, profileData }) {
        state.userProfiles[userId] = profileData;
    },
    updateUserProfileRating(state, { userId, newRating }) {
        if (state.userProfiles[userId]) {
            state.userProfiles[userId].average_rating = newRating;
        }
        // Also update in matches if this user is there
        if (state.matches) {
            const match = state.matches.find(m => m.userId == userId);
            if (match) {
                match.rating = newRating;
            }
        }
    },
    clearUserProfiles(state) {
        state.userProfiles = {};
    },
    addUserRating(state, { userId, newRating }) {
        if (state.userProfiles[userId]) {
            // Add the new rating to the ratings array
            state.userProfiles[userId].ratings.push(newRating);

            // Calculate new average rating
            const ratings = state.userProfiles[userId].ratings;
            const sum = ratings.reduce((total, r) => total + r.ratingScore, 0);
            const average = sum / ratings.length;

            // Update the average rating
            state.userProfiles[userId].average_rating = average;

            // // Also update in matches if this user is there
            // if (state.matches) {
            //     const match = state.matches.find(m => m.userId === userId);
            //     if (match) {
            //     match.rating = average;
            //     }
            // }
        }
    },
    setUserOffers(state, { userId, offersData }) {
        state.userOffers[userId] = offersData;
    },
    addUserOffer(state, { userId, newOffer }) {
        try {
            if (state.userOffers && state.userOffers[userId]) {
                state.userOffers[userId].offers.unshift(newOffer);
                commit('INCREMENT_OFFERS_COUNT', newOffer.chat_id)
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    },
    // updateUserOffer(state, { userId, offerId, updatedOffer }) {
    //     if (state.userOffers[userId]) {
    //         const index = state.userOffers[userId].offers.findIndex(o => o.id === offerId);
    //         if (index !== -1) {
    //             state.userOffers[userId].offers.splice(index, 1, updatedOffer);
    //         }
    //     }
    // },
    updateUserOfferStatus(state, { userId, offerId, newStatusId, chat_id }) {
        try {
            if (state.userOffers && state.userOffers[userId]) {
                const offer = state.userOffers[userId].offers.find(o => o.id == offerId);
                if (offer && offer.offer) {
                    offer.status_id = newStatusId;
                    offer.offer.offerStatus = newStatusId;
                    commit('INCREMENT_OFFERS_COUNT', chat_id)
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    },
    clearUserOffers(state) {
        state.userOffers = {};
    },
    SET_ECHO(state, echoInstance) {
        state.echo = echoInstance;
    },
    CLEAR_ECHO(state) {
        if (state.echo) {
            state.echo.disconnect();
            state.echo = null;
        }
    }
  },
  actions: {
    setAuthData({ commit, dispatch }, { token, userId }) {
      commit('setToken', token);
      commit('setUserId', userId);
    },
    initEcho({ state, commit, dispatch }) {
        const echo = initEcho(state.token);

        echo.private(`user.${state.userId}`)
            .listen('.user.message', (e) => {

                switch (e.message.type) {
                    case "newMessage": {
                        dispatch('pushNewMessageOther', e.message.data);
                    }
                    case "newChat":{
                        commit("addMatches", e.message.data);
                    }
                    case "newOffer":{
                        commit('addUserOffer', { userId: e.message.data.userId , newOffer: e.message.data });
                    }
                    case "newOfferStatus":{
                        commit("updateUserOfferStatus", { userId: e.message.data.userId , offerId: e.message.data.offerId , newStatusId: e.message.data.newStatusId, chat_id: e.message.data.chat_id });
                    }
                    default:
                        return false
                }

            });

        commit('SET_ECHO', echo);
    },
    logout({ commit }) {
      commit('logout');
      commit('clearCachedSwipes');
      commit('setUserDetails', null);
      commit('setMatches', null);
      commit('CLEAR_AUTH');
      commit('CLEAR_ECHO');
    },
    // async fetchData({ commit }) {
    //     const swapResource = new swapApiResource();
    //     commit('setConditions', await swapResource.getConditions());
    //     commit('setCategories', await swapResource.getCategories());
    //     commit('setMaterials', await swapResource.getMaterials());
    //     commit('setColors', await swapResource.getColors());
    // },
    async fetchData({ commit }) {
        const swapResource = new swapApiResource();
        const filters = await swapResource.getFilters();

        commit('setConditions', filters.conditions);
        commit('setCategories', filters.categories);
        commit('setMaterials', filters.materials);
        commit('setColors', filters.colors);
    },
    async fetchUserDetails({ commit, state }) { // Add this action
        const swapResource = new swapApiResource();
        try {
            const response = await swapResource.getUserDetails();
            commit('setUserDetails', response);
            return response;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    },
    async fetchMatches({ commit }) {
        const swapResource = new swapApiResource();
        try {
            const response = await swapResource.getUserChats();
            commit('setMatches', response);
            return response;
        } catch (error) {
            throw error;
        }
    },
     async sendNewMessage({ commit, state }, { chatId, content }) {
        // Generate temporary ID for optimistic update
        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
            id: tempId,
            content,
            user_id: state.userId,
            created_at: new Date().toISOString(),
            _status: 'pending'
        };

        // Optimistically add message
        commit('addMessageOptimistically', { chatId, tempId, message: tempMessage });

        try {
            const swapResource = new swapApiResource();
            const serverMessage = await swapResource.sendMessage({
                chat_id: chatId,
                content
            });

            // Confirm the message with server response
            commit('confirmMessageSent', { chatId, tempId, serverMessage });
            return serverMessage;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },
    pushNewMessageOther({ commit, state }, message) {
        try {
            if (message && message.chat_id) {
                const pushSuccess = commit('pushMessageGotten', { message });
                const incrementSuccess = commit('INCREMENT_UNREAD_MESSAGES_COUNT', message.chat_id);
                return pushSuccess && incrementSuccess;
            }
            return false;
        } catch (error) {
            return false;
        }
    },
    async markMessagesRead({ commit }, chatId) {
        commit('markMessagesAsRead', chatId);
        // await swapResource.markMessagesAsRead({ chat_id: chatId });
    },
    async fetchMessages({ commit, state }, chatId) {
        // Return cached messages if available
        if (state.messages[chatId]) {
            return state.messages[chatId];
        }

        const swapResource = new swapApiResource();
        try {
            const messages = await swapResource.getMessagesByChatId({ chat_Id: chatId });
            commit('setMessages', { chatId, messages });
            return messages;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },
    async fetchUserProfile({ commit, state }, userId) {
        // Return cached profile if available
        if (state.userProfiles[userId]) {
            return state.userProfiles[userId];
        }

        const swapResource = new swapApiResource();
        try {
            const profileData = await swapResource.getUserDetails({ userId });
            commit('setUserProfile', { userId, profileData });
            return profileData;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },
    async submitUserRating({ commit }, { userId, ratedUserId, ratingData }) {
        const swapResource = new swapApiResource();
        try {
            // Create the new rating object
            const newRating = {
                userId: userId, // rater's ID
                userName: store.getters.getUserDetails?.user?.name || 'You',
                ratingScore: ratingData.rating,
                ratingComment: ratingData.comment,
                ratingCreatedAt: new Date().toISOString().slice(0, 10)
            };

            // Update store with the new rating
            commit('addUserRating', {
                userId: ratedUserId,
                newRating: {
                ...newRating,
                }
            });

            // Submit to server
            const response = await swapResource.newRating({
                user_id: userId,
                rated_user_id: ratedUserId,
                score: ratingData.rating,
                comment: ratingData.comment
            });

            return response;
        } catch (error) {
            console.error('Error submitting rating:', error);
            throw error;
        }
    },
    async fetchUserOffers({ commit, state }, userId) {
        // Return cached offers if available
        if (state.userOffers[userId]) {
            return state.userOffers[userId];
        }

        const swapResource = new swapApiResource();
        try {
            const offersData = await swapResource.getOffersBetweenUsers({ userId });
            commit('setUserOffers', { userId, offersData });
            return offersData;
        } catch (error) {
            console.error('Error fetching user offers:', error);
            throw error;
        }
    },
    // async createNewOffer({ commit }, { userId, offerData }) {
    //     const swapResource = new swapApiResource();
    //     try {
    //     const newOffer = await swapResource.createOffer(offerData);
    //     commit('addUserOffer', { userId, newOffer });
    //     return newOffer;
    //     } catch (error) {
    //     console.error('Error creating offer:', error);
    //     throw error;
    //     }
    // }
  },
  getters: {
    isAuthenticated(state) {
        return !!state.token;  // Returns true if token exists
    },
    getToken(state) {
        return state.token;
    },
    getFcmToken(state) {
        return state.fcmToken;
    },
    getUserId(state) {
        return state.userId;
    },
    getLoading(state) {
        return state.loading;
    },
    getConditions(state) {
        return state.conditions;
    },
    getCategories(state) {
        return state.categories;
    },
    getMaterials(state) {
        return state.materials;
    },
    getColors(state) {
        return state.colors;
    },
    getCachedSwipes: (state) => state.cachedSwipes,
    getUserDetails: (state) => state.userDetails,
    getMatches: (state) => state.matches,
    getMessagesByChatId: (state) => (chatId) => {
        return state.messages[chatId] || [];
    },
    getUnreadCount: (state) => (chatId) => {
        return state.unreadCounts[chatId] || 0;
    },
    getUserProfile: (state) => (userId) => {
        return state.userProfiles[userId] || null;
    },
    getUserOffers: (state) => (userId) => {
        return state.userOffers[userId] || { offers: [], makeOffer: false };
    },
    totalUnreadAndOffersCount: (state) => {
        return state.matches.reduce((sum, match) => {
            return sum + (match.unread_messages_count || 0) + (match.offers_count || 0);
        }, 0);
    }
  }
});

export default store;
