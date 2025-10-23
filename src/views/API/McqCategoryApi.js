import axios from 'axios';
import { BaseUrl, } from 'BaseUrl';

export const fetchMcqCategories = async (headers) => {
    return await axios({
      method: 'GET',
      url:`${BaseUrl}/mcacategory/v1/getAllMCQCategory`,
      headers: headers
    });
  };


  export const fetchMcqByCategoryId = async (headers, categoryId) => {
    return await axios({
      method: 'GET',
      url:`${BaseUrl}/mcqmodule/v1/getAllMCQModulesByMCQCategoryId/{categoryId}?categoryId=${categoryId}`,
      headers: headers
    });
  };

  export const fetchMcqByModuleId = async (headers, moduleId) => {
    return await axios({
      method: 'GET',
      url:`${BaseUrl}/mcqtopic/v1/getAllMCQTopicByPaginationByMCQModuleId/{pageNumber}/{pageSize}/{moduleId}?moduleId=${moduleId}&pageNumber=0&pageSize=100000`,
      headers: headers
    });
  };