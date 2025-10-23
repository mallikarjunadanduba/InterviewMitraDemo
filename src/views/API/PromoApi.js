import axios from 'axios';
import { BaseUrl } from '../../BaseUrl';

//todo ==> POST PROMO DATA
export const postPromoData = async (pdata, headers) => {
  try {
    await axios({
      method: 'POST',
      url: `${BaseUrl}/promo/v1/createPromo`,
      headers: headers,
      data: JSON.stringify(pdata)
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert('Promo  added successfully');
      } else {
        alert(res);
      }
    });
  } catch (error) {
    alert(error);
  }
};

//todo ==> GET  PROMO DATA
export const fetchPromo = async (headers) => {
  try {
    const response = await axios.get(`${BaseUrl}/promo/v1/getAllPromoByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`, {
      headers: headers
    });
    return response.data; // Extract and return the data from the response
  } catch (error) {
    throw error; // Handle errors appropriately
  }
};

//todo ==> GET DATA BY PROMO ID
export const getPromoById = async (headers, id) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/promo/v1/getPromoByPromoId/{promoId}?promoId=${id}`,
    headers: headers
  });
};

// todo==> UPDATE PROMO
export const updatedPromo = async (updateddata, headers) => {
  try {
    const response = await axios({
      method: 'PUT',
      url: `${BaseUrl}/promo/v1/updatePromo`,
      headers: headers,
      data: updateddata
    });

    if (response.data.responseCode === 201) {
      alert(response.data.message);
    } else if (response.data.responseCode === 400) {
      alert(response.data.errorMessage);
    } else {
      alert('Unexpected response code');
    }
  } catch (error) {
    console.error('Error updating promo:', error);
  }
};

//todo ==> DELETE  PROMO DATA
export const deletePromo = async (headers, id) => {
  await axios({
    method: 'DELETE',
    url: `${BaseUrl}/promo/v1/deletePromoById/${id}`,
    headers: headers
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
