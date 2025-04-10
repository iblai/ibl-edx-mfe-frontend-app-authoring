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
 * Process API response to ensure data is available at both root and form_data levels
 * @param {Object} data - API response data
 * @returns {Object} - Processed data
 */
const processApiResponse = (data) => {
  // Convert the form data to camel case
  const camelCaseFormData = camelCaseObject(data.formData || data);

  // Return data with fields at both root and form_data levels
  return {
    ...camelCaseFormData, // Spread form data at root level
    formData: camelCaseFormData, // Keep original form_data
    formChoices: data.formChoices || {}
  };
};

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
    return processApiResponse(data);
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

  // Extract metadata fields and form choices from the details
  const { formChoices, ...formData } = details;

  // Ensure we preserve all required fields
  const requiredFields = [
    'start_date',
    'end_date',
    'enrollment_start',
    'enrollment_end',
    'certificate_available_date',
    'certificates_display_behavior',
    'self_paced',
  ];

  // Convert form data to snake case and ensure required fields exist
  const snakeCaseData = convertObjectToSnakeCase(formData, true);

  // Ensure all required fields are present, even if null
  requiredFields.forEach(field => {
    if (!(field in snakeCaseData)) {
      snakeCaseData[field] = null;
    }
  });

  // Create payload with data at both root and form_data levels
  const payload = {
    ...snakeCaseData, // Add all form data at root level
    form_data: snakeCaseData, // Keep form_data as is
    form_choices: formChoices || {}
  };

  console.log("Updating course details at:", url);
  console.log("Update payload:", payload);

  try {
    const response = await getAuthenticatedHttpClient().post(url, payload);
    console.log("Update response:", response);
    const { data } = response;
    return processApiResponse(data);
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
    return processApiResponse(data);
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
