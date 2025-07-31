// 博客数据
const blogs = [
    {
        id: 1,
        title: "网络安全基础：如何保护你的在线隐私",
        content: "在数字时代，保护个人隐私变得尤为重要。本文将介绍基本的网络安全概念和实践，帮助您建立第一道防线...",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        date: "2023-07-15",
        comments: 12,
        category: "security",
        tags: ["网络安全", "隐私保护"]
    },
    {
        id: 2,
        title: "密码管理的最佳实践",
        content: "使用弱密码或重复使用密码是网络安全中最常见的错误之一。了解如何创建强密码以及使用密码管理器...",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
        date: "2023-07-10",
        comments: 8,
        category: "security",
        tags: ["密码管理", "安全实践"]
    },
    {
        id: 3,
        title: "为什么双因素认证(2FA)至关重要",
        content: "双因素认证为您的在线账户提供了额外的安全层。本文将解释2FA的工作原理以及如何为您的账户启用它...",
        image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
        date: "2023-07-05",
        comments: 15,
        category: "security",
        tags: ["双因素认证", "账户安全"]
    },
    {
        id: 4,
        title: "Kali Linux入门指南",
        content: "Kali Linux是安全专业人士和爱好者的首选工具。本指南将带您了解其基本功能和常用工具...",
        image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1206&q=80",
        date: "2023-07-01",
        comments: 9,
        category: "tools",
        tags: ["Kali Linux", "渗透测试"]
    },
    {
        id: 5,
        title: "Wireshark网络分析实战",
        content: "Wireshark是网络分析和故障排除的强大工具。本文将演示如何使用Wireshark捕获和分析网络流量...",
        image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        date: "2023-06-25",
        comments: 7,
        category: "tools",
        tags: ["Wireshark", "网络分析"]
    },
    {
        id: 6,
        title: "CTF竞赛入门指南",
        content: "CTF竞赛是提升网络安全技能的最佳方式。本文将为初学者介绍CTF比赛的基本概念和常见题型...",
        image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        date: "2023-06-20",
        comments: 11,
        category: "ctf",
        tags: ["CTF", "竞赛"]
    }
];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    checkLoginStatus();
    
    // 加载博客
    loadBlogs();
    
    // 事件监听
    setupEventListeners();
});

// 检查登录状态
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('kon-myblog-admin') === 'true';
    const adminNotice = document.getElementById('admin-notice');
    const adminLink = document.getElementById('admin-link');
    
    if (isLoggedIn) {
        adminNotice.style.display = 'block';
        adminLink.style.display = 'block';
        document.getElementById('login-panel').style.display = 'none';
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 登录表单提交
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // 隐藏登录按钮点击事件
    document.getElementById('login-btn-hidden').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('login-panel').style.display = 'block';
    });
    
    // 搜索按钮
    document.getElementById('search-btn').addEventListener('click', handleSearch);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });
    
    // 分类标签
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterBlogsByCategory(category);
        });
    });
    
    // 排序选项
    document.getElementById('sort-select').addEventListener('change', function() {
        sortBlogs(this.value);
    });
    
    // 色调切换功能
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            const root = document.documentElement;
            
            switch(theme) {
                case 'light':
                    root.style.setProperty('--primary-color', 'var(--theme-light-primary)');
                    root.style.setProperty('--secondary-color', '#90caf9');
                    break;
                case 'dark':
                    root.style.setProperty('--primary-color', 'var(--theme-dark-primary)');
                    root.style.setProperty('--secondary-color', '#4a5568');
                    break;
                case 'blue':
                    root.style.setProperty('--primary-color', 'var(--theme-blue-primary)');
                    root.style.setProperty('--secondary-color', '#63b3ed');
                    break;
                case 'green':
                    root.style.setProperty('--primary-color', 'var(--theme-green-primary)');
                    root.style.setProperty('--secondary-color', '#68d391');
                    break;
                default:
                    root.style.setProperty('--primary-color', '#4e54c8');
                    root.style.setProperty('--secondary-color', '#8f94fb');
            }
            // 保存用户偏好
            localStorage.setItem('kon-myblog-theme', theme);
        });
    });

    // 加载保存的色调偏好
    const savedTheme = localStorage.getItem('kon-myblog-theme');
    if (savedTheme) {
        document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`).click();
    }
}

// 处理登录
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 修改为新的账号密码验证
    if (username === 'kon-myblog' && password === 'hfhf888888') {
        localStorage.setItem('kon-myblog-admin', 'true');
        checkLoginStatus();
        // 登录成功后隐藏面板
        document.getElementById('login-panel').style.display = 'none';
    } else {
        alert('用户名或密码错误！');
    }
}

// 加载博客
function loadBlogs() {
    const blogsContainer = document.getElementById('blogs-container');
    blogsContainer.innerHTML = '';
    
    blogs.forEach(blog => {
        const blogCard = document.createElement('div');
        blogCard.classList.add('blog-card');
        blogCard.innerHTML = `
            <div class="blog-image">
                <img src="${blog.image}" alt="${blog.title}">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span><i class="far fa-calendar"></i> ${blog.date}</span>
                    <span><i class="far fa-comment"></i> ${blog.comments} 评论</span>
                    <span class="blog-category">${getCategoryName(blog.category)}</span>
                </div>
                <h4>${blog.title}</h4>
                <p>${blog.content}</p>
                <a href="blog-detail.html?id=${blog.id}">
                    阅读更多 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        blogsContainer.appendChild(blogCard);
    });
}

// 获取分类名称
function getCategoryName(category) {
    const categories = {
        'security': '网络安全',
        'tools': '工具使用',
        'tutorial': '教程',
        'ctf': 'CTF竞赛',
        'linux': 'Linux系统'
    };
    return categories[category] || '未分类';
}

// 处理搜索
function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (!searchTerm) {
        loadBlogs();
        return;
    }
    
    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm) || 
        blog.content.toLowerCase().includes(searchTerm) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    renderBlogs(filteredBlogs);
}

// 按分类过滤博客
function filterBlogsByCategory(category) {
    // 更新活动标签
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.classList.toggle('active', tag.getAttribute('data-category') === category);
    });
    
    if (category === 'all') {
        loadBlogs();
        return;
    }
    
    const filteredBlogs = blogs.filter(blog => blog.category === category);
    renderBlogs(filteredBlogs);
}

// 排序博客
function sortBlogs(sortBy) {
    const sortedBlogs = [...blogs];
    
    switch(sortBy) {
        case 'newest':
            sortedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            sortedBlogs.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'popular':
            sortedBlogs.sort((a, b) => b.comments - a.comments);
            break;
    }
    
    renderBlogs(sortedBlogs);
}

// 渲染博客列表
function renderBlogs(blogsToRender) {
    const blogsContainer = document.getElementById('blogs-container');
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
    
    blogsToRender.forEach(blog => {
        const blogCard = document.createElement('div');
        blogCard.classList.add('blog-card');
        blogCard.innerHTML = `
            <div class="blog-image">
                <img src="${blog.image}" alt="${blog.title}">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span><i class="far fa-calendar"></i> ${blog.date}</span>
                    <span><i class="far fa-comment"></i> ${blog.comments} 评论</span>
                    <span class="blog-category">${getCategoryName(blog.category)}</span>
                </div>
                <h4>${blog.title}</h4>
                <p>${blog.content}</p>
                <a href="blog-detail.html?id=${blog.id}">
                    阅读更多 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        blogsContainer.appendChild(blogCard);
    });
}
