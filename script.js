document.addEventListener('DOMContentLoaded', () => {
    
    // 1. БАЗА ДАННЫХ ГОСТЕЙ
    const guestList = {
        "1": "Азизбек ва Комила",
        "2": "Сардор",
        "3": "Умид ака ва оиласи",
        "4": "Дониёр",
        "5": "Мадина"
    };

    const urlParams = new URLSearchParams(window.location.search);
    const guestId = urlParams.get('id'); 
    
    const welcomeScreen = document.getElementById('welcome-screen');
    const errorScreen = document.getElementById('error-screen');

    if (guestId && guestList[guestId]) {
        const guestName = guestList[guestId];
        document.getElementById('welcome-guest-text').innerText = `Ҳурматли ${guestName}!`;
        document.getElementById('personal-greeting').innerText = `Ҳурматли ${guestName}!`;
    } else {
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (errorScreen) {
            errorScreen.classList.remove('hidden');
            errorScreen.style.display = 'flex';
        }
        return; 
    }

    // 2. ОТКРЫТИЕ ПРИГЛАШЕНИЯ
    const startBtn = document.getElementById('startBtn');
    const mainContent = document.getElementById('main-content');
    const audio = document.getElementById('bgMusic');

    startBtn.addEventListener('click', () => {
        const rect = startBtn.getBoundingClientRect();
        burstButterflies(rect.left + rect.width / 2, rect.top + rect.height / 2);

        // ИСПРАВЛЕНИЕ: Мгновенно разрешаем свайп сквозь исчезающий экран!
        welcomeScreen.style.pointerEvents = 'none';
        welcomeScreen.style.opacity = '0';
        mainContent.classList.remove('hidden');
        
        audio.play().catch(() => {
            console.log("Браузер заблокировал автовоспроизведение аудио.");
        });
        
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            document.body.classList.add('reveal-names'); 
            initSakura(); 
        }, 1000);
    });

    // 3. АНИМАЦИЯ БАБОЧЕК
    function burstButterflies(x, y) {
        for (let i = 0; i < 20; i++) {
            const butterfly = document.createElement('div');
            butterfly.className = 'butterfly';
            butterfly.style.left = x + 'px';
            butterfly.style.top = y + 'px';
            
            const dx = (Math.random() - 0.5) * 500; 
            const dy = (Math.random() - 0.9) * 700; 
            const rotation = Math.random() * 360;   
            
            butterfly.style.setProperty('--x', dx + 'px');
            butterfly.style.setProperty('--y', dy + 'px');
            butterfly.style.setProperty('--r', rotation + 'deg');
            
            document.body.appendChild(butterfly);
            setTimeout(() => butterfly.remove(), 2500);
        }
    }

    // 4. ПАДАЮЩАЯ САКУРА
    function initSakura() {
        const canvas = document.getElementById('sakura-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const appContainer = document.getElementById('mobile-app');
        
        canvas.width = appContainer.clientWidth;
        canvas.height = appContainer.clientHeight;

        const petals = [];
        for (let i = 0; i < 60; i++) {
            petals.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 6 + 6,     
                speedY: Math.random() * 1.5 + 1, 
                speedX: Math.random() * 2 - 1,   
                angle: Math.random() * 360,      
                spin: Math.random() * 2 - 1,     
                wind: Math.random() * 0.03       
            });
        }

        function animateSakura() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(p => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle * Math.PI / 180);
                
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(p.size, -p.size, p.size * 2, p.size, 0, p.size);
                ctx.bezierCurveTo(-p.size * 2, p.size, -p.size, -p.size, 0, 0);
                
                ctx.fillStyle = 'rgba(255, 192, 203, 0.7)';
                ctx.fill();
                ctx.restore();

                p.y += p.speedY;
                p.x += Math.sin(p.y * p.wind) * 1.5; 
                p.angle += p.spin;

                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
            });
            requestAnimationFrame(animateSakura);
        }
        animateSakura();
    }

    // 5. ТАЙМЕР
    const targetDate = new Date('May 2, 2026 11:00:00').getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) return;

        document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        document.getElementById('hours').innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        document.getElementById('minutes').innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        document.getElementById('seconds').innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }, 1000);

    // 6. СКРОЛЛ АНИМАЦИЯ
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('appear');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});
