import axios from 'axios';
import { MockInterviewBaseUrl, MockInterviewEndpoints } from 'config/MockInterviewConfig';

// 1. POST /job_description
export const sendJobDescription = async (formData, headers) => {
  return await axios.post(`${MockInterviewBaseUrl}${MockInterviewEndpoints.JOB_DESCRIPTION}`, formData, {
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 2. GET /interview/<session_id>
export const fetchInterviewSession = async (sessionId) => {
  const response = await axios.get(`${MockInterviewBaseUrl}${MockInterviewEndpoints.INTERVIEW}/${sessionId}`);
  return response.data;
};


// GET /get_dynamic_question/<session_id>
export const fetchDynamicQuestion = async (sessionId) => {
  try {
    const response = await axios.get(`${MockInterviewBaseUrl}${MockInterviewEndpoints.DYNAMIC_QUESTION}/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dynamic question:", error);
    return { error: "Failed to fetch question." };
  }
};

// 3. POST /upload_response
export const uploadInterviewResponse = async (formData, headers = {}) => {
  try {
    const response = await axios.post(`${MockInterviewBaseUrl}${MockInterviewEndpoints.UPLOAD_RESPONSE}`, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 second timeout for large video uploads
    });
    return response.data;
  } catch (error) {
    // Re-throw the error with additional context
    console.error('Upload API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error; // Re-throw to be handled by the calling component
  }
};