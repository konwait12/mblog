// 检查管理员是否已登录
function checkAdminLoggedIn() {
    const isLoggedIn = localStorage.getItem('kon-myblog-admin') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        alert('请先登录管理员账户');
    }
}

// 初始化博客数据（管理员页面使用本地存储以便预览）
function initBlogs() {
    // 从JSON文件加载并存储到本地存储供管理界面使用
    fetch('data/blogs.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('kon-blogs', JSON.stringify(data));
            renderBlogList();
            updateDashboardStats();
        })
        .catch(error => {
            console.error('加载初始博客数据失败:', error);
            //  fallback数据
            const fallbackBlogs = [
                {
                    id: 1,
                    title: "示例文章",
                    content: "# 示例文章\n\n这是一篇示例文章，用于初始化博客数据。\n\n## 二级标题\n\n- 列表项1\n- 列表项2",
                    image: "https://picsum.photos/600/400",
                    date: new Date().toLocaleDateString(),
                    comments: 0,
                    category: "security",
                    tags: ["示例"]
                }
            ];
            localStorage.setItem('kon-blogs', JSON.stringify(fallbackBlogs));
            renderBlogList();
            updateDashboardStats();
        });
}

// 渲染博客列表
function renderBlogList() {
    const blogs = JSON.parse(localStorage.getItem('kon-blogs') || '[]');
    const blogListElement = document.getElementById('blog-list');
    
    if (!blogListElement) return; // 防止DOM元素未加载
    
    blogListElement.innerHTML = '';
    
    if (blogs.length === 0) {
        blogListElement.innerHTML = '<p class="no-data">暂无文章，请点击"新增文章"按钮创建</p>';
        return;
    }
    
    // 创建表格
    const table = document.createElement('table');
    table.className = 'blogs-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>标题</th>
                <th>分类</th>
                <th>发布日期</th>
                <th>评论数</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            ${blogs.map(blog => `
                <tr>
                    <td>${blog.id}</td>
                    <td>${blog.title}</td>
                    <td>${getCategoryName(blog.category)}</td>
                    <td>${blog.date}</td>
                    <td>${blog.comments}</td>
                    <td class="actions">
                        <button class="btn btn-sm btn-edit" data-id="${blog.id}">
                            <i class="fas fa-edit"></i> 编辑（源码教程）
                        </button>
                        <button class="btn btn-sm btn-delete" data-id="${blog.id}">
                            <i class="fas fa-trash"></i> 删除（源码教程）
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    blogListElement.appendChild(table);
    
    // 添加编辑和删除事件监听
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const blogId = parseInt(this.getAttribute('data-id'));
            showEditSourceCodeTutorial(blogId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const blogId = parseInt(this.getAttribute('data-id'));
            showDeleteSourceCodeTutorial(blogId);
        });
    });
}

// 显示编辑文章的源代码修改教程
function showEditSourceCodeTutorial(blogId) {
    const blogs = JSON.parse(localStorage.getItem('kon-blogs') || '[]');
    const blog = blogs.find(b => b.id === blogId);
    
    if (!blog) return;
    
    // 截取Markdown内容作为示例
    const contentPreview = blog.content.substring(0, 50).replace(/\n/g, ' ') + '...';
    
    alert(`【编辑文章源代码修改教程】
1. 打开仓库中的 data/blogs.json 文件
2. 找到id为 ${blogId} 的文章对象：
{
  "id": ${blogId},
  "title": "${blog.title}",
  "content": "${contentPreview}",
  ...
}
3. 修改需要更新的字段（title、content、category等）
4. 内容支持Markdown格式
5. 注意保持JSON格式正确性（逗号、引号等）
6. 保存文件并提交到GitHub仓库
7. 等待页面部署后生效`);
}

// 显示删除文章的源代码修改教程
function showDeleteSourceCodeTutorial(blogId) {
    alert(`【删除文章源代码修改教程】
1. 打开仓库中的 data/blogs.json 文件
2. 找到id为 ${blogId} 的文章对象
3. 删除该对象（注意删除前后的逗号，确保JSON格式正确）
4. 同时删除评论数据：从localStorage中清除blog-${blogId}-comments
5. 保存文件并提交到GitHub仓库
6. 等待页面部署后生效`);
}

// 获取分类名称
function getCategoryName(category) {
    const categories = {
        'security': '网络安全',
        'tools': '工具实践',
        'ctf': 'CTF竞赛',
        'linux': 'Linux探索'
    };
    return categories[category] || '未分类';
}

// 更新仪表盘统计数据
function updateDashboardStats() {
    const blogs = JSON.parse(localStorage.getItem('kon-blogs') || '[]');
    
    // 计算评论总数
    let totalComments = 0;
    blogs.forEach(blog => {
        const comments = JSON.parse(localStorage.getItem(`blog-${blog.id}-comments`) || '[]');
        totalComments += comments.length;
    });
    
    // 计算分类数量
    const categories = new Set();
    blogs.forEach(blog => categories.add(blog.category));
    
    // 更新统计数字
    const statsElements = {
        totalBlogs: document.getElementById('stat-total-blogs'),
        totalComments: document.getElementById('stat-total-comments'),
        totalCategories: document.getElementById('stat-total-categories'),
        latestPost: document.getElementById('stat-latest-post')
    };
    
    if (statsElements.totalBlogs) {
        statsElements.totalBlogs.textContent = blogs.length;
    }
    
    if (statsElements.totalComments) {
        statsElements.totalComments.textContent = totalComments;
    }
    
    if (statsElements.totalCategories) {
        statsElements.totalCategories.textContent = categories.size;
    }
    
    // 更新最新文章
    if (statsElements.latestPost && blogs.length > 0) {
        // 按日期排序，取最新的
        const sortedBlogs = [...blogs].sort((a, b) => new Date(b.date) - new Date(a.date));
        statsElements.latestPost.textContent = sortedBlogs[0].title;
    }
}

// 渲染评论管理
function renderComments() {
    const commentsContainer = document.getElementById('comments-list');
    if (!commentsContainer) return;
    
    const blogs = JSON.parse(localStorage.getItem('kon-blogs') || '[]');
    
    // 转换为数组并添加文章标题
    const commentsArray = [];
    blogs.forEach(blog => {
        const comments = JSON.parse(localStorage.getItem(`blog-${blog.id}-comments`) || '[]');
        comments.forEach(comment => {
            commentsArray.push({
                ...comment,
                blogId: blog.id,
                blogTitle: blog.title,
                id: Date.now() + Math.floor(Math.random() * 1000) // 临时ID
            });
        });
    });
    
    // 按日期排序（最新的在前）
    commentsArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (commentsArray.length === 0) {
        commentsContainer.innerHTML = '<p class="no-data">暂无评论</p>';
        return;
    }
    
    // 创建评论表格
    const table = document.createElement('table');
    table.className = 'comments-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>文章</th>
                <th>评论者</th>
                <th>内容</th>
                <th>日期</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            ${commentsArray.map(comment => `
                <tr>
                    <td>${comment.blogTitle}</td>
                    <td>${comment.name}</td>
                    <td class="comment-content">${comment.content}</td>
                    <td>${formatDate(comment.date)}</td>
                    <td class="actions">
                        <button class="btn btn-sm btn-delete-comment" 
                                data-blogid="${comment.blogId}">
                            <i class="fas fa-trash"></i> 删除
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    commentsContainer.innerHTML = '';
    commentsContainer.appendChild(table);
    
    // 添加删除评论事件
    document.querySelectorAll('.btn-delete-comment').forEach(btn => {
        btn.addEventListener('click', function() {
            const blogId = parseInt(this.getAttribute('data-blogid'));
            const row = this.closest('tr');
            const commentContent = row.querySelector('.comment-content').textContent;
            
            if (confirm('确定要删除这条评论吗？')) {
                // 获取该文章的所有评论
                let comments = JSON.parse(localStorage.getItem(`blog-${blogId}-comments`) || '[]');
                
                // 找到并删除匹配的评论
                comments = comments.filter(comment => comment.content !== commentContent);
                
                // 保存更新后的评论
                localStorage.setItem(`blog-${blogId}-comments`, JSON.stringify(comments));
                
                // 重新渲染评论列表
                renderComments();
                updateDashboardStats();
            }
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    checkAdminLoggedIn();
    
    initBlogs();
    
    // 退出登录
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('kon-myblog-admin');
        window.location.href = 'index.html';
    });
    
    // 清理本地存储数据
    document.getElementById('clear-storage').addEventListener('click', function() {
        if (confirm('确定要清理所有本地存储数据吗？这不会影响实际发布的内容。')) {
            localStorage.clear();
            alert('本地存储已清理，页面将刷新');
            window.location.reload();
        }
    });
    
    // 新增文章按钮
    document.getElementById('add-blog-btn').addEventListener('click', function() {
        alert(`【新增文章源代码修改教程】
1. 打开仓库中的 data/blogs.json 文件
2. 在数组中添加新的文章对象：
{
  "id": ${Date.now()},
  "title": "新文章标题",
  "content": "# 文章标题\n\n文章内容支持Markdown格式...",
  "image": "图片URL",
  "date": "${new Date().toLocaleDateString()}",
  "comments": 0,
  "category": "security",
  "tags": ["标签1", "标签2"]
}
3. 注意保持JSON格式正确性（最后一个对象后没有逗号）
4. 保存文件并提交到GitHub仓库
5. 等待页面部署后生效`);
    });
    
    // 标签页切换
    document.querySelectorAll('.admin-tabs button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 更新按钮状态
            document.querySelectorAll('.admin-tabs button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // 更新内容显示
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.style.display = 'none';
            });
            document.getElementById(tabId).style.display = 'block';
            
            // 如果切换到评论标签，重新渲染评论
            if (tabId === 'comments-tab') {
                renderComments();
            }
        });
    });
    
    // 密码修改表单
    document.getElementById('password-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (currentPassword !== 'hfhf888888') {
            alert('当前密码不正确');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('两次输入的新密码不一致');
            return;
        }
        
        alert('密码修改需要在服务器端进行，此处仅为演示');
        this.reset();
    });
});

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}
