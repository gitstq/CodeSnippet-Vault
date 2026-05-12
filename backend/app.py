"""
SnippetVault - 智能代码片段管理工具后端API
基于FastAPI构建，提供RESTful API接口
"""

from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import sqlite3
import json
import os
import hashlib
import re
from pathlib import Path

# 初始化FastAPI应用
app = FastAPI(
    title="SnippetVault API",
    description="智能代码片段管理工具API",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库配置
DB_PATH = Path(__file__).parent / "data" / "snippets.db"
DB_PATH.parent.mkdir(exist_ok=True)

# 数据模型
class SnippetCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="片段标题")
    code: str = Field(..., min_length=1, description="代码内容")
    language: str = Field(default="text", description="编程语言")
    description: Optional[str] = Field(default=None, description="描述说明")
    tags: List[str] = Field(default=[], description="标签列表")
    source: Optional[str] = Field(default=None, description="来源")

class SnippetUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    code: Optional[str] = Field(default=None, min_length=1)
    language: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    tags: Optional[List[str]] = Field(default=None)
    source: Optional[str] = Field(default=None)

class SnippetResponse(BaseModel):
    id: int
    title: str
    code: str
    language: str
    description: Optional[str]
    tags: List[str]
    source: Optional[str]
    created_at: str
    updated_at: str
    hash: str

class SearchQuery(BaseModel):
    keyword: Optional[str] = Field(default=None, description="搜索关键词")
    language: Optional[str] = Field(default=None, description="编程语言筛选")
    tags: Optional[List[str]] = Field(default=None, description="标签筛选")

# 数据库初始化
def init_db():
    """初始化数据库表结构"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS snippets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            code TEXT NOT NULL,
            language TEXT DEFAULT 'text',
            description TEXT,
            tags TEXT DEFAULT '[]',
            source TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            hash TEXT UNIQUE
        )
    """)
    
    # 创建索引
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_language ON snippets(language)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_created_at ON snippets(created_at)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hash ON snippets(hash)")
    
    conn.commit()
    conn.close()

def get_db():
    """获取数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def generate_hash(code: str) -> str:
    """生成代码片段的哈希值"""
    return hashlib.md5(code.encode()).hexdigest()

def row_to_dict(row) -> dict:
    """将数据库行转换为字典"""
    return {
        "id": row["id"],
        "title": row["title"],
        "code": row["code"],
        "language": row["language"],
        "description": row["description"],
        "tags": json.loads(row["tags"]) if row["tags"] else [],
        "source": row["source"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
        "hash": row["hash"]
    }

# 启动时初始化数据库
@app.on_event("startup")
async def startup_event():
    init_db()

# API路由
@app.get("/")
async def root():
    """API根路径"""
    return {
        "name": "SnippetVault API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/stats")
async def get_stats(conn: sqlite3.Connection = Depends(get_db)):
    """获取统计信息"""
    cursor = conn.cursor()
    
    # 总片段数
    cursor.execute("SELECT COUNT(*) FROM snippets")
    total_snippets = cursor.fetchone()[0]
    
    # 语言分布
    cursor.execute("SELECT language, COUNT(*) as count FROM snippets GROUP BY language ORDER BY count DESC")
    languages = [{"name": row[0], "count": row[1]} for row in cursor.fetchall()]
    
    # 标签统计
    cursor.execute("SELECT tags FROM snippets")
    all_tags = []
    for row in cursor.fetchall():
        tags = json.loads(row[0]) if row[0] else []
        all_tags.extend(tags)
    
    tag_counts = {}
    for tag in all_tags:
        tag_counts[tag] = tag_counts.get(tag, 0) + 1
    top_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:20]
    
    return {
        "total_snippets": total_snippets,
        "languages": languages,
        "top_tags": [{"name": tag, "count": count} for tag, count in top_tags]
    }

@app.post("/snippets", response_model=SnippetResponse)
async def create_snippet(snippet: SnippetCreate, conn: sqlite3.Connection = Depends(get_db)):
    """创建新代码片段"""
    cursor = conn.cursor()
    
    # 生成哈希
    code_hash = generate_hash(snippet.code)
    
    # 检查是否已存在
    cursor.execute("SELECT id FROM snippets WHERE hash = ?", (code_hash,))
    if cursor.fetchone():
        raise HTTPException(status_code=409, detail="代码片段已存在")
    
    now = datetime.now().isoformat()
    tags_json = json.dumps(snippet.tags, ensure_ascii=False)
    
    cursor.execute("""
        INSERT INTO snippets (title, code, language, description, tags, source, created_at, updated_at, hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        snippet.title,
        snippet.code,
        snippet.language,
        snippet.description,
        tags_json,
        snippet.source,
        now,
        now,
        code_hash
    ))
    
    conn.commit()
    snippet_id = cursor.lastrowid
    
    cursor.execute("SELECT * FROM snippets WHERE id = ?", (snippet_id,))
    row = cursor.fetchone()
    return row_to_dict(row)

