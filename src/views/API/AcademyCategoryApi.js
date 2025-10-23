import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

export const fetchAcademyCategories = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academiccategory/v1/getAllAcademicCategoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const fetchCategoryById = async (categoryId, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academiccategory/v1/getAcademicCategoryByCategoryId/{categoryId}?categoryId=${categoryId}`,
    headers: headers
  });
};

export const fetchAcademyCourses = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academiccourse/v1/getAllAcademicCoursesByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};
export const fetchAcademyModules = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academicmodule/v1/getAllAcademicModulesByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};
export const fetchAcademyTopics = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academictopic/v1/getAllAcademicTopicsByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const fetchCourseByCategoryId = async (headers, categoryId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academiccourse/v1/getAcademicCoursesByCategoryId/{categoryId}?categoryId=${categoryId}`,
    headers: headers
  });
};

export const fetchCourseByCourseId = async (headers, courseId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academiccourse/v1/getAcademicCourseByCourseId/{courseId}?courseId=${courseId}`,
    headers: headers
  });
};

export const fetchModulesByCourseId = async (headers, courseId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academicmodule/v1/getAcademicModulesByCourseId/{courseId}?courseId=${courseId}`,
    headers: headers
  });
};
export const fetchTopicsBymoduleId = async (headers, moduleId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academictopic/v1/getAcademicTopicsByModuleId/{moduleId}?moduleId=${moduleId}`,
    headers: headers
  });
};
