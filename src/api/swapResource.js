// src/api/swapResource.js

import axios from '/src/axios.js';  // Import the axios instance

export default class SwapResource {

  // newThing(data) {
  //   return axios({
  //     url: '/things',
  //     method: 'post',
  //     data: data,
  //   });
  // }

  newThing(data) {
    return axios({
        url: '/things',
        method: 'post',
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
  }

  register(data) {
    return axios({
      url: '/register',
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  updateUser(data) {
    return axios({
      url: `/updateUser/`,
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }


  updateThing(data) {
    return axios({
      url: `/UpdateThing/`,
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  deleteThing(id) {
    return axios({
      url: `/DeleteThing/${id}`,
      method: 'put',
    });
  }


  login(data) {
    return axios({
      url: '/login',
      method: 'post',
      data: data,
    });
  }

  logout() {
    return axios({
      url: '/logout',
      method: 'post',
    });
  }




  // Get user details
  getUserDetails(data) {
    return axios({
      url: `/user/details/`,
      method: 'get',
      params: data,
    });
  }

  // Toggle availability of a thing
  toggleThingAvailability(id) {
    return axios({
      url: `/things/${id}/availability`,
      method: 'put',
    });
  }

  checkAndVerifyBio(code1) {
    return axios({
      url: `/checkAndVerifyBio/${code1}`,
      method: 'put',
    });
  }

  // Get filtered things based on query params
  getFilteredThings(query) {
    return axios({
      url: '/filtered-things',
      method: 'get',
      params: query,  // Send the query parameters as a GET request
    });
  }

  // Swipe left action
  swipeLeft(data) {
    return axios({
      url: '/swipeLeft',
      method: 'post',
      data: data,  // Send data in the body
    });
  }

  // Swipe right action
  swipeRight(data) {
    return axios({
      url: '/swipeRight',
      method: 'post',
      data: data,  // Send data in the body
    });
  }

  loadSwipes(data) {
    return axios({
      url: '/load/swipes',
      method: 'post',
      data: data,  // Send data in the body
    });
  }

  // Get user chats
  getUserChats() {
    return axios({
      url: '/user-chats',
      method: 'get',
    });
  }

  // Get user things by user ID
  getUserThings(data) {
    return axios({
      url: `/user-things/`,
      method: 'get',
      params: data,
    });
  }

  // Create an offer
  createOffer(data) {
    return axios({
      url: '/make-offer',
      method: 'post',
      data: data,  // Send data in the body
    });
  }

  // Get offer details by offer ID
  getOfferWithDetails(data) {
    return axios({
      url: `/offer-all/`,
      method: 'get',
      params: data,
    });
  }

  // Get offers between users
  getOffersBetweenUsers(data) {
    return axios({
      url: `/offers/between`,
      method: 'get',
      params: data,
    });
  }

  // Change the status of an offer
  changeOfferStatus(data) {
    return axios({
      url: `/offers/changeStatus`,
      method: 'put',
      data: data,  // Send data in the body
    });
  }

  verifyAndChanegPassword(data) {
    return axios({
      url: `/verifyAndChanegPassword`,
      method: 'put',
      data: data,  // Send data in the body
    });
  }

  // Get categories
  getCategories() {
    return axios({
      url: '/categories',
      method: 'get',
    });
  }

  resetPasswordSendVerCode(email){
    return axios({
      url: `/resetPasswordSendVerCode/${email}`,
      method: 'get',
    });
  }

  // Get materials
  getMaterials() {
    return axios({
      url: '/materials',
      method: 'get',
    });
  }

  // Get colors
  getColors() {
    return axios({
      url: '/colors',
      method: 'get',
    });
  }

  getFilters() {
    return axios({
      url: '/filters',
      method: 'get',
    });
  }

  // Get conditions
  getConditions() {
    return axios({
      url: '/conditions',
      method: 'get',
    });
  }

  getMessagesByChatId(data) {
    return axios({
      url: '/getMessagesByChatId',
      method: 'get',
      params: data,
    });
  }

  newRating(data) {
    return axios({
      url: '/ratings',
      method: 'post',
      data: data,
    });
  }



  sendMessage(data) {
    return axios({
      url: '/messages',
      method: 'post',
      data: data,
    });
  }

  registerFcmToken(data) {
    return axios({
      url: '/fcm-token/register',
      method: 'post',
      data: data,
    });
  }

  unregisterFcmToken(data) {
    return axios({
      url: '/fcm-token/unregister',
      method: 'post',
      data: data,
    });
  }


}