@app.get("/snippets", response_model=List[SnippetResponse])
async def list_snippets(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    language: Optional[str] = Query(None, description="编程语言筛选"),
    tag: Optional[str] = Query(None, description="标签筛选"),
    sort_by: str = Query("created_at", description="排序字段"),
    order: str = Query("desc", description="排序方向"),
    conn: sqlite3.Connection = Depends(get_db)
):
    """获取代码片段列表"""
    cursor = conn.cursor()
    
    # 构建查询
    where_clauses = []
    params = []
    
    if language:
        where_clauses.append("language = ?")
        params.append(language)
    
    if tag:
        where_clauses.append("tags LIKE ?")
        params.append(f'%"{tag}"%')
    
    where_sql = "WHERE " + " AND ".join(where_clauses) if where_clauses else ""
    
    # 排序
    valid_sort_fields = ["created_at", "updated_at", "title", "language"]
    if sort_by not in valid_sort_fields:
        sort_by = "created_at"
    order_sql = "DESC" if order.lower() == "desc" else "ASC"
    
    # 分页
    offset = (page - 1) * page_size
    
    cursor.execute(f"""
        SELECT * FROM snippets
        {where_sql}
        ORDER BY {sort_by} {order_sql}
        LIMIT ? OFFSET ?
    """, params + [page_size, offset])
    
    rows = cursor.fetchall()
    return [row_to_dict(row) for row in rows]

