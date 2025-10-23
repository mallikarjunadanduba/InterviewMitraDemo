import Swal from 'sweetalert2';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';


//todo ==> POST Skill DATA
export const createSkill = async (data, headers) => {
    try {
      const response = await axios({
        method: "POST",
        url: `${BaseUrl}/jobseekerskill/v1/createSkill`,
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
      console.error("Error creating skill:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to create skill", "error");
      throw error;
    }
  };



//todo ==> GET Skill data BY jobseekerProfileId 
export const getSkillById = async (id,headers ) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/jobseekerskill/v1/getAllSkillsByJobseekerProfileId/${id}`,
      headers: headers
    });
  };





//todo ==> GET  Skill DATA by the skillId 

export const getAllSkillData = async (skillId,headers) => {
    try {
      const response = await axios.get(`${BaseUrl}/jobseekerskill/v1/getSkillBySkillId/${skillId}`, {
        headers: headers
      });
      return response.data; 
    } catch (error) {
      throw error; 
    }
  };


  //todo ==> UPDATE Skill DATA
export const updateESkill = async (updatedData, headers) => {
    console.log(updatedData);
    try {
      const response = await axios({
        method: "PUT",
        url: `${BaseUrl}/jobseekerskill/v1/updateSkill`,
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
      console.error("Error updating skill:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to update skill", "error");
      throw error;
    }
};


//todo ==> DELETE  Skill DATA

export const deleteSkill = async (id, headers) => {
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
            url: `${BaseUrl}/jobseekerskill/v1/deleteSkillById/${id}`,
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
          Swal.fire('Error', 'Something went wrong while deleting the Skill.', 'error');
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