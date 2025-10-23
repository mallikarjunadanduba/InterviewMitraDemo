import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

export const fetchMcqCategories = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/mcacategory/v1/getAllMCQCategory`,
    headers: headers
  });
};

export const fetchStreamCategoryId = async (headers, categoryId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/mcqstream/v1/getAllMCQStreams/{categoryId}?categoryId=${categoryId}`,
    headers: headers
  });
};
export const fetchTopicsByStreamId = async (headers, streamId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/mcatopic/v1/getAllMCQTopicByStreamId/{streamId}?streamId=${streamId}`,
    headers: headers
  });
};

export const fetchQuestions = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/mcqfile/v1/getMCQDataByMCQDataRequest`,
    headers: headers
  });
};
