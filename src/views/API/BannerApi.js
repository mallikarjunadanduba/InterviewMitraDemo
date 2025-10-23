import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

export const fetchBanner = async (headers) => {
  return await axios({
    method: 'get',
    url: `${BaseUrl}/advertisement/v1/getAllAdvertisementByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const addBanner = async (data, headers) => {
  try {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/advertisement/v1/createAdvertisement`,
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

export const deleteBanner = async (id, headers) => {
  return await axios({
    method: 'delete',
    url: `${BaseUrl}/advertisement/v1/deleteAdvertisementById/${id}`,
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

export const getAdvertiseById = async (id, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/advertisement/v1/getAdvertisementByAdvertisementId/{advertisementId}?advertisementId=${id}`,
    headers: headers
  });
};

export const updatedAdvertise = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/advertisement/v1/updateAdvertisement`,
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
