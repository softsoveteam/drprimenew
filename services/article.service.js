import axiosInstance from '../lib/axios';

/**
 * Get paginated articles
 * @param {Object} params - { page, per_page, search, status }
 */
export const getArticles = async (params) => {
  const response = await axiosInstance.get('/admin/articles', { params });
  return response.data;
};

/**
 * Get a single article by ID
 * @param {string|number} id - Article ID
 */
export const getArticle = async (id) => {
  const response = await axiosInstance.get(`/admin/articles/${id}`);
  return response.data;
};

/**
 * Create a new article
 * @param {Object} data - Article data
 */
export const createArticle = async (data) => {
  const response = await axiosInstance.post('/admin/articles', data);
  return response.data;
};

/**
 * Update an existing article
 * @param {string|number} id - Article ID
 * @param {Object} data - Updated article data
 */
export const updateArticle = async (id, data) => {
  const response = await axiosInstance.post(`/admin/articles/${id}`, data);
  return response.data;
};

/**
 * Delete an article
 * @param {string|number} id - Article ID
 */
export const deleteArticle = async (id) => {
  const response = await axiosInstance.delete(`/admin/articles/${id}`);
  return response.data;
};
