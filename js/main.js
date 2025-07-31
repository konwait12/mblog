// 初始化动态背景
function createDynamicBackground() {
    const dynamicBg = document.getElementById('dynamic-bg');
    dynamicBg.innerHTML = '';
    
    for (let i = 0; i < 15; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        
        // 随机大小和位置
        const size = Math.random() * 100 + 50;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.left = `${posX}%`;
        circle.style.top = `${posY}%`;
        
        // 随机动画
        const animationDuration = Math.random() * 20 + 10;
        circle.style.animation = `float ${animationDuration}s infinite ease-in-out`;
        circle.style.animationDelay = `${Math.random() * 5}s`;
        
        dynamicBg.appendChild(circle);
    }
    
    // 添加浮动动画关键帧
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes float {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// 初始化平滑滚动
function initSmoothScrolling() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // 更新活动链接
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

// 加载个人资料
function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('kon-myblog-profile')) || {
        name: '网络安全小白',
        title: '网络安全爱好者',
        bio: '通过这个博客，我希望分享我的学习旅程、发现的安全技巧以及遇到的有趣挑战。我相信网络安全是每个人的责任，而教育是提高安全意识的第一步。',
        skills: ['网络安全基础', '密码学入门', 'Web安全', 'Linux系统', 'Python编程', 'CTF竞赛'],
        avatar: 'images/default-avatar.jpg'
    };
    
    // 更新DOM
    document.getElementById('profile-avatar').src = profile.avatar;
    document.getElementById('profile-name').value = profile.name;
    document.getElementById('profile-title').value = profile.title;
    document.getElementById('profile-bio').value = profile.bio;
    document.getElementById('profile-description').textContent = profile.bio;
    
    // 加载技能
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    profile.skills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.classList.add('skill-tag');
        skillTag.textContent = skill;
        skillsContainer.appendChild(skillTag);
    });
}

// 保存个人资料
function saveProfile() {
    const profile = {
        name: document.getElementById('profile-name').value,
        title: document.getElementById('profile-title').value,
        bio: document.getElementById('profile-bio').value,
        skills: Array.from(document.querySelectorAll('.skill-tag')).map(tag => tag.textContent),
        avatar: document.getElementById('profile-avatar').src
    };
    
    localStorage.setItem('kon-myblog-profile', JSON.stringify(profile));
    alert('个人信息已保存！');
    
    // 更新简介显示
    document.getElementById('profile-description').textContent = profile.bio;
}

// 更换头像
function changeAvatar() {
    const avatarUrl = prompt('请输入新头像的URL:');
    if (avatarUrl) {
        document.getElementById('profile-avatar').src = avatarUrl;
        
        // 保存到个人资料
        const profile = JSON.parse(localStorage.getItem('kon-myblog-profile')) || {};
        profile.avatar = avatarUrl;
        localStorage.setItem('kon-myblog-profile', JSON.stringify(profile));
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    createDynamicBackground();
    initSmoothScrolling();
    loadProfile();
    
    // 事件监听器
    document.getElementById('save-profile-btn').addEventListener('click', saveProfile);
    document.getElementById('change-avatar-btn').addEventListener('click', changeAvatar);
    
    // 初始化博客
    loadBlogs();
});