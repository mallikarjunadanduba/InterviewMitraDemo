import axios from "axios";
import { BaseUrl } from "BaseUrl";
import Swal from "sweetalert2";

// -----------------------------
// ✅ ShortAnswerExam APIs
// -----------------------------

// ✅ CREATE or UPDATE ShortAnswer ExamHistory
export const saveOrUpdateShortAnswerExamHistory = async (pdata, headers) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/shortanswerexam/v1/saveOrUpdateExamHistory`,
      JSON.stringify(pdata),
      { headers }
    );
    return res.data;
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'Failed to save short answer exam history', 'error');
    throw error;
  }
};

// ✅ GET ShortAnswer ExamHistory by ID
export const getShortAnswerExamHistoryById = async (headers, id) => {
  try {
    const res = await axios.get(`${BaseUrl}/shortanswerexam/v1/getExamHistoryById/${id}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch short answer exam history by ID', 'error');
    throw error;
  }
};

// ✅ GET All ShortAnswer ExamHistories by Seeker ID
export const getShortAnswerExamHistoriesBySeekerId = async (headers, seekerId) => {
  try {
    const res = await axios.get(`${BaseUrl}/shortanswerexam/v1/getExamHistoriesBySeekerId/${seekerId}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch short answer exam histories', 'error');
    throw error;
  }
};

// ✅ DELETE ShortAnswer ExamHistory by ID
export const deleteShortAnswerExamHistoryById = async (headers, id) => {
  try {
    const res = await axios.delete(`${BaseUrl}/shortanswerexam/v1/deleteExamHistoryById/${id}`, {
      headers,
    });
    Swal.fire('Success', res.data, 'success');
  } catch (error) {
    Swal.fire('Error', 'Failed to delete short answer exam history', 'error');
  }
};

// ✅ CREATE or UPDATE ShortAnswer ExamResult
export const saveOrUpdateShortAnswerExamResult = async (pdata, headers) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/shortanswerexam/v1/saveOrUpdateExamResult`,
      JSON.stringify(pdata),
      { headers }
    );
    return res.data;
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'Failed to save short answer exam result', 'error');
    throw error;
  }
};

// ✅ GET ShortAnswer ExamResult by ID
export const getShortAnswerExamResultById = async (headers, id) => {
  try {
    const res = await axios.get(`${BaseUrl}/shortanswerexam/v1/getExamResultById/${id}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch short answer exam result by ID', 'error');
    throw error;
  }
};

// ✅ GET All ShortAnswer Results by ExamHistory ID
export const getShortAnswerResultsByExamHistoryId = async (headers, historyId) => {
  try {
    const res = await axios.get(`${BaseUrl}/shortanswerexam/v1/getResultsByExamHistoryId/${historyId}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch short answer exam results', 'error');
    throw error;
  }
};

// ✅ DELETE ShortAnswer ExamResult by ID
export const deleteShortAnswerExamResultById = async (headers, id) => {
  try {
    const res = await axios.delete(`${BaseUrl}/shortanswerexam/v1/deleteExamResultById/${id}`, {
      headers,
    });
    Swal.fire('Success', res.data, 'success');
  } catch (error) {
    Swal.fire('Error', 'Failed to delete short answer exam result', 'error');
  }
};

// ✅ Evaluate Single Short Answer with NLP
export const evaluateShortAnswer = async (studentAnswer, correctAnswer, questionId, questionText, examHistoryId, headers) => {
  try {
    const formData = new FormData();
    formData.append('studentAnswer', studentAnswer);
    formData.append('correctAnswer', correctAnswer);
    formData.append('questionId', questionId);
    formData.append('questionText', questionText);
    formData.append('examHistoryId', examHistoryId);

    const res = await axios.post(
      `${BaseUrl}/shortanswerexam/v1/evaluateShortAnswer`,
      formData,
      { 
        headers: {
          ...headers,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return res.data;
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'Failed to evaluate short answer', 'error');
    throw error;
  }
};

// ✅ Batch Evaluate Multiple Short Answers
export const batchEvaluateShortAnswers = async (answers, headers) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/shortanswerexam/v1/batchEvaluateAnswers`,
      JSON.stringify(answers),
      { headers }
    );
    return res.data;
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'Failed to batch evaluate short answers', 'error');
    throw error;
  }
};

// -----------------------------
// ✅ Short Answer Topic and Question APIs
// -----------------------------

// ✅ Get Short Answer Topics
export const getShortAnswerTopics = async (headers) => {
  try {
    const response = await axios.get(`${BaseUrl}/shortanswertopic/v1/getAllShortAnswerTopics`, {
      headers: headers
    });
    return response.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch short answer topics', 'error');
    throw error;
  }
};

// ✅ Get Short Answer Questions by Request
export const getShortAnswerQuestionsByRequest = async (filterData, headers) => {
  try {
    console.log("SAQTestApi: Making request to:", `${BaseUrl}/shortanswerquestions/v1/getShortAnswerDataByRequest`);
    console.log("SAQTestApi: Payload:", filterData);
    console.log("SAQTestApi: Headers:", headers);
    
    const res = await axios.post(`${BaseUrl}/shortanswerquestions/v1/getShortAnswerDataByRequest`, filterData, { headers });
    console.log("SAQTestApi: Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("SAQTestApi: Error details:", error);
    console.error("SAQTestApi: Error response:", error.response?.data);
    
    // Try fallback with direct fetch if axios fails
    try {
      console.log("SAQTestApi: Trying fallback with direct fetch...");
      const response = await fetch(`${BaseUrl}/shortanswerquestions/v1/getShortAnswerDataByRequest`, {
        method: "POST",
        headers,
        body: JSON.stringify(filterData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("SAQTestApi: Fallback response:", data);
      return data;
    } catch (fallbackError) {
      console.error("SAQTestApi: Fallback also failed:", fallbackError);
      Swal.fire('Error', 'Failed to fetch short answer questions. Please check if the API endpoint exists.', 'error');
      throw error; // Throw original error
    }
  }
};

// ✅ Get Short Answer Question by ID
export const getShortAnswerQuestionById = async (headers, id) => {
  try {
    const res = await axios.get(`${BaseUrl}/shortanswerquestions/v1/getShortAnswerQuestionById/${id}`, {
      headers,
    });
    return res.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to fetch short answer question', 'error');
    throw error;
  }
};

// ✅ Create Short Answer Question
export const createShortAnswerQuestion = async (questionData, headers) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/shortanswerquestions/v1/createShortAnswerQuestion`,
      JSON.stringify(questionData),
      { headers }
    );
    return res.data;
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'Failed to create short answer question', 'error');
    throw error;
  }
};

// ✅ Update Short Answer Question
export const updateShortAnswerQuestion = async (id, questionData, headers) => {
  try {
    const res = await axios.put(
      `${BaseUrl}/shortanswerquestions/v1/updateShortAnswerQuestion/${id}`,
      JSON.stringify(questionData),
      { headers }
    );
    return res.data;
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'Failed to update short answer question', 'error');
    throw error;
  }
};

// ✅ Delete Short Answer Question
export const deleteShortAnswerQuestion = async (headers, id) => {
  try {
    const res = await axios.delete(`${BaseUrl}/shortanswerquestions/v1/deleteShortAnswerQuestion/${id}`, {
      headers,
    });
    Swal.fire('Success', 'Short answer question deleted successfully', 'success');
    return res.data;
  } catch (error) {
    Swal.fire('Error', 'Failed to delete short answer question', 'error');
    throw error;
  }
};
