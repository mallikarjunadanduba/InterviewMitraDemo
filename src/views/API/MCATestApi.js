import axios from "axios";
import { BaseUrl } from "BaseUrl";
import Swal from "sweetalert2";

// tod GET McqTopic DATA
export const fetchMcqTopic = async (headers) => {
  try {
    const response = await axios.get(`${BaseUrl}/mcqtopic/v1/getAllMCQTopicByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`, {
      headers: headers
    });
    return response.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch McqTopic data', 'error');
    throw error;
  }
};

// ✅ Get MCQ data for quiz/test filters
export const getMcqDataByRequest = async (filterData, headers) => {
  try {
    console.log('Making API request to:', `${BaseUrl}/mcqquetions/v1/getMCQDataByMCQDataRequest`);
    console.log('Request data:', filterData);
    const res = await axios.post(`${BaseUrl}/mcqquetions/v1/getMCQDataByMCQDataRequest`, filterData, { headers });
    console.log('API response:', res.data);
    return res.data;
  } catch (error) {
    console.log('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Check if the error response contains data (some APIs return 400 but with valid data)
    if (error.response && error.response.data && Array.isArray(error.response.data) && error.response.data.length > 0) {
      console.log('API returned error status but with valid data:', error.response.data);
      return error.response.data;
    }
    
    // Check if the error response contains data in a different format
    if (error.response && error.response.data && typeof error.response.data === 'object') {
      console.log('API returned error status with data object:', error.response.data);
      // If it's an array, return it
      if (Array.isArray(error.response.data)) {
        return error.response.data;
      }
      // If it has a data property that's an array, return that
      if (error.response.data.data && Array.isArray(error.response.data.data)) {
        return error.response.data.data;
      }
    }
    
    // Try fallback with direct fetch if axios fails
    try {
      console.log('Trying fallback with direct fetch...');
      const response = await fetch(`${BaseUrl}/mcqquetions/v1/getMCQDataByMCQDataRequest`, {
        method: "POST",
        headers,
        body: JSON.stringify(filterData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fallback response:', data);
      return data;
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      Swal.fire('Error', `Failed to fetch filtered MCQ data: ${error.response?.status} - ${error.response?.statusText || error.message}`, 'error');
      throw error; // Throw original error
    }
  }
};

// ✅ Get all expertise levels
export const getAllExpertiseLevels = async (headers) => {
  try {
    const response = await axios.get(`${BaseUrl}/expertiselevel/v1/getAllExpertiseLevels`, {
      headers: headers
    });

    return response.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch expertise levels', 'error');
    throw error;
  }
};

// ✅ Get all experience levels
export const getAllExperiences = async (headers) => {
  try {
    const response = await axios.get(`${BaseUrl}/experience/v1/getAllExperiences`, {
      headers: headers
    });

    return response.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch experience levels', 'error');
    throw error;
  }
};

// -----------------------------
// ✅ McqExamHistory APIs
// -----------------------------

// ✅ CREATE or UPDATE ExamHistory
export const saveOrUpdateExamHistory = async (pdata, headers) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/mcqexam/v1/saveOrUpdateExamHistory`,
      JSON.stringify(pdata),
      { headers }
    );
    Swal.fire('Success', 'Exam history saved successfully', 'success');
    return res.data;
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'Failed to save exam history', 'error');
    throw error;
  }
};

// ✅ GET ExamHistory by ID
export const getExamHistoryById = async (headers, id) => {
  try {
    const res = await axios.get(`${BaseUrl}/mcqexam/v1/getExamHistoryById/${id}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch exam history by ID', 'error');
    throw error;
  }
};

// ✅ GET All ExamHistories by Seeker ID
export const getExamHistoriesBySeekerId = async (headers, seekerId) => {
  try {
    const res = await axios.get(`${BaseUrl}/mcqexam/v1/getExamHistoriesBySeekerId/${seekerId}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch exam histories', 'error');
    throw error;
  }
};

// ✅ DELETE ExamHistory by ID
export const deleteExamHistoryById = async (headers, id) => {
  try {
    const res = await axios.delete(`${BaseUrl}/mcqexam/v1/deleteExamHistoryById/${id}`, {
      headers,
    });
    Swal.fire('Success', res.data, 'success');
  } catch (error) {
    Swal.fire('Error', 'Failed to delete exam history', 'error');
  }
};

// -----------------------------
// ✅ McqExamResult APIs
// -----------------------------

// ✅ CREATE or UPDATE ExamResult
export const saveOrUpdateExamResult = async (pdata, headers) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/mcqexam/v1/saveOrUpdateExamResult`,
      JSON.stringify(pdata),
      { headers }
    );
    Swal.fire('Success', 'Exam result saved successfully', 'success');
    return res.data;
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'Failed to save exam result', 'error');
    throw error;
  }
};

// ✅ GET ExamResult by ID
export const getExamResultById = async (headers, id) => {
  try {
    const res = await axios.get(`${BaseUrl}/mcqexam/v1/getExamResultById/${id}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch exam result by ID', 'error');
    throw error;
  }
};

// ✅ GET All Results by ExamHistory ID
export const getResultsByExamHistoryId = async (headers, historyId) => {
  try {
    const res = await axios.get(`${BaseUrl}/mcqexam/v1/getResultsByExamHistoryId/${historyId}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch exam results', 'error');
    throw error;
  }
};

// ✅ DELETE ExamResult by ID
export const deleteExamResultById = async (headers, id) => {
  try {
    const res = await axios.delete(`${BaseUrl}/mcqexam/v1/deleteExamResultById/${id}`, {
      headers,
    });
    Swal.fire('Success', res.data, 'success');
  } catch (error) {
    Swal.fire('Error', 'Failed to delete exam result', 'error');
  }
};


