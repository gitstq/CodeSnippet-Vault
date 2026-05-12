import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Save,
  Code2,
  Tag,
  FileText,
  Link,
  Sparkles,
  X,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import { snippetApi } from '../utils/api'
import type { Snippet } from '../types'
import { SUPPORTED_LANGUAGES } from '../types'
import CodeEditor from '../components/CodeEditor'

export default function EditSnippetPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    language: 'javascript',
    description: '',
    tags: [] as string[],
    source: ''
  })
  
  const [tagInput, setTagInput] = useState('')
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])

  useEffect(() => {
    if (id) {
      loadSnippet(parseInt(id))
    }
  }, [id])

  const loadSnippet = async (snippetId: number) => {
    try {
      setLoading(true)
      const data = await snippetApi.getSnippet(snippetId)
      setSnippet(data)
      setFormData({
        title: data.title,
        code: data.code,
        language: data.language,
        description: data.description || '',
        tags: data.tags,
        source: data.source || ''
      })
    } catch (error) {
      console.error('加载代码片段失败:', error)
      alert('加载失败')
      navigate('/snippets')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id) return
    
    if (!formData.title.trim() || !formData.code.trim()) {
      alert('请填写标题和代码内容')
      return
    }
    
    try {
      setSaving(true)
      await snippetApi.updateSnippet(parseInt(id), {
        title: formData.title.trim(),
        code: formData.code,
        language: formData.language,
        description: formData.description.trim() || undefined,
        tags: formData.tags,
        source: formData.source.trim() || undefined
      })
      navigate(`/snippets/${id}`)
    } catch (error: any) {
      console.error('更新失败:', error)
      alert(error.message || '更新失败')
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSuggestTags = async () => {
    if (!formData.code.trim()) {
      alert('请先输入代码内容')
      return
    }
    
    try {
      setSuggesting(true)
      const result = await snippetApi.suggestTags(formData.code, formData.language)
      const newTags = result.suggested_tags.filter(
        tag => !formData.tags.includes(tag)
      )
      setSuggestedTags(newTags)
    } catch (error) {
      console.error('获取标签建议失败:', error)
    } finally {
      setSuggesting(false)
    }
  }

  const handleApplySuggestedTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
    setSuggestedTags(prev => prev.filter(t => t !== tag))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* 页面标题 */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/snippets/${id}`)}
          className="text-gray-400 hover:text-white flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          返回详情
        </button>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Save className="w-7 h-7 text-primary-400" />
          编辑代码片段
        </h1>
        <p className="text-gray-400 mt-1">修改代码片段的信息</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 标题 */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            标题 *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="给你的代码片段起个名字..."
            className="input"
            required
          />
        </div>

        {/* 代码编辑器 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-300">
              <Code2 className="w-4 h-4 inline mr-2" />
              代码 *
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              className="select w-40"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <CodeEditor
            code={formData.code}
            language={formData.language}
            onChange={(code) => setFormData(prev => ({ ...prev, code }))}
            placeholder="在此粘贴或输入你的代码..."
          />
        </div>

        {/* 描述 */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <FileText className="w-4 h-4 inline mr-2" />
            描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="简要描述这个代码片段的用途..."
            rows={3}
            className="textarea"
          />
        </div>

        {/* 标签 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-300">
              <Tag className="w-4 h-4 inline mr-2" />
              标签
            </label>
            <button
              type="button"
              onClick={handleSuggestTags}
              disabled={suggesting || !formData.code.trim()}
              className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 disabled:opacity-50"
            >
              {suggesting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              智能推荐
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
              placeholder="输入标签后按回车添加..."
              className="input flex-1"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn-secondary"
            >
              添加
            </button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-primary-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {suggestedTags.length > 0 && (
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-sm text-gray-400 mb-2">推荐标签:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleApplySuggestedTag(tag)}
                    className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm hover:bg-primary-600/20 hover:text-primary-400 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 来源 */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Link className="w-4 h-4 inline mr-2" />
            来源链接
          </label>
          <input
            type="url"
            value={formData.source}
            onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
            placeholder="https://... (可选)"
            className="input"
          />
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(`/snippets/${id}`)}
            className="btn-secondary"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                保存修改
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
