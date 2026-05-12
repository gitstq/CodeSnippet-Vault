import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Code2,
  Plus,
  Search,
  TrendingUp,
  Clock,
  Tag,
  Languages,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { snippetApi } from '../utils/api'
import type { Snippet, Stats } from '../types'
import CodePreview from '../components/CodePreview'

export default function HomePage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentSnippets, setRecentSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [statsData, snippetsData] = await Promise.all([
        snippetApi.getStats(),
        snippetApi.getSnippets({ page_size: 6, sort_by: 'created_at', order: 'desc' })
      ])
      setStats(statsData)
      setRecentSnippets(snippetsData)
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      icon: Plus,
      title: '新建片段',
      description: '快速添加新的代码片段',
      href: '/snippets/new',
      color: 'bg-green-500/20 text-green-400'
    },
    {
      icon: Search,
      title: '搜索片段',
      description: '查找已保存的代码片段',
      href: '/snippets',
      color: 'bg-blue-500/20 text-blue-400'
    },
    {
      icon: TrendingUp,
      title: '查看统计',
      description: '了解代码库使用情况',
      href: '/stats',
      color: 'bg-purple-500/20 text-purple-400'
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 欢迎区域 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600/20 via-primary-800/10 to-dark-900 border border-primary-500/20 p-8">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary-400" />
            <span className="text-primary-400 font-medium">欢迎使用 SnippetVault</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            智能管理你的代码片段
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mb-6">
            SnippetVault 是一个现代化的代码片段管理工具，帮助开发者高效地保存、组织和复用代码。
            支持智能标签、全文搜索、语法高亮等功能。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/snippets/new"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              创建第一个片段
            </Link>
            <Link
              to="/snippets"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Code2 className="w-5 h-5" />
              浏览片段
            </Link>
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="card p-6 hover:border-primary-500/30 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{action.title}</h3>
              <p className="text-gray-400 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 统计信息 */}
      {stats && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">代码库概览</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stats.total_snippets}</p>
              <p className="text-gray-400 text-sm">代码片段</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Languages className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stats.languages.length}</p>
              <p className="text-gray-400 text-sm">编程语言</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stats.top_tags.length}</p>
              <p className="text-gray-400 text-sm">标签数量</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{recentSnippets.length}</p>
              <p className="text-gray-400 text-sm">最近添加</p>
            </div>
          </div>
        </div>
      )}

      {/* 最近添加 */}
      {recentSnippets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">最近添加</h2>
            <Link
              to="/snippets"
              className="text-primary-400 hover:text-primary-300 inline-flex items-center gap-1 text-sm"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentSnippets.map((snippet) => (
              <Link
                key={snippet.id}
                to={`/snippets/${snippet.id}`}
                className="card overflow-hidden hover:border-primary-500/30 transition-all group"
              >
                <div className="p-4 border-b border-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {snippet.title}
                      </h3>
                      {snippet.description && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                          {snippet.description}
                        </p>
                      )}
                    </div>
                    <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300 font-mono">
                      {snippet.language}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-dark-950/50">
                  <CodePreview code={snippet.code} language={snippet.language} maxLines={4} />
                </div>
                {snippet.tags.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-700/50 flex flex-wrap gap-2">
                    {snippet.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="tag tag-dark text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {snippet.tags.length > 3 && (
                      <span className="text-gray-500 text-xs">
                        +{snippet.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 热门语言 */}
      {stats && stats.languages.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">语言分布</h2>
          <div className="card p-6">
            <div className="flex flex-wrap gap-3">
              {stats.languages.slice(0, 10).map((lang) => (
                <Link
                  key={lang.name}
                  to={`/snippets?language=${lang.name}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <span className="text-gray-300 font-medium">{lang.name}</span>
                  <span className="text-gray-500 text-sm">({lang.count})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
