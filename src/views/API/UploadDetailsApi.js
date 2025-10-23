import Swal from 'sweetalert2';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';


//todo ==> POST Video DATA
export const createVideo = async (data, headers) => {
    try {
      const response = await axios({
        method: "POST",
        url: `${BaseUrl}/video/v1/createVideo`,
        headers,
        data: data,
      });
      
      console.log(response);
      if (response.data.responseCode === 201) {
        Swal.fire(response.data.message);
        return response; // Return the response so the component can access response.data
      } else if (response.data.responseCode === 400) {
        Swal.fire(response.data.errorMessage);
        throw new Error(response.data.errorMessage);
      }
      
      return response;
    } catch (error) {
      console.error("Error creating video:", error);
      throw error;
    }
  };



//todo ==> GET Video data BY jobseekerProfileId 
export const getVideoById = async (headers, id) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/video/v1/getAllVideosByJobseekerProfileId/${id}/`,
      headers: headers
    });
  };





//todo ==> GET  Video DATA by the videoId 

export const getBy_ViedoId = async (headers,videoId) => {
    try {
      const response = await axios.get(`${BaseUrl}/video/v1/getVideoByVideoId/${videoId}`, {
        headers: headers
      });
      return response.data; 
    } catch (error) {
      throw error; 
    }
  };


  //todo ==> UPDATE Video DATA
export const updateVideo = async (updatedData, headers) => {
    console.log(updatedData);
   await axios({
    method: "PUT",
    url: `${BaseUrl}/video/v1/updateVideo`,
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


//todo ==> DELETE Video DATA

export const deleteVideo = async (id, headers) => {
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
            url: `${BaseUrl}/video/v1/deleteVideoById/${id}`,
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
          Swal.fire('Error', 'Something went wrong while deleting the Video.', 'error');
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