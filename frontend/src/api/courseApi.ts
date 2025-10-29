// src/api/courseApi.ts
import api from "./index";

export const getCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

export const getCourseById = async (id: string) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (data: any) => {
  const response = await api.post("/courses", data);
  return response.data;
};
