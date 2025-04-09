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
 * Update course details.
 * @param {string} courseId
 * @param {object} details
 * @returns {Promise<Object>}
 */
export async function updateCourseDetails(courseId, details) {
  const url = getCourseDetailsApiUrl(courseId);
  // Extract metadata fields from the details
  const { formChoices, ...formData } = details;

  // Ensure required date fields are set
  const defaultDate = new Date();
  defaultDate.setHours(0, 0, 0, 0);

  const requiredDateFields = {
    start_date: formData.startDate || defaultDate.toISOString(),
    end_date: formData.endDate || null,
    enrollment_start: formData.enrollmentStart || defaultDate.toISOString(),
    enrollment_end: formData.enrollmentEnd || null
  };

  const payload = {
    form_data: {
      ...convertObjectToSnakeCase(formData, true),
      ...requiredDateFields
    },
    form_choices: formChoices || {}
  };

  console.log("Updating course details at:", url);
  console.log("Update payload:", payload);

  try {
    const response = await getAuthenticatedHttpClient().post(url, payload);
    console.log("Update response:", response);
    const { data } = response;
    console.log("Updated data:", data);
    return {
      ...camelCaseObject(data.formData || data),
      formChoices: data.formChoices || {}
    };
  } catch (error) {
    console.error("Error updating course details:", error);
    console.log("Error response:", error.response);
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
