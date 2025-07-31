// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initBlogs();
    initProfile();
    checkAdminLogin();
    setupEventListeners();
    checkSearchTerm();
});

// 初始化博客数据 - 不使用本地存储存储文章内容
async function initBlogs() {
    try {
        const response = await fetch('data/blogs.json');
        const blogs = await response.json();
        renderBlogs(blogs);
        // 仅在本地存储一份副本用于搜索和筛选，不作为主要数据源
        localStorage.setItem('kon-blogs-cache', JSON.stringify(blogs));
    } catch (error) {
        console.error('加载博客数据失败:', error);
        // 使用备用数据
        const fallbackBlogs = [
            {
                id: 1,
                title: "网络安全基础：如何保护你的在线隐私",
                content: "# 网络安全基础：如何保护你的在线隐私\n\n在数字时代，保护个人隐私变得尤为重要...",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
                date: "2024-01-15",
                comments: 12,
                category: "security",
                tags: ["网络安全", "隐私保护"]
            },
            {
                id: 2,
                title: "Kali Linux入门指南",
                content: "# Kali Linux入门指南\n\nKali Linux是安全专业人士和爱好者的首选工具...",
                image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1206&q=80",
                date: "2024-01-10",
                comments: 8,
                category: "tools",
                tags: ["Kali Linux", "渗透测试"]
            }
        ];
        renderBlogs(fallbackBlogs);
        localStorage.setItem('kon-blogs-cache', JSON.stringify(fallbackBlogs));
    }
}

// 初始化个人资料
function initProfile() {
    // 从JSON文件加载而非本地存储
    fetch('data/profile.json')
        .then(response => response.json())
        .then(profile => {
            if (profile.avatar && document.getElementById('profile-avatar')) {
                document.getElementById('profile-avatar').src = profile.avatar;
            }
            
            if (profile.description && document.getElementById('profile-description')) {
                document.getElementById('profile-description').textContent = profile.description;
            }
            
            if (profile.skills && document.getElementById('skills-container')) {
                const skillsContainer = document.getElementById('skills-container');
                skillsContainer.innerHTML = '';
                
                profile.skills.split(',').forEach(skill => {
                    const skillTag = document.createElement('span');
                    skillTag.className = 'skill-tag';
                    skillTag.textContent = skill.trim();
                    skillsContainer.appendChild(skillTag);
                });
            }
        })
        .catch(error => console.error('加载个人资料失败:', error));

    // 加载网站设置
    fetch('data/settings.json')
        .then(response => response.json())
        .then(settings => {
            if (settings.siteTitle) {
                document.title = `${settings.siteTitle} - 网络安全技术博客`;
                const logoTitle = document.querySelector('.logo h1');
                if (logoTitle) logoTitle.textContent = settings.siteTitle;
            }
            
            if (settings.heroTitle) {
                const heroTitle = document.querySelector('.hero h2');
                if (heroTitle) heroTitle.textContent = settings.heroTitle;
            }
            
            if (settings.heroSubtitle) {
                const heroSubtitle = document.querySelector('.hero p');
                if (heroSubtitle) heroSubtitle.textContent = settings.heroSubtitle;
            }
        })
        .catch(error => console.error('加载网站设置失败:', error));
}

// 检查管理员登录状态 - 仅登录状态存储在本地
function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('kon-myblog-admin') === 'true';
    const adminNotice = document.getElementById('admin-notice');
    const adminLink = document.getElementById('admin-link');
    
    if (isLoggedIn) {
        if (adminNotice) adminNotice.style.display = 'block';
        if (adminLink) adminLink.style.display = 'block';
    }
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 实际应用中应该通过API验证
    if (username === 'kon-myblog' && password === 'hfhf888888') {
        localStorage.setItem('kon-myblog-admin', 'true');
        checkAdminLogin();
        const loginPanel = document.getElementById('login-panel');
        if (loginPanel) loginPanel.style.display = 'none';
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.reset();
        alert('登录成功，正在跳转到管理后台');
        window.location.href = 'admin.html';
    } else {
        alert('用户名或密码错误');
    }
}

