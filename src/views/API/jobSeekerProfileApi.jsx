// jobSeekerProfileApi.jsx

import Swal from 'sweetalert2';
import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

// ✅ POST: createJobSeekerProfile
export const createJobSeekerProfile = async (data, headers) => {
  try {
    const res = await axios.post(`${BaseUrl}/jobseekerprofile/v1/createJobSeekerProfile`, data, { headers });
    if (res.data.responseCode === 201) {
      Swal.fire(res.data.message);
    } else {
      Swal.fire('Error', res.data.errorMessage, 'error');
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Something went wrong.', 'error');
  }
};

// ✅ GET: getDigitalJobSeekerProfileById
export const getDigitalJobSeekerProfileById = async (headers, profileId) => {
  try {
    const res = await axios.get(`${BaseUrl}/jobseekerprofile/v1/getDigitalJobSeekerProfileById/${profileId}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ✅ GET: getJobSeekerProfileById
export const getJobSeekerProfileById = async (headers, profileId) => {
  try {
    const res = await axios.get(`${BaseUrl}/jobseekerprofile/v1/getJobSeekerProfileById/${profileId}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ✅ GET: getJobSeekerProfileByJobSeekerId
export const getJobSeekerProfileByJobSeekerId = async (headers, seekerId) => {
  try {
    const res = await axios.get(`${BaseUrl}/jobseekerprofile/v1/getJobSeekerProfileByJobSeekerId/${seekerId}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ✅ POST: saveOrUpdateJobSeekerProfile
export const saveOrUpdateJobSeekerProfile = async (data, headers) => {
  try {
    const res = await axios.post(`${BaseUrl}/jobseekerprofile/v1/saveOrUpdateJobSeekerProfile`, data, { headers });
    if (res.data.responseCode === 201) {
      Swal.fire(res.data.message);
    } else {
      Swal.fire('Error', res.data.errorMessage, 'error');
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Something went wrong.', 'error');
  }
};

// ✅ POST: saveOrUpdateJobSeekerProfileCoverPic
export const saveOrUpdateJobSeekerProfileCoverPic = async (data, headers) => {
  try {
    const res = await axios.put(`${BaseUrl}/jobseekerprofile/v1/saveOrUpdateJobSeekerProfileCoverPic`, data, {
      headers,
    });
    if (res.data.responseCode === 201) {
      Swal.fire(res.data.message);
    } else {
      Swal.fire('Error', res.data.errorMessage, 'error');
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Error while uploading cover picture.', 'error');
  }
};

// ✅ POST: saveOrUpdateJobSeekerProfilePic
export const saveOrUpdateJobSeekerProfilePic = async (data, headers) => {
  try {
    const res = await axios.put(`${BaseUrl}/jobseekerprofile/v1/saveOrUpdateJobSeekerProfilePic`, data, {
      headers,
    });
    if (res.data.responseCode === 201) {
      Swal.fire(res.data.message);
    } else {
      Swal.fire('Error', res.data.errorMessage, 'error');
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Error while uploading profile picture.', 'error');
  }
};

// ✅ PUT: updateJobSeekerProfile
export const updateJobSeekerProfile = async (updatedData, headers) => {
  try {
    const res = await axios.put(`${BaseUrl}/jobseekerprofile/v1/updateJobSeekerProfile`, updatedData, { headers });
    if (res.data.responseCode === 201) {
      Swal.fire(res.data.message);
    } else {
      Swal.fire('Error', res.data.errorMessage, 'error');
    }
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Failed to update profile.', 'error');
  }
};
