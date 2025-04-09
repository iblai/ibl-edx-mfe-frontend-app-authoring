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
    console.log("=== Course Details Response ===");
    console.log("URL:", url);
    console.log("Response:", JSON.stringify(response.data, null, 2));
    console.log("=============================");

    // Get the form data and choices from response
    const formData = response.data.form_data || {};
    const formChoices = response.data.form_choices || {
      level: [
        { value: "", label: "---" },
        { value: "General Interest", label: "General Interest" },
        { value: "Business/Executive", label: "Business/Executive" },
        { value: "Technical - Beginner", label: "Technical - Beginner" },
        { value: "Technical - Intermediate", label: "Technical - Intermediate" },
        { value: "Technical - Advanced", label: "Technical - Advanced" }
      ]
    };

    console.log("=== Processed Form Data ===");
    console.log("Form Data:", JSON.stringify(formData, null, 2));
    console.log("Form Choices:", JSON.stringify(formChoices, null, 2));
    console.log("Level Value:", formData.level);
    console.log("===========================");

    return { formData, formChoices };
  } catch (error) {
    console.error("=== Course Details Error ===");
    console.error("Error:", error);
    console.error("Error Response:", error.response?.data);
    console.error("=========================");
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

  // Extract the actual form data and choices
  const { formData, formChoices, ...otherFields } = details;

  // Create the payload with all necessary fields
  const payload = {
    ...formData,
    ...otherFields, // Include any additional fields like level, subject, etc.
    course_key: courseId,
    level: otherFields.level || formData.level // Ensure level is included
  };

  console.log("=== Course Update Request Details (POST) ===");
  console.log("URL:", url);
  console.log("Course ID:", courseId);
  console.log("Input details:", JSON.stringify(details, null, 2));
  console.log("Form Data:", JSON.stringify(formData, null, 2));
  console.log("Other Fields:", JSON.stringify(otherFields, null, 2));
  console.log("Level Value:", payload.level);
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
      formData: response.data || { ...formData, ...otherFields },
      formChoices
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
