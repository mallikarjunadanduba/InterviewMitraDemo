import Swal from 'sweetalert2';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';


//todo ==> POST Language DATA
export const createLanguage = async (data, headers) => {
    try {
      console.log("Creating language with data:", data);
      const response = await axios({
        method: "POST",
        url: `${BaseUrl}/jobseekerlanguage/v1/createLanguage`,
        headers,
        data: data,
      });
      
      console.log("Create language response:", response);
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
      console.error("Error creating language:", error);
      let errorMessage = "Failed to create language";
      
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



//todo ==> GET  all Language data by jobseekerProfileId
export const getLanguageByProfileId = async (headers, id) => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${BaseUrl}/jobseekerlanguage/v1/getAllLanguageByJobseekerProfileId/${id}`,
        headers: headers
      });
      
      
      // If response.data is an array, return it directly
      if (Array.isArray(response.data)) {
        return { data: response.data };
      }
      
      // If response.data has a data property, return that
      if (response.data.data) {
        return { data: Array.isArray(response.data.data) ? response.data.data : [response.data.data] };
      }
      
      // Otherwise, wrap the response in a data property
      return { data: [response.data] };
    } catch (error) {
      console.error("Error fetching languages by profile ID:", error);
      // Return empty array instead of throwing error
      return { data: [] };
    }
  };





//todo ==> GET Language DATA by the LanguageId 

export const getLanguageId = async (languageId, headers) => {
    try {
      const response = await axios.get(`${BaseUrl}/jobseekerlanguage/v1/getLanguageByLanguageId/${languageId}`, {
        headers: headers
      });
      return response.data; 
    } catch (error) {
      console.error("Error fetching language by ID:", error);
      throw error; 
    }
  };


  //todo ==> UPDATE Language DATA
export const updateLanguage = async (updatedData, headers) => {
    console.log("Updating language with data:", updatedData);
    try {
      const response = await axios({
        method: "PUT",
        url: `${BaseUrl}/jobseekerlanguage/v1/updateLanguage`,
        headers: headers,
        data: updatedData,
      });
      
      console.log("Update language response:", response);
      if (response.data.responseCode === 201) {
        Swal.fire("Success", response.data.message, "success");
        return response;
      } else if (response.data.responseCode === 400) {
        Swal.fire("Error", response.data.errorMessage, "error");
        throw new Error(response.data.errorMessage);
      }
      return response;
    } catch (error) {
      console.error("Error updating language:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to update language", "error");
      throw error;
    }
  };


//todo ==> DELETE Language DATA

export const deleteLanguage = async (id, headers) => {
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
            url: `${BaseUrl}/jobseekerlanguage/v1/deleteLanguageById/${id}`,
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
          Swal.fire('Error', 'Something went wrong while deleting the Language.', 'error');
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



