// 初始化后台管理页面
document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    checkAdminLogin();
    
    // 初始化仪表盘
    initDashboard();
    
    // 设置标签页切换
    setupTabs();
    
    // 初始化博客管理
    initBlogManagement();
    
    // 事件监听
    setupEventListeners();
});

// 检查管理员登录状态
function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('kon-myblog-admin') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
}

// 初始化仪表盘
function initDashboard() {
    // 获取博客数据
    const blogs = getBlogs();
    
    // 计算统计数据
    const totalPosts = blogs.length;
    const totalComments = blogs.reduce((sum, blog) => sum + blog.comments, 0);
    const totalCategories = new Set(blogs.map(blog => blog.category)).size;
    
    // 更新统计数据
    document.getElementById('total-posts').textContent = totalPosts;
    document.getElementById('total-comments').textContent = totalComments;
    document.getElementById('total-categories').textContent = totalCategories;
    
    // 初始化图表
    initChart();
}

// 初始化图表
function initChart() {
    const ctx = document.getElementById('category-chart').getContext('2d');
    const blogs = getBlogs();
    
    // 按分类统计文章数
    const categoryCount = {};
    blogs.forEach(blog => {
        categoryCount[blog.category] = (categoryCount[blog.category] || 0) + 1;
    });
    
    // 准备图表数据
    const categories = Object.keys(categoryCount);
    const counts = Object.values(categoryCount);
    
    // 生成颜色
    const colors = generateChartColors(categories.length);
    
    const data = {
        labels: categories.map(cat => getCategoryName(cat)),
        datasets: [{
            label: '文章数量',
            data: counts,
            backgroundColor: colors,
            borderWidth: 1
        }]
    };
    
    // 创建图表
    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f8f9fa',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} 篇`;
                        }
                    }
                }
            }
        }
    });
}

// 设置标签页切换
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有活动状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 添加当前活动状态
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// 初始化博客管理
function initBlogManagement() {
    renderBlogTable();
}

// 渲染博客表格
function renderBlogTable() {
    const blogs = getBlogs();
    const tableBody = document.querySelector('.admin-table tbody');
    
    tableBody.innerHTML = '';
    
    blogs.forEach(blog => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${blog.title}</td>
            <td>${blog.author}</td>
            <td>${getCategoryName(blog.category)}</td>
            <td>${formatDate(blog.date)}</td>
            <td>${blog.comments}</td>
            <td><span class="status-badge published">已发布</span></td>
            <td>
                <button class="btn-icon edit-blog" data-id="${blog.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete-blog" data-id="${blog.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // 添加编辑事件
    document.querySelectorAll('.edit-blog').forEach(btn => {
        btn.addEventListener('click', function() {
            const blogId = this.getAttribute('data-id');
            editBlog(blogId);
        });
    });
    
    // 添加删除事件
    document.querySelectorAll('.delete-blog').forEach(btn => {
        btn.addEventListener('click', function() {
            const blogId = this.getAttribute('data-id');
            deleteBlog(blogId);
        });
    });
}

// 编辑博客
function editBlog(blogId) {
    // 在实际应用中，这里会打开编辑模态框
    alert(`编辑博客 ID: ${blogId}`);
}

// 删除博客
function deleteBlog(blogId) {
    if (confirm('确定要删除这篇博客吗？此操作不可撤销。')) {
        const blogs = getBlogs();
        const updatedBlogs = blogs.filter(blog => blog.id != blogId);
        
        // 保存更新后的博客列表
        localStorage.setItem('kon-myblog-blogs', JSON.stringify(updatedBlogs));
        
        // 重新渲染表格
        renderBlogTable();
        
        alert('博客已成功删除！');
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 保存设置
    document.querySelectorAll('.save-btn').forEach(btn => {
        btn.addEventListener('click', saveSettings);
    });
    
    // 新建博客按钮
    document.getElementById('new-post-btn').addEventListener('click', createNewBlog);
    
    // 搜索功能
    document.querySelector('.admin-search button').addEventListener('click', handleAdminSearch);
    document.querySelector('.admin-search input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleAdminSearch();
    });
    
    // 分类筛选
    document.querySelector('.filter-options select').addEventListener('change', function() {
        filterBlogs(this.value);
    });
}

// 保存设置
function saveSettings(e) {
    e.preventDefault();
    
    // 获取设置值
    const siteTitle = document.getElementById('site-title').value;
    const siteDesc = document.getElementById('site-description').value;
    const adminEmail = document.getElementById('admin-email').value;
    const primaryColor = document.getElementById('primary-color').value;
    const secondaryColor = document.getElementById('secondary-color').value;
    const bgImageUrl = document.getElementById('bg-image-url').value;
    const avatarUrl = document.getElementById('avatar-url').value;
    
    // 保存设置到localStorage
    const settings = {
        siteTitle,
        siteDesc,
        adminEmail,
        primaryColor,
        secondaryColor,
        bgImageUrl,
        avatarUrl
    };
    
    localStorage.setItem('kon-myblog-settings', JSON.stringify(settings));
    
    // 提示用户
    alert('设置已保存！');
}

// 创建新博客
function createNewBlog() {
    // 在实际应用中，这里会打开博客编辑器
    const newBlog = {
        id: Date.now(),
        title: "新博客标题",
        content: "在这里开始撰写您的新博客...",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        date: new Date().toISOString(),
        author: "管理员",
        comments: 0,
        category: "security",
        tags: ["新博客"]
    };
    
    const blogs = getBlogs();
    blogs.unshift(newBlog);
    localStorage.setItem('kon-myblog-blogs', JSON.stringify(blogs));
    
    // 重新渲染表格
    renderBlogTable();
    
    alert('新博客已创建！');
}

// 处理后台搜索
function handleAdminSearch() {
    const searchTerm = document.querySelector('.admin-search input').value.toLowerCase();
    if (!searchTerm) {
        renderBlogTable();
        return;
    }
    
    const blogs = getBlogs();
    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm) || 
        blog.content.toLowerCase().includes(searchTerm) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    renderFilteredBlogs(filteredBlogs);
}

// 按分类筛选博客
function filterBlogs(category) {
    const blogs = getBlogs();
    
    if (category === 'all') {
        renderBlogTable();
        return;
    }
    
    const filteredBlogs = blogs.filter(blog => 
        getCategoryName(blog.category) === category
    );
    
    renderFilteredBlogs(filteredBlogs);
}

// 渲染筛选后的博客
function renderFilteredBlogs(blogs) {
    const tableBody = document.querySelector('.admin-table tbody');
    
    tableBody.innerHTML = '';
    
    if (blogs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-results">
                    <i class="fas fa-search"></i>
                    <p>没有找到匹配的博客</p>
                </td>
            </tr>
        `;
        return;
    }
    
    blogs.forEach(blog => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${blog.title}</td>
            <td>${blog.author}</td>
            <td>${getCategoryName(blog.category)}</td>
            <td>${formatDate(blog.date)}</td>
            <td>${blog.comments}</td>
            <td><span class="status-badge published">已发布</span></td>
            <td>
                <button class="btn-icon edit-blog" data-id="${blog.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete-blog" data-id="${blog.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // 重新绑定事件
    document.querySelectorAll('.edit-blog').forEach(btn => {
        btn.addEventListener('click', function() {
            const blogId = this.getAttribute('data-id');
            editBlog(blogId);
        });
    });
    
    document.querySelectorAll('.delete-blog').forEach(btn => {
        btn.addEventListener('click', function() {
            const blogId = this.getAttribute('data-id');
            deleteBlog(blogId);
        });
    });
}