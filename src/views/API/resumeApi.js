import axios from 'axios';
import BaseUrl from '../../BaseUrl';


// POST /upload_resume
export const uploadResume = async (resumeFile, headers = {}) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);

  return await axios.post(`${BaseUrl}/upload_resume`, formData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data'
    }
  });
};
