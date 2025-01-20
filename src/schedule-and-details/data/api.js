/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from "@edx/frontend-platform";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";
import { convertObjectToSnakeCase } from "../../utils";

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
// export const getCourseDetailsApiUrl = (courseId) =>
//   `${getApiBaseUrl()}/api/contentstore/v1/course_details/${courseId}`;
export const getCourseDetailsApiUrl = (courseId) =>
  `${getApiBaseUrl()}/api/ibl/v1/course_settings?course_key=${courseId}`;
export const getCourseSettingsApiUrl = (courseId) =>
  `${getApiBaseUrl()}/api/contentstore/v1/course_settings/${courseId}`;
export const getUploadAssetsUrl = (courseId) =>
  `${getApiBaseUrl()}/assets/${courseId}/`;
const getMfeConfigUrl = `${getConfig().LMS_BASE_URL}/api/mfe_config/v1`;
export const getCourseDetailsEncodedApiUrl = (courseId) =>
  `${getApiBaseUrl()}/api/ibl/v1/course_settings?course_key=${encodeURIComponent(courseId)}`;

/**
 * Get course details.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getCourseDetails(courseId) {
  const url = getCourseDetailsEncodedApiUrl(courseId);
  console.log('Fetching course details from:', url);

  try {
    const response = await getAuthenticatedHttpClient().get(url);
    console.log('Course details response:', response);
    const { data } = response;
    console.log('Course details data:', data);
    return camelCaseObject(data);
  } catch (error) {
    console.error('Error fetching course details:', error);
    console.log('Error response:', error.response);
    throw error;
  }
}

/**
 * Update course details.
 * @param {string} courseId
 * @param {object} details
 * @returns {Promise<Object>}
 */
export async function updateCourseDetails(courseId, details) {
  const url = getCourseDetailsApiUrl(courseId);
  const payload = convertObjectToSnakeCase(details, true);
  console.log('Updating course details at:', url);
  console.log('Update payload:', payload);

  try {
    const response = await getAuthenticatedHttpClient().post(url, payload);
    console.log('Update response:', response);
    const { data } = response;
    console.log('Updated data:', data);
    return camelCaseObject(data);
  } catch (error) {
    console.error('Error updating course details:', error);
    console.log('Error response:', error.response);
    throw error;
  }
}

/**
 * Get course settings.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getCourseSettings(courseId) {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getCourseSettingsApiUrl(courseId)}`
  );
  return camelCaseObject(data);
}

/**
 * Get MFE Config Object
 * @returns {Promise<Object>}
 */
export async function getMfeConfig() {
  const { data } = await getAuthenticatedHttpClient().get(`${getMfeConfigUrl}`);
  return data;
}
