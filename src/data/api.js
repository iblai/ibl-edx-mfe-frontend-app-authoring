import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

const getStudioBaseUrl = () => getConfig().STUDIO_BASE_URL;

export const getApiWaffleFlagsUrl = (courseId) => {
  const baseUrl = getStudioBaseUrl();
  const apiPath = '/api/contentstore/v1/course_waffle_flags';
  const url = courseId ? `${baseUrl}${apiPath}/${courseId}` : `${baseUrl}${apiPath}`;
  console.log('Waffle flags URL:', url);
  return url;
};

function normalizeCourseDetail(data) {
  console.log('Normalizing course detail data:', data);
  const normalized = {
    id: data.course_id,
    ...camelCaseObject(data),
  };
  console.log('Normalized course detail:', normalized);
  return normalized;
}

export async function getCourseDetail(courseId, username) {
  const url = `${getConfig().LMS_BASE_URL}/api/courses/v1/courses/${courseId}?username=${username}`;
  console.log('Getting course detail from:', url);

  try {
    const response = await getAuthenticatedHttpClient().get(url);
    console.log('Course detail response:', response);
    const { data } = response;
    return normalizeCourseDetail(data);
  } catch (error) {
    console.error('Error getting course detail:', error);
    console.log('Error response:', error.response);
    throw error;
  }
}

export async function getWaffleFlags(courseId) {
  const url = getApiWaffleFlagsUrl(courseId);
  console.log('Getting waffle flags from:', url);

  try {
    const response = await getAuthenticatedHttpClient().get(url);
    console.log('Waffle flags response:', response);
    const { data } = response;
    return normalizeCourseDetail(data);
  } catch (error) {
    console.error('Error getting waffle flags:', error);
    console.log('Error response:', error.response);
    // Instead of failing completely, return a default empty state
    return {
      id: courseId,
      courseId,
      waffleFlags: {},
    };
  }
}
