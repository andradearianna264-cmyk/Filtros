// Mobile menu toggle functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Image Editor Logic & Filter Application
const imageLoader = document.getElementById('imageLoader');
const imageCanvas = document.getElementById('imageCanvas');
const placeholderText = document.getElementById('placeholderText');
const activeFilterBadge = document.getElementById('activeFilterBadge');
const downloadBtn = document.getElementById('downloadBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let originalImage = null;
let currentFilter = 'none';

if (imageCanvas) {
    const ctx = imageCanvas.getContext('2d');

    // Listen for image upload
    imageLoader.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                originalImage = img;
                imageCanvas.width = img.width;
                imageCanvas.height = img.height;
                
                placeholderText.classList.add('hidden');
                imageCanvas.classList.remove('hidden');
                activeFilterBadge.classList.remove('hidden');

                applyFilterAndDraw();
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    });

    // Filter button clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('border-blue-600', 'bg-blue-50'));
            btn.classList.add('border-blue-600', 'bg-blue-50');
            currentFilter = btn.getAttribute('data-filter');
            
            const filterNames = {
                'none': 'Ninguno',
                'meta-glasses': 'Meta Glasses by LISA',
                'talking-cat': 'Talking Cat',
                'banana-bigote': 'Banana con Bigote',
                'face-warp': 'Face Warp',
                'funny-face': 'Funny Face'
            };
            activeFilterBadge.textContent = `Filtro: ${filterNames[currentFilter]}`;

            if (originalImage) {
                applyFilterAndDraw();
            }
        });
    });

    // Apply filters to canvas
    function applyFilterAndDraw() {
        if (!originalImage) return;

        // Clear canvas and draw original image
        ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        ctx.drawImage(originalImage, 0, 0);

        const w = imageCanvas.width;
        const h = imageCanvas.height;

        if (currentFilter === 'none') {
            return;
        }

        ctx.save();

        if (currentFilter === 'meta-glasses') {
            // Meta Glasses by LISA overlay simulation
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = Math.max(4, w * 0.015);
            ctx.fillStyle = 'rgba(2, 132, 199, 0.3)';
            
            const centerX = w / 2;
            const centerY = h * 0.4;
            const glassWidth = w * 0.4;
            const glassHeight = h * 0.12;

            ctx.beginPath();
            ctx.roundRect(centerX - glassWidth/2, centerY - glassHeight/2, glassWidth, glassHeight, 20);
            ctx.fill();
            ctx.stroke();

            // Glow badge
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.max(14, w * 0.03)}px Inter, sans-serif`;
            ctx.fillText('LISA x META', centerX - (w * 0.08), centerY - glassHeight);

        } else if (currentFilter === 'talking-cat') {
            // Talking Cat ears & whiskers simulation
            const centerX = w / 2;
            const centerY = h * 0.35;

            ctx.fillStyle = '#0f172a';
            // Left ear
            ctx.beginPath();
            ctx.moveTo(centerX - w * 0.2, centerY);
            ctx.lineTo(centerX - w * 0.3, centerY - h * 0.2);
            ctx.lineTo(centerX - w * 0.1, centerY - h * 0.1);
            ctx.fill();

            // Right ear
            ctx.beginPath();
            ctx.moveTo(centerX + w * 0.2, centerY);
            ctx.lineTo(centerX + w * 0.3, centerY - h * 0.2);
            ctx.lineTo(centerX + w * 0.1, centerY - h * 0.1);
            ctx.fill();

            ctx.fillStyle = '#0284c7';
            ctx.font = `bold ${Math.max(16, w * 0.035)}px Inter, sans-serif`;
            ctx.fillText('🐾 Meow!', centerX - (w * 0.05), centerY - h * 0.15);

        } else if (currentFilter === 'banana-bigote') {
            // Banana with Bigote simulation
            const centerX = w / 2;
            const centerY = h * 0.55;

            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, w * 0.12, h * 0.04, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#eab308';
            ctx.font = `bold ${Math.max(16, w * 0.04)}px Inter, sans-serif`;
            ctx.fillText('🍌 ✨', centerX - (w * 0.05), centerY - h * 0.15);

        } else if (currentFilter === 'face-warp') {
            // Face Warp color tint effect simulation
            ctx.fillStyle = 'rgba(147, 51, 234, 0.2)';
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.max(20, w * 0.05)}px Inter, sans-serif`;
            ctx.fillText('🤪 FACE WARP', w * 0.05, h * 0.1);

        } else if (currentFilter === 'funny-face') {
            // Funny Face neon vibe
            ctx.fillStyle = 'rgba(2, 132, 199, 0.25)';
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.max(20, w * 0.05)}px Inter, sans-serif`;
            ctx.fillText('😂 FUNNY FACE', w * 0.05, h * 0.1);
        }

        ctx.restore();
    }

    // Download image functionality
    downloadBtn.addEventListener('click', () => {
        if (!originalImage) {
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-5 right-5 bg-red-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 font-semibold text-sm animate-bounce';
            notification.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-2"></i> Por favor carga una imagen primero.';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
            return;
        }

        const link = document.createElement('a');
        link.download = `cool-filter-${currentFilter}.png`;
        link.href = imageCanvas.toDataURL('image/png');
        link.click();
    });
}