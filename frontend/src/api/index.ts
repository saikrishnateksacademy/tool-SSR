import axios from 'axios';

/* ------------------------------------------------------------
   1️⃣ API Setup
------------------------------------------------------------ */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ------------------------------------------------------------
   2️⃣ Interceptors
------------------------------------------------------------ */
// 🔒 Request Interceptor (Attach Auth Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Response Interceptor (Handle Expired Session)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* ------------------------------------------------------------
   3️⃣ Type Definitions
------------------------------------------------------------ */
export interface Course {
  _id?: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published';
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Page {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  courses: {
    total: number;
    published: number;
    draft: number;
  };
  pages: {
    total: number;
    published: number;
  };
  recentCourses: Array<{
    programTitle: string;
    category: string;
    createdAt: string;
    meta: { status: string };
  }>;
  recentPages: Array<{
    title: string;
    type: string;
    createdAt: string;
    status: string;
  }>;
}

/* ------------------------------------------------------------
   4️⃣ API Definitions (Fully Typed)
------------------------------------------------------------ */

// 🧠 Course API
export const courseAPI = {
  getAll: () => api.get<Course[]>('/courses'),
  getById: (id: string) => api.get<Course>(`/courses/${id}`),
  create: (data: any) => api.post<Course>('/courses', data),
  update: (id: string, data: any) => api.put<Course>(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),

  // ✨ Bulk Operations
  bulkUpdate: (ids: string[], updates: Partial<Course>) =>
    api.post('/courses/bulk/update', { ids, updates }),

  bulkDelete: (ids: string[]) =>
    api.post('/courses/bulk/delete', { ids }),

  bulkUpdateStatus: (ids: string[], status: 'draft' | 'published') =>
    api.post('/courses/bulk/status', { ids, status }),
};

// 📰 Page API
export const pageAPI = {
  getAll: () => api.get<Page[]>('/pages'),
  getBySlug: (slug: string) => api.get<Page>(`/pages/${slug}`),
  create: (data: Page) => api.post<Page>('/pages', data),
  update: (id: string, data: Page) => api.put<Page>(`/pages/${id}`, data),
  delete: (id: string) => api.delete(`/pages/${id}`),
};

// 📊 Stats API
export const statsAPI = {
  getDashboard: () => api.get<DashboardStats>('/stats'),
};

/* ------------------------------------------------------------
   5️⃣ Export Default
------------------------------------------------------------ */
export default api;
