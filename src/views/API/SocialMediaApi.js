import Swal from 'sweetalert2';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';


//todo ==> POST SocilaMedia  DATA
export const createSocialmedia = async (data, headers) => {
    try {
      return await axios({
        method: "POST",
        url: `${BaseUrl}/socialmedia/v1/createSocialmedia`,
        headers,
        data: data,
      }).then(function (res) {
        console.log(res);
        if (res.data.responseCode === 201) {
          Swal.fire(res.data.message);
        } else if (res.data.responseCode === 400) {
          Swal.fire(res.data.errorMessage);
        }
      });
    } catch (error) {
      alert(error);
    }
  };



//todo ==> GET Socialmedia data BY jobseekerProfileId ID
export const getSocialmediaById = async (headers, id) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/socialmedia/v1/getAllSocialmediasByJobseekerProfileId/${id}`,
      headers: headers
    });
  };





//todo ==> GET  Socialmedia DATA by the SocialmediaId 

export const getSocialmediaDetails = async (socialmediaId,headers,) => {
    try {
      const response = await axios.get(`${BaseUrl}/socialmedia/v1/getSocialmediaById/${socialmediaId}`, {
        headers: headers
      });
      return response.data; 
    } catch (error) {
      throw error; 
    }
  };


  //todo ==> UPDATE socialmedia DATA
export const updatesocialmedia = async (updatedData, headers) => {
    console.log(updatedData);
   await axios({
    method: "PUT",
    url: `${BaseUrl}/socialmedia/v1/updateSocialmedia`,
    headers:headers,
    data:JSON.stringify(updatedData),
  })
    .then(function (res) {
        console.log(res);
      if (res.data.responseCode === 201) {
        Swal.fire(res.data.message);
      } else if (res.data.responseCode === 400) {
        Swal.fire(res.data.errorMessage);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};


//todo ==> DELETE  socialMedia DATA

export const deleteSocialMedia = async (id, headers) => {
    return Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios({
            method: 'DELETE',
            url: `${BaseUrl}/socialmedia/v1/deleteSocialmediaById/${id}`,
            headers: headers,
          });
  
          if (res.data.responseCode === 200) {
            Swal.fire('Deleted!', res.data.message, 'success');
            return Promise.resolve(true); 
          } else if (res.data.responseCode === 400) {
            Swal.fire('Error', res.data.errorMessage, 'error');
            return Promise.reject(new Error(res.data.errorMessage)); 
          }
        } catch (err) {
          Swal.fire('Error', 'Something went wrong while deleting the socialmedia.', 'error');
          console.error(err);
          return Promise.reject(err); 
        }
      } else {
        // Handle cancel action
        console.log('Delete action canceled');
        return Promise.resolve(false); 
      }
    });
  };



