import Swal from 'sweetalert2';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';


//todo ==> POST Course  DATA
export const createCourse = async (data, headers) => {
    try {
      return await axios({
        method: "POST",
        url: `${BaseUrl}/course/v1/createCourse`,
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



//todo ==> GET All Course data by jobseekerProfileId
export const getCourseBy_Id = async (headers, id) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/course/v1/getAllCoursesByJobseekerProfileId/${id}`,
      headers: headers
    });
  };





//todo ==> GET Course DATA by the courseId 

export const getBycourseId = async (courseId,headers) => {
    try {
      const response = await axios.get(`${BaseUrl}/course/v1/getCourseByCourseId/{courseId}?courseId=${courseId}`, {
        headers: headers
      });
      return response.data; 
    } catch (error) {
      throw error; 
    }
  };


  //todo ==> UPDATE Course DATA
export const updateCourse = async (updatedData, headers) => {
    console.log(updatedData);
   await axios({
    method: "PUT",
    url: `${BaseUrl}/course/v1/updateCourse`,
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


//todo ==> DELETE Course DATA

export const deleteCourse = async (id, headers) => {
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
            url: `${BaseUrl}/course/v1/deleteCourseById/${id}`,
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
          Swal.fire('Error', 'Something went wrong while deleting the Course.', 'error');
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



