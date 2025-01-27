document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('.search-icon');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-expanded');
        searchIcon.classList.toggle('active');
    }

    // Initialize sidebar state
    if (!sidebar.classList.contains('collapsed')) {
        mainContent.classList.add('sidebar-expanded');
    }

    searchIcon.addEventListener('click', toggleSidebar);

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

    // Make gallery window draggable
    const galleryHeader = galleryWindow.querySelector('.window-controls');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    galleryHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === galleryHeader) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            
            galleryWindow.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
});
