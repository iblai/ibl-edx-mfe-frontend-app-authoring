/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from "@edx/frontend-platform";
import { getAuthenticatedHttpClient } from "@edx/frontend-platform/auth";
import { convertObjectToSnakeCase } from "../../utils";

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
// export const getCourseDetailsApiUrl = (courseId) =>
//   `${getApiBaseUrl()}/api/contentstore/v1/course_details/${courseId}`;
export const getCourseDetailsApiUrl = (courseId) =>
  `${getApiBaseUrl()}/api/ibl/v1/course_settings?course_key=${encodeURIComponent(courseId)}`;
export const getCourseSettingsApiUrl = (courseId) =>
  `${getApiBaseUrl()}/api/contentstore/v1/course_settings/${courseId}`;
export const getUploadAssetsUrl = (courseId) =>
  `${getApiBaseUrl()}/assets/${courseId}/`;
const getMfeConfigUrl = `${getConfig().LMS_BASE_URL}/api/mfe_config/v1`;

/**
 * Get course details.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getCourseDetails(courseId) {
  const { data } = await getAuthenticatedHttpClient().get(
    `${getCourseDetailsApiUrl(courseId)}`
  );
  return camelCaseObject(data);
}

/**
 * Update course details.
 * @param {string} courseId
 * @param {object} details
 * @returns {Promise<Object>}
 */
export async function updateCourseDetails(courseId, details) {
  const { data } = await getAuthenticatedHttpClient().put(
    `${getCourseDetailsApiUrl(courseId)}`,
    convertObjectToSnakeCase(details, true)
  );
  return camelCaseObject(data);
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
