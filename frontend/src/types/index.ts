export interface Snippet {
  id: number;
  title: string;
  code: string;
  language: string;
  description?: string;
  tags: string[];
  source?: string;
  created_at: string;
  updated_at: string;
  hash: string;
}

export interface SnippetCreate {
  title: string;
  code: string;
  language: string;
  description?: string;
  tags: string[];
  source?: string;
}

export interface SnippetUpdate {
  title?: string;
  code?: string;
  language?: string;
  description?: string;
  tags?: string[];
  source?: string;
}

export interface Stats {
  total_snippets: number;
  languages: { name: string; count: number }[];
  top_tags: { name: string; count: number }[];
}

export interface SearchFilters {
  keyword?: string;
  language?: string;
  tags?: string[];
}

export const SUPPORTED_LANGUAGES = [
  { value: 'text', label: '纯文本', color: '#9ca3af' },
  { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
  { value: 'typescript', label: 'TypeScript', color: '#3178c6' },
  { value: 'python', label: 'Python', color: '#3776ab' },
  { value: 'java', label: 'Java', color: '#b07219' },
  { value: 'go', label: 'Go', color: '#00add8' },
  { value: 'rust', label: 'Rust', color: '#dea584' },
  { value: 'cpp', label: 'C++', color: '#f34b7d' },
  { value: 'c', label: 'C', color: '#555555' },
  { value: 'csharp', label: 'C#', color: '#178600' },
  { value: 'php', label: 'PHP', color: '#4f5d95' },
  { value: 'ruby', label: 'Ruby', color: '#701516' },
  { value: 'swift', label: 'Swift', color: '#ffac45' },
  { value: 'kotlin', label: 'Kotlin', color: '#a97bff' },
  { value: 'sql', label: 'SQL', color: '#e38c00' },
  { value: 'html', label: 'HTML', color: '#e34c26' },
  { value: 'css', label: 'CSS', color: '#563d7c' },
  { value: 'scss', label: 'SCSS', color: '#c6538c' },
  { value: 'json', label: 'JSON', color: '#292929' },
  { value: 'yaml', label: 'YAML', color: '#cb171e' },
  { value: 'markdown', label: 'Markdown', color: '#083fa1' },
  { value: 'bash', label: 'Bash', color: '#89e051' },
  { value: 'powershell', label: 'PowerShell', color: '#012456' },
  { value: 'dockerfile', label: 'Dockerfile', color: '#384d54' },
  { value: 'vue', label: 'Vue', color: '#41b883' },
  { value: 'react', label: 'React JSX', color: '#61dafb' },
] as const;

export type Language = typeof SUPPORTED_LANGUAGES[number]['value'];
