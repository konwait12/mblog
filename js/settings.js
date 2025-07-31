// 设置面板功能
const settingsPanel = document.getElementById('settings-panel');
const toggleSettingsBtn = document.getElementById('toggle-settings');
const closeSettingsBtn = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings');

toggleSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.add('active');
});

closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.remove('active');
});

// 保存设置功能
saveSettingsBtn.addEventListener('click', () => {
    const bgImageUrl = document.getElementById('bg-image-url').value;
    const bgOpacity = document.getElementById('bg-opacity').value;
    const primaryColor = document.getElementById('primary-color').value;
    const secondaryColor = document.getElementById('secondary-color').value;
    const glassOpacity = document.getElementById('glass-opacity').value;
    const blogName = document.getElementById('blog-name').value;
    const blogDesc = document.getElementById('blog-desc').value;
    
    // 更新CSS变量
    if (bgImageUrl) {
        document.body.style.backgroundImage = `url(${bgImageUrl})`;
    }
    
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    
    // 更新玻璃态透明度
    document.documentElement.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${glassOpacity})`);
    
    // 更新博客名称和个人简介
    document.querySelector('.logo h1').textContent = blogName;
    document.querySelector('.hero p').textContent = blogDesc;
    
    // 保存设置到localStorage
    const settings = {
        bgImageUrl,
        bgOpacity,
        primaryColor,
        secondaryColor,
        glassOpacity,
        blogName,
        blogDesc
    };
    
    localStorage.setItem('kon-myblog-settings', JSON.stringify(settings));
    
    // 提示用户
    alert('设置已保存！重新访问时仍然有效。');
    settingsPanel.classList.remove('active');
});

// 预设背景选择
document.querySelectorAll('.bg-option').forEach(option => {
    option.addEventListener('click', () => {
        const bg = option.getAttribute('data-bg');
        document.body.style.background = bg;
        document.body.style.backgroundImage = 'none';
        document.getElementById('bg-image-url').value = '';
        
        // 保存到设置
        const settings = JSON.parse(localStorage.getItem('kon-myblog-settings') || '{}');
        settings.bgImageUrl = '';
        localStorage.setItem('kon-myblog-settings', JSON.stringify(settings));
    });
});

// 加载保存的设置
function loadSettings() {
    const savedSettings = localStorage.getItem('kon-myblog-settings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // 应用设置
        if (settings.bgImageUrl) {
            document.body.style.backgroundImage = `url(${settings.bgImageUrl})`;
        }
        
        if (settings.bgOpacity) {
            document.documentElement.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${settings.bgOpacity})`);
        }
        
        if (settings.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        }
        
        if (settings.secondaryColor) {
            document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
        }
        
        if (settings.glassOpacity) {
            document.documentElement.style.setProperty('--glass-bg', `rgba(255, 255, 255, ${settings.glassOpacity})`);
        }
        
        if (settings.blogName) {
            document.querySelector('.logo h1').textContent = settings.blogName;
        }
        
        if (settings.blogDesc) {
            document.querySelector('.hero p').textContent = settings.blogDesc;
        }
        
        // 更新表单中的值
        document.getElementById('bg-image-url').value = settings.bgImageUrl || '';
        document.getElementById('bg-opacity').value = settings.bgOpacity || 0.7;
        document.getElementById('primary-color').value = settings.primaryColor || '#4e54c8';
        document.getElementById('secondary-color').value = settings.secondaryColor || '#8f94fb';
        document.getElementById('glass-opacity').value = settings.glassOpacity || 0.15;
        document.getElementById('blog-name').value = settings.blogName || 'kon-myblog';
        document.getElementById('blog-desc').value = settings.blogDesc || '网络安全小白，探索技术的边界，分享学习的旅程';
    }
}

// 初始化设置
document.addEventListener('DOMContentLoaded', loadSettings);