import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Code2,
  Tag,
  Languages,
  TrendingUp,
  PieChart,
  Activity
} from 'lucide-react'
import { snippetApi } from '../utils/api'
import type { Stats } from '../types'

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await snippetApi.getStats()
      setStats(data)
    } catch (error) {
      console.error('加载统计信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">加载统计信息失败</p>
      </div>
    )
  }

  // 计算百分比
  const getPercentage = (count: number) => {
    if (stats.total_snippets === 0) return 0
    return Math.round((count / stats.total_snippets) * 100)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-primary-400" />
          统计信息
        </h1>
        <p className="text-gray-400 mt-1">了解你的代码库使用情况</p>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">代码片段总数</p>
              <p className="text-4xl font-bold text-white">{stats.total_snippets}</p>
            </div>
            <div className="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center">
              <Code2 className="w-7 h-7 text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">编程语言</p>
              <p className="text-4xl font-bold text-white">{stats.languages.length}</p>
            </div>
            <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Languages className="w-7 h-7 text-green-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">标签数量</p>
              <p className="text-4xl font-bold text-white">{stats.top_tags.length}</p>
            </div>
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Tag className="w-7 h-7 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 语言分布 */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">语言分布</h2>
              <p className="text-gray-400 text-sm">各编程语言的代码片段数量</p>
            </div>
          </div>

          {stats.languages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无数据
            </div>
          ) : (
            <div className="space-y-4">
              {stats.languages.slice(0, 10).map((lang) => {
                const percentage = getPercentage(lang.count)
                return (
                  <div key={lang.name}>
                    <div className="flex items-center justify-between mb-1">
                      <Link
                        to={`/snippets?language=${lang.name}`}
                        className="text-gray-300 hover:text-primary-400 transition-colors"
                      >
                        {lang.name}
                      </Link>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm">{lang.count} 个片段</span>
                        <span className="text-gray-500 text-sm w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 热门标签 */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">热门标签</h2>
              <p className="text-gray-400 text-sm">使用频率最高的标签</p>
            </div>
          </div>

          {stats.top_tags.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无数据
            </div>
          ) : (
            <div className="space-y-4">
              {stats.top_tags.slice(0, 10).map((tag) => {
                const percentage = getPercentage(tag.count)
                return (
                  <div key={tag.name}>
                    <div className="flex items-center justify-between mb-1">
                      <Link
                        to={`/snippets?tag=${tag.name}`}
                        className="text-gray-300 hover:text-purple-400 transition-colors"
                      >
                        #{tag.name}
                      </Link>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm">{tag.count} 个片段</span>
                        <span className="text-gray-500 text-sm w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* 所有标签云 */}
      {stats.top_tags.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">标签云</h2>
              <p className="text-gray-400 text-sm">点击标签查看相关片段</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {stats.top_tags.map((tag) => (
              <Link
                key={tag.name}
                to={`/snippets?tag=${tag.name}`}
                className="px-4 py-2 bg-gray-800/50 hover:bg-primary-600/20 text-gray-300 hover:text-primary-400 rounded-lg transition-all"
                style={{
                  fontSize: `${0.875 + (tag.count / (stats.top_tags[0]?.count || 1)) * 0.5}rem`
                }}
              >
                {tag.name}
                <span className="ml-2 text-gray-500 text-sm">({tag.count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 使用提示 */}
      <div className="card p-6 bg-gradient-to-br from-primary-600/10 to-transparent border-primary-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">使用建议</h3>
            <ul className="text-gray-400 space-y-2">
              <li>• 为代码片段添加准确的标签，方便后续搜索和分类</li>
              <li>• 使用描述字段记录代码的用途和注意事项</li>
              <li>• 定期整理和更新代码片段，保持代码库的整洁</li>
              <li>• 利用来源字段记录代码的出处，方便追溯</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
