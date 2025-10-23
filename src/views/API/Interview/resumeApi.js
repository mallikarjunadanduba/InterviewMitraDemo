import axios from 'axios';
import { MockInterviewBaseUrl, MockInterviewEndpoints } from 'config/MockInterviewConfig';


// POST /upload_resume
export const uploadResume = async (resumeFile, headers = {}) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);

  return await axios.post(`${MockInterviewBaseUrl}${MockInterviewEndpoints.UPLOAD_RESUME}`, formData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data'
    }
  });
};
