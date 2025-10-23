import axios from 'axios';
import BaseUrl from '../../BaseUrl';


// 1. GET /final_report/<session_id>
// This fetches an HTML page (renders a report view in the browser)
export const fetchFinalReport = async (sessionId) => {
  return await axios.get(`${BaseUrl}/final_report/${sessionId}`);
};

// 2. GET /reports/<filename>
// This downloads the generated .txt report
export const downloadReportFile = async (filename) => {
  return await axios.get(`${BaseUrl}/reports/${filename}`, {
    responseType: 'blob', // ensure file is treated as binary
  });
};
