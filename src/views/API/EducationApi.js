import Swal from 'sweetalert2';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';


//todo ==> POST Education DATA
export const createEducation = async (data, headers) => {
    try {
      const response = await axios({
        method: "POST",
        url: `${BaseUrl}/education/v1/createEducation`,
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
      console.error("Error creating education:", error);
      Swal.fire("Error", error.response?.data?.message || "Failed to create education", "error");
      throw error;
    }
  };



//todo ==> GET Education data BY jobseekerProfileId
export const getEducationById = async (id,headers) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/education/v1/getAllEducationsByJobseekerProfileId/${id}`,
      headers: headers
    });
  };





//todo ==> GET  Education DATA by the educationId

export const getAllEducation = async (profileId,headers) => {
    try {
      const response = await axios.get(`${BaseUrl}/education/v1/getEducationByEducationId/${profileId}`, {
        headers: headers
      });
      return response.data; 
    } catch (error) {
      throw error; 
    }
  };


  //todo ==> UPDATE Education DATA
  export const updateEducation = async (updatedData, headers) => {
    try {
        const res = await axios({
            method: "PUT",
            url: `${BaseUrl}/education/v1/updateEducation`,
            headers: headers,
            data: JSON.stringify(updatedData),
        });

        if (res.data.responseCode === 201) {
            await Swal.fire({
                icon: "success",
                title: "Success",
                text: res.data.message,
            });
        } else if (res.data.responseCode === 400) {
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: res.data.errorMessage,
            });
        }

        return res.data;
    } catch (error) {
        console.error("Error updating education:", error);
        await Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "Something went wrong! Please try again.",
        });
        throw error;
    }
};



//todo ==> DELETE  Education DATA by educationId

export const deleteEducation = async (id, headers) => {
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
            url: `${BaseUrl}/education/v1/deleteEducationById/${id}`,
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
          Swal.fire('Error', 'Something went wrong while deleting the Education.', 'error');
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