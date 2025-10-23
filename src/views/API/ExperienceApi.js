import Swal from 'sweetalert2';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';


//todo ==> POST Experience DATA
export const createExperience = async (data, headers) => {
    try {
      console.log("Creating experience with data:", data);
      const response = await axios({
        method: "POST",
        url: `${BaseUrl}/jobseekerexperience/v1/createJobSeekerExperience`,
        headers,
        data: JSON.stringify(data),
      });
      
      console.log("Create experience response:", response);
      if (response.data.responseCode === 201) {
        Swal.fire("Success", response.data.message, "success");
        return response;
      } else if (response.data.responseCode === 400) {
        const errorMessage = response.data.errorMessage || response.data.message || "Bad Request";
        Swal.fire("Error", errorMessage, "error");
        throw new Error(errorMessage);
      }
      return response;
    } catch (error) {
      console.error("Error creating experience:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      
      let errorMessage = "Failed to create experience";
      
      if (error.response?.data?.errorMessage) {
        errorMessage = error.response.data.errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire("Error", errorMessage, "error");
      throw error;
    }
  };



//todo ==> GET Experience data BY Experience ID
export const getExperienceById = async (headers, id) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/jobseekerexperience/v1/getJobSeekerExperienceByExperienceId/${id}`,
      headers: headers
    });
  };





//todo ==> GET  Experience DATA by the jobseekerProfileId 

export const getAllExperiences = async (profileId,headers) => {
    try {
      const response = await axios.get(`${BaseUrl}/jobseekerexperience/v1/getAllJobSeekerExperiencesByJobseekerProfileId/${profileId}`, {
        headers: headers
      });
      // The API returns an array directly, so we need to wrap it in a data property
      return { data: response.data }; 
    } catch (error) {
      throw error; 
    }
  };


  //todo ==> UPDATE Experience DATA
export const updateExperience = async (updatedData, headers) => {
    console.log("Updating experience with data:", updatedData);
    try {
      const response = await axios({
        method: "PUT",
        url: `${BaseUrl}/jobseekerexperience/v1/updateJobSeekerExperience`,
        headers: headers,
        data: JSON.stringify(updatedData),
      });
      
      console.log("Update experience response:", response);
      if (response.data.responseCode === 201) {
        Swal.fire("Success", response.data.message, "success");
        return response;
      } else if (response.data.responseCode === 400) {
        Swal.fire("Error", response.data.errorMessage, "error");
        throw new Error(response.data.errorMessage);
      }
      return response;
    } catch (error) {
      console.error("Error updating experience:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to update experience", "error");
      throw error;
    }
};


//todo ==> DELETE  Experience DATA

export const deleteExperience = async (id, headers) => {
    return Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
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
            url: `${BaseUrl}/jobseekerexperience/v1/deleteJobSeekerExperienceById/${id}`,
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
          Swal.fire('Error', 'Something went wrong while deleting the Experience.', 'error');
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