@app.get("/snippets/search", response_model=List[SnippetResponse])
async def search_snippets(
    q: str = Query(..., min_length=1, description="搜索关键词"),
    language: Optional[str] = Query(None, description="编程语言筛选"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    conn: sqlite3.Connection = Depends(get_db)
):
    """搜索代码片段"""
    cursor = conn.cursor()
    
    # 构建搜索条件
    where_clauses = [
        "(title LIKE ? OR code LIKE ? OR description LIKE ? OR tags LIKE ?)"
    ]
    search_pattern = f"%{q}%"
    params = [search_pattern, search_pattern, search_pattern, search_pattern]
    
    if language:
        where_clauses.append("language = ?")
        params.append(language)
    
    where_sql = "WHERE " + " AND ".join(where_clauses)
    offset = (page - 1) * page_size
    
    cursor.execute(f"""
        SELECT * FROM snippets
        {where_sql}
        ORDER BY 
            CASE WHEN title LIKE ? THEN 1 ELSE 2 END,
            created_at DESC
        LIMIT ? OFFSET ?
    """, params + [f"%{q}%", page_size, offset])
    
    rows = cursor.fetchall()
    return [row_to_dict(row) for row in rows]

@app.get("/snippets/{snippet_id}", response_model=SnippetResponse)
async def get_snippet(snippet_id: int, conn: sqlite3.Connection = Depends(get_db)):
    """获取单个代码片段"""
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM snippets WHERE id = ?", (snippet_id,))
    row = cursor.fetchone()
    
    if not row:
        raise HTTPException(status_code=404, detail="代码片段不存在")
    
    return row_to_dict(row)

@app.put("/snippets/{snippet_id}", response_model=SnippetResponse)
async def update_snippet(
    snippet_id: int,
    snippet_update: SnippetUpdate,
    conn: sqlite3.Connection = Depends(get_db)
):
    """更新代码片段"""
    cursor = conn.cursor()
    
    # 检查是否存在
    cursor.execute("SELECT * FROM snippets WHERE id = ?", (snippet_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="代码片段不存在")
    
    # 构建更新字段
    updates = []
    params = []
    
    if snippet_update.title is not None:
        updates.append("title = ?")
        params.append(snippet_update.title)
    
    if snippet_update.code is not None:
        updates.append("code = ?")
        params.append(snippet_update.code)
        updates.append("hash = ?")
        params.append(generate_hash(snippet_update.code))
    
    if snippet_update.language is not None:
        updates.append("language = ?")
        params.append(snippet_update.language)
    
    if snippet_update.description is not None:
        updates.append("description = ?")
        params.append(snippet_update.description)
    
    if snippet_update.tags is not None:
        updates.append("tags = ?")
        params.append(json.dumps(snippet_update.tags, ensure_ascii=False))
    
    if snippet_update.source is not None:
        updates.append("source = ?")
        params.append(snippet_update.source)
    
    if not updates:
        raise HTTPException(status_code=400, detail="没有要更新的字段")
    
    updates.append("updated_at = ?")
    params.append(datetime.now().isoformat())
    params.append(snippet_id)
    
    cursor.execute(f"""
        UPDATE snippets
        SET {', '.join(updates)}
        WHERE id = ?
    """, params)
    
    conn.commit()
    
    cursor.execute("SELECT * FROM snippets WHERE id = ?", (snippet_id,))
    row = cursor.fetchone()
    return row_to_dict(row)

@app.delete("/snippets/{snippet_id}")
async def delete_snippet(snippet_id: int, conn: sqlite3.Connection = Depends(get_db)):
    """删除代码片段"""
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM snippets WHERE id = ?", (snippet_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="代码片段不存在")
    
    cursor.execute("DELETE FROM snippets WHERE id = ?", (snippet_id,))
    conn.commit()
    
    return {"message": "代码片段已删除", "id": snippet_id}

@app.get("/languages")
async def get_languages(conn: sqlite3.Connection = Depends(get_db)):
    """获取所有编程语言列表"""
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT language FROM snippets ORDER BY language")
    languages = [row[0] for row in cursor.fetchall()]
    return languages

@app.get("/tags")
async def get_tags(conn: sqlite3.Connection = Depends(get_db)):
    """获取所有标签列表"""
    cursor = conn.cursor()
    cursor.execute("SELECT tags FROM snippets")
    
    all_tags = set()
    for row in cursor.fetchall():
        tags = json.loads(row[0]) if row[0] else []
        all_tags.update(tags)
    
    return sorted(list(all_tags))

@app.post("/import")
async def import_snippets(
    snippets: List[SnippetCreate],
    conn: sqlite3.Connection = Depends(get_db)
):
    """批量导入代码片段"""
    cursor = conn.cursor()
    imported = 0
    skipped = 0
    
    for snippet in snippets:
        code_hash = generate_hash(snippet.code)
        
        # 检查是否已存在
        cursor.execute("SELECT id FROM snippets WHERE hash = ?", (code_hash,))
        if cursor.fetchone():
            skipped += 1
            continue
        
        now = datetime.now().isoformat()
        tags_json = json.dumps(snippet.tags, ensure_ascii=False)
        
        cursor.execute("""
            INSERT INTO snippets (title, code, language, description, tags, source, created_at, updated_at, hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            snippet.title,
            snippet.code,
            snippet.language,
            snippet.description,
            tags_json,
            snippet.source,
            now,
            now,
            code_hash
        ))
        imported += 1
    
    conn.commit()
    return {"imported": imported, "skipped": skipped}

@app.get("/export")
async def export_snippets(conn: sqlite3.Connection = Depends(get_db)):
    """导出所有代码片段"""
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM snippets ORDER BY created_at DESC")
    rows = cursor.fetchall()
    
    return {
        "export_date": datetime.now().isoformat(),
        "total": len(rows),
        "snippets": [row_to_dict(row) for row in rows]
    }

# 智能标签建议
@app.post("/suggest-tags")
async def suggest_tags(code: str = Query(..., min_length=1), language: str = Query(default="text")):
    """基于代码内容智能推荐标签"""
    suggested_tags = []
    
    # 基于语言推荐
    if language != "text":
        suggested_tags.append(language.lower())
    
    # 基于代码内容分析
    patterns = {
        "function": r"\b(def|function|func)\s+\w+",
        "class": r"\b(class|struct|interface)\s+\w+",
        "import": r"\b(import|require|include|using|from)\s+",
        "async": r"\b(async|await|promise|callback)\b",
        "regex": r"[\/\#].*?[\/\#][gimuy]*",
        "http": r"\b(http|https|fetch|axios|request|curl)\b",
        "database": r"\b(sql|query|select|insert|update|delete|mongo|redis)\b",
        "test": r"\b(test|spec|describe|it\(|expect|assert)\b",
        "api": r"\b(api|endpoint|route|controller)\b",
        "auth": r"\b(auth|login|token|jwt|password|session)\b",
        "config": r"\b(config|settings|env|environment)\b",
        "utils": r"\b(util|helper|tool|common|shared)\b"
    }
    
    for tag, pattern in patterns.items():
        if re.search(pattern, code, re.IGNORECASE):
            suggested_tags.append(tag)
    
    return {"suggested_tags": list(set(suggested_tags))}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
