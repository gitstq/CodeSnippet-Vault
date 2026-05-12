import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  Plus,
  Filter,
  Code2,
  Tag,
  Trash2,
  Edit2,
  X,
  ChevronLeft,
  ChevronRight,
  FileJson,
  Download,
  Upload
} from 'lucide-react'
import { snippetApi } from '../utils/api'
import type { Snippet } from '../types'
import { SUPPORTED_LANGUAGES } from '../types'
import CodePreview from '../components/CodePreview'

export default function SnippetsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // 筛选状态
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '')
  const [selectedTag, setSelectedTag] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    loadFilters()
    loadSnippets()
  }, [selectedLanguage, selectedTag, currentPage])

  const loadFilters = async () => {
    try {
      const [langs, allTags] = await Promise.all([
        snippetApi.getLanguages(),
        snippetApi.getTags()
      ])
      setLanguages(langs)
      setTags(allTags)
    } catch (error) {
      console.error('加载筛选条件失败:', error)
    }
  }

  const loadSnippets = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: currentPage,
        page_size: pageSize,
        sort_by: 'created_at',
        order: 'desc'
      }
      
      if (selectedLanguage) {
        params.language = selectedLanguage
      }
      
      if (selectedTag) {
        params.tag = selectedTag
      }
      
      const data = await snippetApi.getSnippets(params)
      setSnippets(data)
    } catch (error) {
      console.error('加载代码片段失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadSnippets()
      return
    }
    
    try {
      setLoading(true)
      const data = await snippetApi.searchSnippets({
        q: searchQuery,
        language: selectedLanguage || undefined
      })
      setSnippets(data)
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个代码片段吗？')) return
    
    try {
      await snippetApi.deleteSnippet(id)
      loadSnippets()
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  const handleExport = async () => {
    try {
      const data = await snippetApi.exportSnippets()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `snippetvault-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败')
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      if (!data.snippets || !Array.isArray(data.snippets)) {
        alert('无效的文件格式')
        return
      }

      const result = await snippetApi.importSnippets(data.snippets)
      alert(`导入成功: ${result.imported} 个片段, 跳过 ${result.skipped} 个重复片段`)
      loadSnippets()
    } catch (error) {
      console.error('导入失败:', error)
      alert('导入失败')
    }
    
    // 重置文件输入
    e.target.value = ''
  }

  const clearFilters = () => {
    setSelectedLanguage('')
    setSelectedTag('')
    setSearchQuery('')
    setSearchParams({})
    loadSnippets()
  }

  const getLanguageLabel = (value: string) => {
    return SUPPORTED_LANGUAGES.find(l => l.value === value)?.label || value
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Code2 className="w-7 h-7 text-primary-400" />
            代码片段
          </h1>
          <p className="text-gray-400 mt-1">管理和搜索你保存的代码片段</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="btn-secondary cursor-pointer">
            <Upload className="w-4 h-4" />
            导入
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button onClick={handleExport} className="btn-secondary">
            <Download className="w-4 h-4" />
            导出
          </button>
          <Link to="/snippets/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            新建片段
          </Link>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="card p-4 space-y-4">
        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="搜索代码片段标题、内容或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
            />
          </div>
          <button type="submit" className="btn-primary">
            搜索
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary ${showFilters ? 'bg-gray-600' : ''}`}
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>
        </form>

        {/* 筛选条件 */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">语言:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="select w-40"
              >
                <option value="">全部语言</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {getLanguageLabel(lang)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">标签:</span>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="select w-40"
              >
                <option value="">全部标签</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {(selectedLanguage || selectedTag || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                清除筛选
              </button>
            )}
          </div>
        )}

        {/* 活跃筛选标签 */}
        {(selectedLanguage || selectedTag) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-400 text-sm">已选筛选:</span>
            {selectedLanguage && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-sm">
                语言: {getLanguageLabel(selectedLanguage)}
                <button onClick={() => setSelectedLanguage('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                标签: {selectedTag}
                <button onClick={() => setSelectedTag('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 代码片段列表 */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </div>
      ) : snippets.length === 0 ? (
        <div className="card p-12 text-center">
          <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">暂无代码片段</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery || selectedLanguage || selectedTag
              ? '没有找到匹配的代码片段，试试其他搜索条件'
              : '开始添加你的第一个代码片段吧'}
          </p>
          {!searchQuery && !selectedLanguage && !selectedTag && (
            <Link to="/snippets/new" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              创建片段
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {snippets.map((snippet) => (
              <div
                key={snippet.id}
                className="card overflow-hidden hover:border-primary-500/30 transition-all group"
              >
                <div className="p-4 border-b border-gray-700/50">
                  <div className="flex items-start justify-between">
                    <Link
                      to={`/snippets/${snippet.id}`}
                      className="flex-1 min-w-0"
                    >
                      <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                        {snippet.title}
                      </h3>
                      {snippet.description && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                          {snippet.description}
                        </p>
                      )}
                    </Link>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300 font-mono">
                        {snippet.language}
                      </span>
                    </div>
                  </div>
                </div>

                <Link to={`/snippets/${snippet.id}`}>
                  <div className="p-4 bg-dark-950/50">
                    <CodePreview code={snippet.code} language={snippet.language} maxLines={5} />
                  </div>
                </Link>

                <div className="px-4 py-3 border-t border-gray-700/50 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {snippet.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag tag-dark text-xs">
                        {tag}
                      </span>
                    ))}
                    {snippet.tags.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{snippet.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/snippets/${snippet.id}/edit`}
                      className="p-2 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(snippet.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              上一页
            </button>
            <span className="text-gray-400">
              第 {currentPage} 页
            </span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={snippets.length < pageSize}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
