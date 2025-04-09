import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { convertObjectToSnakeCase } from '../../utils';

const getApiBaseUrl = () => getConfig().STUDIO_BASE_URL;
// export const getCourseDetailsApiUrl = (courseId) =>
//   `${getApiBaseUrl()}/api/contentstore/v1/course_details/${courseId}`;
export const getCourseDetailsApiUrl = (courseId) =>
  `${getApiBaseUrl()}/api/ibl/catalog/metadata/course/settings?course_key=${encodeURIComponent(courseId)}`;
export const getCourseSettingsApiUrl = (courseId) =>
  `${getApiBaseUrl()}/api/ibl/catalog/metadata/course/settings?course_key=${encodeURIComponent(courseId)}`;
export const getUploadAssetsUrl = (courseId) =>
  `${getApiBaseUrl()}/assets/${courseId}/`;
const getMfeConfigUrl = `${getConfig().LMS_BASE_URL}/api/mfe_config/v1?mfe=authoring`;

/**
 * Get course details.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getCourseDetails(courseId) {
  const url = getCourseDetailsApiUrl(courseId);

  try {
    const response = await getAuthenticatedHttpClient().get(url);
    console.log('Course details response:', response);
    const { data } = response;
    // Return formData and formChoices in camelCase format
    return {
      formData: data.form_data || data,
      formChoices: data.form_choices || {}
    };
  } catch (error) {
    console.log("Error response:", error.response);
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
  // Extract form_data and form_choices from details
  const { formData, formChoices } = details;

  // Create the payload with form_data content at root level
  const payload = {
    ...formData.formData, // Extract the inner formData
    course_key: courseId,
    form_choices: formChoices
  };

  console.log("=== Course Update Request Details (POST) ===");
  console.log("URL:", url);
  console.log("Course ID:", courseId);
  console.log("Input details:", JSON.stringify(details, null, 2));
  console.log("Form Data:", JSON.stringify(formData, null, 2));
  console.log("Form Choices:", JSON.stringify(formChoices, null, 2));
  console.log("Final Payload:", JSON.stringify(payload, null, 2));
  console.log("===================================");

  try {
    const response = await getAuthenticatedHttpClient().post(url, payload);
    console.log("=== Course Update Response ===");
    console.log("Response:", JSON.stringify(response.data, null, 2));
    console.log("=============================");

    // Return in the same format as GET response
    return {
      formData: response.data,
      formChoices: formChoices
    };
  } catch (error) {
    console.error("=== Course Update Error ===");
    console.error("Error:", error);
    console.error("Error Response:", error.response?.data);
    console.error("=========================");
    throw error;
  }
}

/**
 * Get course settings.
 * @param {string} courseId
 * @returns {Promise<Object>}
 */
export async function getCourseSettings(courseId) {
  const url = getCourseSettingsApiUrl(courseId);
  try {
    const { data } = await getAuthenticatedHttpClient().get(url);
    console.log('Course settings response:', data);
    // Return both formData and formChoices for metadata fields
    return {
      ...camelCaseObject(data.formData || data),
      formChoices: data.formChoices || {}
    };
  } catch (error) {
    console.log("Error response:", error.response);
    throw error;
  }
}

/**
 * Get MFE Config Object
 * @returns {Promise<Object>}
 */
export async function getMfeConfig() {
  try {
    const response = await getAuthenticatedHttpClient().get(`${getMfeConfigUrl}`);
    console.log('MFE config response:', response);
    const { data } = response;
    return data;
  } catch (error) {
    console.error('Error fetching MFE config:', error);
    throw error;
  }
}
