import Swal from 'sweetalert2';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';


//todo ==> POST Employment DATA
export const createEmployment = async (data, headers) => {
    try {
      const response = await axios({
        method: "POST",
        url: `${BaseUrl}/currentemployment/v1/createCurrentEmployment`,
        headers,
        data: JSON.stringify(data),
      });
      
      console.log(response);
      if (response.data.responseCode === 201) {
        Swal.fire("Success", response.data.message, "success");
        return response;
      } else if (response.data.responseCode === 400) {
        Swal.fire("Error", response.data.errorMessage, "error");
        throw new Error(response.data.errorMessage);
      }
      return response;
    } catch (error) {
      console.error("Error creating employment:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to create employment", "error");
      throw error;
    }
  };



//todo ==> GET Employment data BY jobseekerProfileId ID
export const getEmploymentById = async (headers, id) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/currentemployment/v1/getCurrentEmploymentByJobseekerProfileId/${id}`,
      headers: headers
    });
  };





//todo ==> GET  Employment DATA by the employmentId

export const getEmployment_Id = async (headers,employmentId) => {
    try {
      const response = await axios.get(`${BaseUrl}/currentemployment/v1/getCurrentEmploymentByEmploymentId/${employmentId}`, {
        headers: headers
      });
      return response.data; 
    } catch (error) {
      throw error; 
    }
  };


  //todo ==> UPDATE Employment DATA
export const updateEmployment = async (updatedData, headers) => {
    try {
      const response = await axios({
        method: "PUT",
        url: `${BaseUrl}/currentemployment/v1/updateCurrentEmployment`,
        headers: headers,
        data: JSON.stringify(updatedData),
      });
      
      console.log(response);
      if (response.data.responseCode === 201) {
        Swal.fire("Success", response.data.message, "success");
        return response;
      } else if (response.data.responseCode === 400) {
        Swal.fire("Error", response.data.errorMessage, "error");
        throw new Error(response.data.errorMessage);
      }
      return response;
    } catch (error) {
      console.error("Error updating employment:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to update employment", "error");
      throw error;
    }
};


//todo ==> DELETE  Employment DATA

export const deleteEmployment = async (id, headers) => {
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
            url: `${BaseUrl}/currentemployment/v1/deleteCurrentEmploymentById/${id}`,
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
          Swal.fire('Error', 'Something went wrong while deleting the Employment.', 'error');
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