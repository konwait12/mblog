// 初始化博客数据 - 不使用本地存储存储文章内容
async function initBlogs() {
    try {
        const response = await fetch('data/blogs.json');
        const blogs = await response.json();
        renderBlogs(blogs);
    } catch (error) {
        console.error('加载博客数据失败:', error);
        // 使用备用数据
        const fallbackBlogs = getFallbackBlogs();
        renderBlogs(fallbackBlogs);
    }
}

// 初始化个人资料
function initProfile() {
    // 从JSON文件加载而非本地存储
    fetch('data/profile.json')
        .then(response => response.json())
        .then(profile => {
            if (profile.avatar) {
                document.getElementById('profile-avatar').src = profile.avatar;
            }
            
            if (profile.description) {
                document.getElementById('profile-description').textContent = profile.description;
            }
            
            if (profile.skills) {
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
                document.querySelector('.logo h1').textContent = settings.siteTitle;
            }
            
            if (settings.heroTitle) {
                document.querySelector('.hero h2').textContent = settings.heroTitle;
            }
            
            if (settings.heroSubtitle) {
                document.querySelector('.hero p').textContent = settings.heroSubtitle;
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
        adminNotice.style.display = 'block';
        adminLink.style.display = 'block';
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
        document.getElementById('login-panel').style.display = 'none';
        document.getElementById('login-form').reset();
        alert('登录成功，已跳转到管理后台');
        window.location.href = 'admin.html';
    } else {
        alert('用户名或密码错误');
    }
}

// 渲染博客列表 - 直接从参数渲染，不使用本地存储
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
    
    // 按日期排序（最新的在前）
    const sortedBlogs = [...blogsToRender].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedBlogs.forEach(blog => {
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-card';
        
        // 处理图片（如果没有图片使用默认图）
        const imageUrl = blog.image || 'https://picsum.photos/600/400?random=' + blog.id;
        
        // 转换Markdown为纯文本作为摘要
        const plainText = blog.content
            .replace(/#+ /g, '')          // 移除标题标记
            .replace(/```[^`]+```/g, '')  // 移除代码块
            .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
            .replace(/\[.*?\]\(.*?\)/g, '')  // 移除链接
            .replace(/\*\*|\*/g, '')      // 移除粗体/斜体
            .replace(/\n/g, ' ')          // 替换换行
            .substring(0, 120);           // 限制长度
        
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
    
    fetch('data/blogs.json')
        .then(response => response.json())
        .then(blogs => {
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
        });
}

// 按分类筛选博客
function filterBlogsByCategory(category) {
    // 更新活动标签样式
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.classList.toggle('active', tag.getAttribute('data-category') === category);
    });
    
    fetch('data/blogs.json')
        .then(response => response.json())
        .then(blogs => {
            if (category === 'all') {
                renderBlogs(blogs);
                return;
            }
            
            const filteredBlogs = blogs.filter(blog => blog.category === category);
            renderBlogs(filteredBlogs);
        });
}

// 排序博客
function sortBlogs(sortBy) {
    fetch('data/blogs.json')
        .then(response => response.json())
        .then(blogs => {
            let sortedBlogs = [...blogs];
            
            switch (sortBy) {
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
        });
}

// 主题切换功能
function setupThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    // 检查本地存储中的主题偏好
    const savedTheme = localStorage.getItem('kon-blog-theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === savedTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // 主题切换事件
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有主题类
            themeButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加选中状态
            this.classList.add('active');
            
            // 获取主题名称
            const theme = this.getAttribute('data-theme');
            
            // 保存到本地存储
            localStorage.setItem('kon-blog-theme', theme);
            
            // 应用主题
            document.body.className = '';
            document.body.classList.add(theme);
        });
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 登录表单提交
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // 登录触发按钮
    document.getElementById('login-trigger').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('login-panel').style.display = 'block';
    });
    
    // 搜索功能
    document.getElementById('search-btn').addEventListener('click', handleSearch);
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // 分类筛选
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterBlogsByCategory(category);
        });
    });
    
    // 排序功能
    document.getElementById('sort-select').addEventListener('change', function() {
        sortBlogs(this.value);
    });

    // 清理缓存按钮
    document.getElementById('clear-storage-btn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('确定要清理所有缓存数据吗？')) {
            localStorage.clear();
            sessionStorage.clear();
            alert('缓存已清理，将刷新页面');
            window.location.reload();
        }
    });

    // 设置主题切换
    setupThemeSwitcher();
}

// 获取备用博客数据（6篇初始文章）
function getFallbackBlogs() {
    return [
        {
            id: 1,
            title: "网络安全基础：如何保护你的在线隐私",
            content: "# 网络安全基础：如何保护你的在线隐私\n\n在数字时代，保护个人隐私变得尤为重要。随着我们越来越多地将个人信息存储在云端并在网上进行交易，了解如何保护这些信息免受窥探至关重要。\n\n## 1. 强密码的重要性\n\n使用强密码是保护在线账户的第一道防线。一个强密码应该：\n\n- 至少包含12个字符\n- 混合使用大小写字母、数字和特殊符号\n- 避免使用个人信息（如姓名、生日等）\n- 不同账户使用不同密码\n\n## 2. 双因素认证(2FA)\n\n双因素认证为您的账户提供了额外的安全层。即使有人获取了您的密码，他们也需要第二个验证因素才能登录...",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            date: "2024-01-15",
            comments: 12,
            category: "security",
            tags: ["网络安全", "隐私保护"]
        },
        {
            id: 2,
            title: "Kali Linux入门指南",
            content: "# Kali Linux入门指南\n\nKali Linux是安全专业人士和爱好者的首选工具。本指南将带您了解其基本功能和常用工具...\n\n### 安装步骤\n\n1. 下载ISO镜像\n2. 创建启动盘\n3. 启动并安装\n\n## 常用工具\n\n- Nmap - 网络扫描工具\n- Metasploit - 渗透测试框架\n- Wireshark - 网络数据包分析器\n\n```bash\n# 更新Kali Linux\napt update && apt upgrade -y\n```\n\n## 实用技巧\n\n- 使用`apt search`命令查找工具\n- 定期更新系统以获取最新工具和安全补丁",
            image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1206&q=80",
            date: "2024-01-10",
            comments: 8,
            category: "tools",
            tags: ["Kali Linux", "渗透测试"]
        },
        {
            id: 3,
            title: "CTF竞赛入门技巧",
            content: "# CTF竞赛入门技巧\n\nCTF（Capture The Flag）是网络安全领域的竞赛形式，通过解决各种安全挑战来获取旗帜...\n\n## 常见题型\n\n- Web安全\n- 逆向工程\n- 密码学\n- 隐写术\n\n```python\n# Python示例代码：Base64解码\nimport base64\n\nencoded_flag = 'Q1RGe2V4YW1wbGUxfQ=='\ndecoded_flag = base64.b64decode(encoded_flag)\nprint(decoded_flag.decode())\n```\n\n## 学习资源\n\n1. CTFtime - 查看赛事和排名\n2. 各大CTF平台练习区\n3. 安全社区和论坛",
            image: "https://picsum.photos/600/400?random=3",
            date: "2024-01-05",
            comments: 15,
            category: "ctf",
            tags: ["CTF", "安全竞赛"]
        },
        {
            id: 4,
            title: "Linux命令行效率提升技巧",
            content: "# Linux命令行效率提升技巧\n\n掌握Linux命令行可以极大提高工作效率。本文介绍一些实用技巧...\n\n## 常用快捷键\n\n- `Ctrl + R`：搜索历史命令\n- `Ctrl + A`：移动到行首\n- `Ctrl + E`：移动到行尾\n- `Ctrl + L`：清屏\n\n### 别名设置\n\n```bash\n# 在.bashrc中设置别名\nalias ll='ls -l'\nalias grep='grep --color=auto'\nalias ..='cd ..'\nalias ...='cd ../../'\n```\n\n## 管道和重定向\n\n利用管道组合命令可以实现强大功能：\n\n```bash\n# 查找包含特定关键词的进程\ntop -b -n 1 | grep 'python'\n\n# 将命令输出保存到文件\nls -l > file_list.txt\n```",
            image: "https://picsum.photos/600/400?random=4",
            date: "2023-12-28",
            comments: 6,
            category: "linux",
            tags: ["Linux", "命令行"]
        },
        {
            id: 5,
            title: "Web渗透测试基础",
            content: "# Web渗透测试基础\n\nWeb渗透测试是评估Web应用程序安全性的过程...\n\n## 测试流程\n\n1. 信息收集\n2. 漏洞扫描\n3. 漏洞利用\n4. 报告编写\n\n### 常见漏洞\n\n- SQL注入\n- XSS跨站脚本\n- CSRF跨站请求伪造\n- 文件上传漏洞\n\n## 测试工具\n\n- Burp Suite - Web应用安全测试工具\n- OWASP ZAP - 开源安全扫描器\n- Nikto - Web服务器扫描器\n\n![Web渗透测试流程](https://picsum.photos/800/400?random=10)\n\n> 注意：仅对授权系统进行渗透测试，未经授权的测试是非法的。",
            image: "https://picsum.photos/600/400?random=5",
            date: "2023-12-20",
            comments: 9,
            category: "security",
            tags: ["Web安全", "渗透测试"]
        },
        {
            id: 6,
            title: "密码学基础与应用",
            content: "# 密码学基础与应用\n\n密码学是网络安全的基础，负责信息的加密与解密...\n\n## 加密算法分类\n\n- 对称加密（如AES）\n- 非对称加密（如RSA）\n- 哈希函数（如SHA-256）\n\n```\n# RSA加密示例\n公钥: (n, e)\n私钥: (n, d)\n加密: c = m^e mod n\n解密: m = c^d mod n\n```\n\n## 实际应用\n\n1. HTTPS中的TLS/SSL协议\n2. 数字签名\n3. 密码存储（使用哈希函数）\n4. 安全通信\n\n### 常见哈希函数\n\n- MD5 (已不安全，不推荐使用)\n- SHA-1 (逐渐被淘汰)\n- SHA-256 (目前广泛使用)\n- SHA-3 (最新标准)",
            image: "https://picsum.photos/600/400?random=6",
            date: "2023-12-15",
            comments: 7,
            category: "security",
            tags: ["密码学", "加密算法"]
        }
    ];
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initBlogs();
    initProfile();
    checkAdminLogin();
    setupEventListeners();
});
