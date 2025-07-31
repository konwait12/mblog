// 博客数据
let blogs = JSON.parse(localStorage.getItem('kon-myblog-blogs')) || [
    {
        id: 1,
        title: "网络安全基础：如何保护你的在线隐私",
        content: "在数字时代，保护个人隐私变得尤为重要。本文将介绍基本的网络安全概念和实践，帮助您建立第一道防线...",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        date: "2023-07-15",
        comments: 12,
        tags: ["网络安全", "隐私保护"]
    },
    {
        id: 2,
        title: "密码管理的最佳实践",
        content: "使用弱密码或重复使用密码是网络安全中最常见的错误之一。了解如何创建强密码以及使用密码管理器...",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
        date: "2023-07-10",
        comments: 8,
        tags: ["密码管理", "安全实践"]
    },
    {
        id: 3,
        title: "为什么双因素认证(2FA)至关重要",
        content: "双因素认证为您的在线账户提供了额外的安全层。本文将解释2FA的工作原理以及如何为您的账户启用它...",
        image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
        date: "2023-07-05",
        comments: 15,
        tags: ["双因素认证", "账户安全"]
    }
];

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
                </div>
                <h4>${blog.title}</h4>
                <p>${blog.content}</p>
                <a href="#" class="read-more" data-id="${blog.id}">
                    阅读更多 <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        blogsContainer.appendChild(blogCard);
    });
    
    // 添加事件监听器
    document.querySelectorAll('.read-more').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const blogId = this.getAttribute('data-id');
            viewBlog(blogId);
        });
    });
}

// 查看博客详情
function viewBlog(blogId) {
    const blog = blogs.find(b => b.id == blogId);
    if (blog) {
        // 在实际应用中，这里会跳转到博客详情页
        alert(`查看博客: ${blog.title}\n\n${blog.content}`);
    }
}

// 初始化博客模态框
const blogModal = document.getElementById('blog-modal');
const newBlogBtn = document.getElementById('new-blog-btn');
const addBlogBtn = document.getElementById('add-blog-btn');
const closeBlogModal = document.getElementById('close-blog-modal');
const cancelBlogBtn = document.getElementById('cancel-blog');
const publishBlogBtn = document.getElementById('publish-blog');

newBlogBtn.addEventListener('click', () => {
    blogModal.classList.add('active');
});

addBlogBtn.addEventListener('click', () => {
    blogModal.classList.add('active');
});

closeBlogModal.addEventListener('click', () => {
    blogModal.classList.remove('active');
});

cancelBlogBtn.addEventListener('click', () => {
    blogModal.classList.remove('active');
});

// 发布新博客
publishBlogBtn.addEventListener('click', () => {
    const title = document.getElementById('blog-title').value;
    const image = document.getElementById('blog-image').value;
    const content = document.getElementById('blog-content').value;
    const tags = document.getElementById('blog-tags').value.split(',').map(tag => tag.trim());
    
    if (!title || !content) {
        alert('标题和内容不能为空！');
        return;
    }
    
    const newBlog = {
        id: Date.now(),
        title,
        image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        content,
        date: new Date().toISOString().split('T')[0],
        comments: 0,
        tags
    };
    
    blogs.unshift(newBlog);
    localStorage.setItem('kon-myblog-blogs', JSON.stringify(blogs));
    
    // 重置表单
    document.getElementById('blog-title').value = '';
    document.getElementById('blog-image').value = '';
    document.getElementById('blog-content').value = '';
    document.getElementById('blog-tags').value = '';
    
    // 关闭模态框并刷新列表
    blogModal.classList.remove('active');
    loadBlogs();
    
    alert('博客发布成功！');
});

// 初始化博客
document.addEventListener('DOMContentLoaded', loadBlogs);