// 渲染博客列表
function renderBlogs(blogsToRender) {
    const blogsContainer = document.getElementById('blogs-container');
    if (!blogsContainer) return;
    
    blogsContainer.innerHTML = '';
    
    if (blogsToRender.length === 0) {
        blogsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>没有找到匹配的文章</h3>
                <p>请尝试其他搜索关键词或分类</p>
            </div>
        `;
        return;
    }
    
    // 按日期排序（最新的在前）
    const sortedBlogs = [...blogsToRender].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedBlogs.forEach(blog => {
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-card fade-in';
        
        // 处理图片（如果没有图片使用默认图）
        const imageUrl = blog.image || `https://picsum.photos/600/400?random=${blog.id}`;
        
        // 转换Markdown为纯文本作为摘要
        const plainText = blog.content
            .replace(/#+ /g, '') // 移除标题标记
            .replace(/```[^`]+```/g, ' [代码块] ') // 替换代码块
            .replace(/!\[.*?\]\(.*?\)/g, ' [图片] ') // 替换图片
            .replace(/\[.*?\]\(.*?\)/g, ' [链接] ') // 替换链接
            .replace(/\*\*|\*/g, '') // 移除粗体/斜体标记
            .replace(/\n/g, ' ') // 替换换行
            .substring(0, 120);
        
        blogCard.innerHTML = `
            <div class="blog-image">
                <img src="${imageUrl}" alt="${blog.title}">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span><i class="far fa-calendar"></i> ${blog.date}</span>
                    <span><i class="far fa-comment"></i> ${blog.comments} 评论</span>
                    <span class="blog-category">${getCategoryName(blog.category)}</span>
                </div>
                <h4>${blog.title}</h4>
                <p>${plainText}${blog.content.length > 120 ? '...' : ''}</p>
                <a href="blog-detail.html?id=${blog.id}">
                    阅读更多 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        blogsContainer.appendChild(blogCard);
    });
}

// 获取分类名称
function getCategoryName(categorySlug) {
    const defaultCategories = {
        'security': '网络安全',
        'tools': '工具实践',
        'tutorial': '教程',
        'ctf': 'CTF竞赛',
        'linux': 'Linux系统',
        'uncategorized': '未分类'
    };
    
    return defaultCategories[categorySlug] || '未分类';
}

// 处理搜索
function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const blogs = JSON.parse(localStorage.getItem('kon-blogs-cache') || '[]');
    
    if (!searchTerm) {
        renderBlogs(blogs);
        return;
    }
    
    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm) ||
        blog.content.toLowerCase().includes(searchTerm) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
    
    renderBlogs(filteredBlogs);
}

// 检查是否有搜索词需要处理
function checkSearchTerm() {
    const searchTerm = localStorage.getItem('kon-myblog-search');
    if (searchTerm && document.getElementById('search-input')) {
        document.getElementById('search-input').value = searchTerm;
        handleSearch();
        // 清除搜索词，避免下次打开还显示
        localStorage.removeItem('kon-myblog-search');
    }
}

// 按分类筛选博客
function filterBlogsByCategory(category) {
    // 更新活动标签样式
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.classList.toggle('active', tag.getAttribute('data-category') === category);
    });
    
    const blogs = JSON.parse(localStorage.getItem('kon-blogs-cache') || '[]');
    
    if (category === 'all') {
        renderBlogs(blogs);
        return;
    }
    
    const filteredBlogs = blogs.filter(blog => blog.category === category);
    renderBlogs(filteredBlogs);
}

// 排序博客
function sortBlogs(sortBy) {
    const blogs = JSON.parse(localStorage.getItem('kon-blogs-cache') || '[]');
    let sortedBlogs = [...blogs];
    
    switch (sortBy) {
        case 'newest':
            sortedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            sortedBlogs.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'popular':
            sortedBlogs.sort((a, b) => (b.comments || 0) - (a.comments || 0));
            break;
    }
    
    renderBlogs(sortedBlogs);
}

// 设置事件监听器
function setupEventListeners() {
    // 登录表单提交
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 登录触发按钮
    const loginTrigger = document.getElementById('login-trigger');
    if (loginTrigger) {
        loginTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            const loginPanel = document.getElementById('login-panel');
            if (loginPanel) loginPanel.style.display = 'block';
        });
    }
    
    // 关闭登录面板
    const closeLogin = document.querySelector('.close-panel');
    if (closeLogin) {
        closeLogin.addEventListener('click', function() {
            const loginPanel = document.getElementById('login-panel');
            if (loginPanel) loginPanel.style.display = 'none';
        });
    }
    
    // 搜索功能
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // 分类筛选
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterBlogsByCategory(category);
        });
    });
    
    // 排序功能
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortBlogs(this.value);
        });
    }

    // 清理缓存按钮
    const clearStorageBtn = document.getElementById('clear-storage-btn');
    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('确定要清理所有缓存数据吗？')) {
                localStorage.clear();
                sessionStorage.clear();
                alert('缓存已清理，将刷新页面');
                window.location.reload();
            }
        });
    }
    
    // 主题切换
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
            
            // 更新活跃状态
            document.querySelectorAll('.theme-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// 应用主题
function applyTheme(theme) {
    const root = document.documentElement;
    
    // 移除所有主题类
    root.classList.remove('theme-default', 'theme-light', 'theme-dark', 'theme-blue', 'theme-green');
    
    // 添加选中的主题类
    if (theme) {
        root.classList.add(`theme-${theme}`);
        localStorage.setItem('kon-myblog-theme', theme);
    }
}
    