import axios from 'axios';
import { BaseUrl } from '../../BaseUrl';

export const fetchSuccess = async (headers) => {
  return await axios({
    method: 'get',
    url: `${BaseUrl}/success/v1/getAllSuccessStoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

//todo ==> GET DATA BY ADVERTISE ID
export const getSuccessById = async (id, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/success/v1/getSuccessStoryById/{successstoryId}?successstoryId=${id}`,
    headers: headers
  });
};

//todo ==> UPDATE ADVERTISE DATA
export const updatedSuccess = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/success/v1/updateSuccessStory`,
    headers: headers,
    data: updatedData
  })
    .then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

//todo ==> DELETE  ADVERTISE DATA
export const deleteSuccess = async (id, headers) => {
  return await axios({
    method: 'delete',
    url: `${BaseUrl}/success/v1/deleteSuccessStoryById/${id}`,
    headers
  })
    .then((res) => {
      if (res.data.responseCode === 200) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

//todo ==> POST ADVERTISEMENT DATA
export const addSuccess = async (data, headers) => {
  try {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/success/v1/createSuccessStory`,
      headers,
      data: data
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert('Advertisement  added successfully');
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    });
  } catch (error) {
    alert(error);
  }
};

export const fetchSuccessCount = async (accessToken) => {
  const bannerUrl = `${BaseUrl}/success/v1/getAllSuccessStoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;
  try {
    const response = await axios.get(bannerUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data.content;
  } catch (error) {
    console.error('Error fetching Success Story:', error);
    throw error;
  }
};
