import axios from 'axios';
import type { Snippet, SnippetCreate, SnippetUpdate, Stats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || error.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);

export const snippetApi = {
  // 获取统计信息
  getStats: (): Promise<Stats> => api.get('/stats'),

  // 获取所有代码片段
  getSnippets: (params?: {
    page?: number;
    page_size?: number;
    language?: string;
    tag?: string;
    sort_by?: string;
    order?: string;
  }): Promise<Snippet[]> => api.get('/snippets', { params }),

  // 搜索代码片段
  searchSnippets: (params: {
    q: string;
    language?: string;
    page?: number;
    page_size?: number;
  }): Promise<Snippet[]> => api.get('/snippets/search', { params }),

  // 获取单个代码片段
  getSnippet: (id: number): Promise<Snippet> => api.get(`/snippets/${id}`),

  // 创建代码片段
  createSnippet: (data: SnippetCreate): Promise<Snippet> => api.post('/snippets', data),

  // 更新代码片段
  updateSnippet: (id: number, data: SnippetUpdate): Promise<Snippet> => 
    api.put(`/snippets/${id}`, data),

  // 删除代码片段
  deleteSnippet: (id: number): Promise<{ message: string; id: number }> => 
    api.delete(`/snippets/${id}`),

  // 获取所有语言
  getLanguages: (): Promise<string[]> => api.get('/languages'),

  // 获取所有标签
  getTags: (): Promise<string[]> => api.get('/tags'),

  // 智能标签建议
  suggestTags: (code: string, language: string): Promise<{ suggested_tags: string[] }> => 
    api.post('/suggest-tags', null, { params: { code, language } }),

  // 导入代码片段
  importSnippets: (snippets: SnippetCreate[]): Promise<{ imported: number; skipped: number }> => 
    api.post('/import', snippets),

  // 导出代码片段
  exportSnippets: (): Promise<{ export_date: string; total: number; snippets: Snippet[] }> => 
    api.get('/export'),
};

export default api;
