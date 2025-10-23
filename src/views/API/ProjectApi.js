import Swal from 'sweetalert2';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';


//todo ==> POST Project DATA
export const createproject = async (data, headers) => {
    try {
      const response = await axios({
        method: "POST",
        url: `${BaseUrl}/project/v1/createProject`,
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
      console.error("Error creating project:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to create project", "error");
      throw error;
    }
  };



//todo ==> GET Project data BY jobseekerProfileId ID
export const getProjectById = async (headers, id) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/project/v1/getAllProjectsByJobseekerProfileId/${id}`,
      headers: headers
    });
  };





//todo ==> GET  Project DATA by the ProojectId 

export const getProjectId = async (headers,projectId) => {
    try {
      const response = await axios.get(`${BaseUrl}/project/v1/getProjectByProjectId/${projectId}`, {
        headers: headers
      });
      return response.data; 
    } catch (error) {
      throw error; 
    }
  };


  //todo ==> UPDATE Project DATA
export const updateProject = async (updatedData, headers) => {
    console.log(updatedData);
    try {
      const response = await axios({
        method: "PUT",
        url: `${BaseUrl}/project/v1/updateProject`,
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
      console.error("Error updating project:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to update project", "error");
      throw error;
    }
};


//todo ==> DELETE  Project DATA

export const deleteProject = async (id, headers) => {
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
            url: `${BaseUrl}/project/v1/deleteProjectById/${id}`,
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
          Swal.fire('Error', 'Something went wrong while deleting the Project.', 'error');
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



