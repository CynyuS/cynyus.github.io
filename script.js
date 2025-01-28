document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.querySelector('.start-button');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-expanded');
        startButton.classList.toggle('active');
    }

    // Initialize sidebar state
    if (!sidebar.classList.contains('collapsed')) {
        mainContent.classList.add('sidebar-expanded');
    }

    startButton.addEventListener('click', toggleSidebar);

    // Add event listener for sidebar minimize button
    const sidebarMinimizeBtn = document.getElementById('toggle-sidebar');
    sidebarMinimizeBtn.addEventListener('click', toggleSidebar);

    // Add clock functionality
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit'
        });
        document.querySelector('.clock').textContent = timeString;
    }
    
    setInterval(updateClock, 1000);
    updateClock();

    // Add gallery functionality
    const galleryIcon = document.querySelector('.gallery-icon');
    const galleryWindow = document.querySelector('.gallery-window');
    const galleryCloseBtn = galleryWindow.querySelector('.close');

    function toggleGallery() {
        galleryWindow.classList.toggle('hidden');
        galleryIcon.classList.toggle('active');
    }

    galleryIcon.addEventListener('click', toggleGallery);
    galleryCloseBtn.addEventListener('click', toggleGallery);

    // Draggable window functionality
    function makeDraggable(window) {
        const header = window.querySelector('.window-controls');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        // Get initial position if already transformed
        const existingTransform = window.style.transform;
        if (existingTransform) {
            const match = existingTransform.match(/translate\((-?\d+)px,\s*(-?\d+)px\)/);
            if (match) {
                xOffset = parseInt(match[1]);
                yOffset = parseInt(match[2]);
            }
        }

        header.addEventListener('mousedown', e => {
            if (e.target === header || e.target.classList.contains('window-title')) {
                isDragging = true;
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                window.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', e => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                window.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            window.style.cursor = 'default';
        });
    }

    // Make all windows draggable
    const windows = [
        document.querySelector('.main-content'),
        document.querySelector('.sidebar'),
        document.querySelector('.gallery-window')
    ];

    windows.forEach(window => {
        if (window) {
            window.style.position = 'fixed';  // Ensure windows can be dragged
            makeDraggable(window);
        }
    });
});
