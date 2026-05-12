import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Code2,
  Edit2,
  Trash2,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Tag,
  Clock,
  Calendar,
  FileText,
  Link as LinkIcon
} from 'lucide-react'
import { snippetApi } from '../utils/api'
import type { Snippet } from '../types'
import { SUPPORTED_LANGUAGES } from '../types'
import CodePreview from '../components/CodePreview'

export default function SnippetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [snippet, setSnippet] = useState<Snippet | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

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
    } catch (error) {
      console.error('加载代码片段失败:', error)
      alert('加载失败')
      navigate('/snippets')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!snippet) return
    if (!confirm('确定要删除这个代码片段吗？此操作不可撤销。')) return

    try {
      await snippetApi.deleteSnippet(snippet.id)
      navigate('/snippets')
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  const handleCopy = async () => {
    if (!snippet) return
    
    try {
      await navigator.clipboard.writeText(snippet.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
      alert('复制失败')
    }
  }

  const getLanguageLabel = (value: string) => {
    return SUPPORTED_LANGUAGES.find(l => l.value === value)?.label || value
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  if (!snippet) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">代码片段不存在</p>
        <Link to="/snippets" className="text-primary-400 hover:underline mt-4 inline-block">
          返回列表
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link
          to="/snippets"
          className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Link>
      </div>

      {/* 标题区域 */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-white">{snippet.title}</h1>
              <span className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-sm font-mono">
                {getLanguageLabel(snippet.language)}
              </span>
            </div>
            
            {snippet.description && (
              <p className="text-gray-300 mb-4">{snippet.description}</p>
            )}

            {/* 标签 */}
            {snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {snippet.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/snippets?tag=${tag}`}
                    className="tag tag-dark"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                创建于 {formatDate(snippet.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                更新于 {formatDate(snippet.updated_at)}
              </span>
              {snippet.source && (
                <a
                  href={snippet.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-400 hover:text-primary-300"
                >
                  <LinkIcon className="w-4 h-4" />
                  来源
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`btn-secondary ${copied ? 'bg-green-600/20 text-green-400' : ''}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制代码
                </>
              )}
            </button>
            <Link
              to={`/snippets/${snippet.id}/edit`}
              className="btn-primary"
            >
              <Edit2 className="w-4 h-4" />
              编辑
            </Link>
            <button
              onClick={handleDelete}
              className="btn-danger"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </div>
        </div>
      </div>

      {/* 代码展示 */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-mono">{snippet.language}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {snippet.code.split('\n').length} 行
            </span>
            <span className="text-xs text-gray-500">
              {snippet.code.length} 字符
            </span>
          </div>
        </div>
        <div className="p-0">
          <CodePreview
            code={snippet.code}
            language={snippet.language}
            showLineNumbers
          />
        </div>
      </div>

      {/* 底部信息 */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span>ID: {snippet.id}</span>
          <span className="font-mono text-xs">Hash: {snippet.hash.slice(0, 16)}...</span>
        </div>
      </div>
    </div>
  )
}
