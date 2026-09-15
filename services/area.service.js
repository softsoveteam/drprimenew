import axiosInstance from '../lib/axios';

/**
 * Get paginated parent areas with nested children
 * @param {Object} params - { page, per_page, search }
 */
export const getAreas = async (params) => {
  const response = await axiosInstance.get('/admin/areas', { params });
  return response.data;
};

/**
 * Get a single area by ID
 * @param {string|number} id - Area ID
 */
export const getArea = async (id) => {
  const response = await axiosInstance.get(`/admin/areas/${id}`);
  return response.data;
};

/**
 * Create a new area or subarea
 * @param {Object} data - { name, parent_id? }
 */
export const createArea = async (data) => {
  const response = await axiosInstance.post('/admin/areas', data);
  return response.data;
};

/**
 * Update an existing area
 * @param {string|number} id - Area ID
 * @param {Object} data - { name, parent_id? }
 */
export const updateArea = async (id, data) => {
  const response = await axiosInstance.post(`/admin/areas/${id}`, data);
  return response.data;
};

/**
 * Delete an area
 * @param {string|number} id - Area ID
 */
export const deleteArea = async (id) => {
  const response = await axiosInstance.delete(`/admin/areas/${id}`);
  return response.data;
};
