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
                makeActive(window); // Make window active when starting to drag
            }
        });

        document.addEventListener('mousemove', e => {
            if (isDragging) {
                e.preventDefault();
                
                // Calculate new position
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // Get viewport dimensions
                const viewportWidth = document.documentElement.clientWidth;
                const viewportHeight = document.documentElement.clientHeight;
                const taskbarHeight = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--taskbar-height'));

                // Get window dimensions and position
                const rect = window.getBoundingClientRect();
                
                // Calculate absolute position including transform
                const absoluteX = rect.left + (currentX - xOffset);
                const absoluteY = rect.top + (currentY - yOffset);

                // Apply boundaries based on absolute position
                if (absoluteX < 0) currentX -= absoluteX;
                if (absoluteX + rect.width > viewportWidth) {
                    currentX += viewportWidth - (absoluteX + rect.width);
                }
                if (absoluteY < 0) currentY -= absoluteY;
                if (absoluteY + rect.height > viewportHeight - taskbarHeight) {
                    currentY += (viewportHeight - taskbarHeight) - (absoluteY + rect.height);
                }

                xOffset = currentX;
                yOffset = currentY;

                window.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            window.style.cursor = 'default';
        });

        // Add double-click to reset position
        header.addEventListener('dblclick', e => {
            if (e.target === header || e.target.classList.contains('window-title')) {
                resetWindowPosition(window);
            }
        });
    }

    function resetWindowPosition(window) {
        // Calculate center position
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = document.documentElement.clientHeight;
        const xPos = (viewportWidth * 0.2); // 20% from left
        const yPos = (viewportHeight * 0.2); // 20% from top
        
        window.style.transform = `translate(${xPos}px, ${yPos}px)`;
        window.style.width = '80%';
        window.style.height = null;
        makeActive(window);
    }

    // Add context menu for reset option
    document.addEventListener('contextmenu', e => {
        const header = e.target.closest('.window-controls');
        if (header) {
            e.preventDefault();
            const window = header.closest('.app-window, .main-content, .gallery-window, .sidebar');
            resetWindowPosition(window);
        }
    });

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

    // Window management
    const appIcons = document.querySelector('.app-icons');
    
    // Handle nav link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.currentTarget.getAttribute('href').substring(1);
            
            // Special case for About Me link
            if (href === 'about') {
                const mainWindow = document.querySelector('.main-content');
                mainWindow.classList.remove('hidden');
                makeActive(mainWindow);
                
                // Remove taskbar icon if it exists
                const taskbarIcon = document.querySelector('.app-taskbar-icon[data-window="About Me"]');
                if (taskbarIcon) {
                    taskbarIcon.remove();
                }
                return;
            }
            
            // Handle other windows
            const windowClass = href + '-window';
            const window = document.querySelector(`.${windowClass}`);
            if (window) {
                window.classList.remove('hidden');
                makeActive(window);
            }
        });
    });

    // Handle window controls
    document.querySelectorAll('.app-window').forEach(window => {
        const minBtn = window.querySelector('.minimize');
        const maxBtn = window.querySelector('.maximize');
        const closeBtn = window.querySelector('.close');
        const windowName = window.dataset.windowName;
        const icon = window.querySelector('.nav-icon')?.src || 'logo.png';

        if (minBtn) {
            minBtn.addEventListener('click', () => minimizeWindow(window, windowName, icon));
        }
        if (maxBtn) {
            maxBtn.addEventListener('click', () => maximizeWindow(window));
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeWindow(window));
        }
        
        makeDraggable(window);
    });

    // Add the main profile window to the window controls handling
    const mainWindow = document.querySelector('.main-content');
    const mainMinBtn = mainWindow.querySelector('.minimize');
    const mainMaxBtn = mainWindow.querySelector('.maximize');
    const mainCloseBtn = mainWindow.querySelector('.close');
    
    if (mainMinBtn) {
        mainMinBtn.addEventListener('click', () => minimizeWindow(mainWindow, 'About Me', 'logo.png'));
    }
    if (mainMaxBtn) {
        mainMaxBtn.addEventListener('click', () => maximizeWindow(mainWindow));
    }
    if (mainCloseBtn) {
        mainCloseBtn.addEventListener('click', () => closeWindow(mainWindow));
    }

    function minimizeWindow(window, windowName, iconSrc) {
        window.classList.add('hidden');
        
        // Create taskbar icon if it doesn't exist
        let taskbarIcon = document.querySelector(`.app-taskbar-icon[data-window="${windowName}"]`);
        if (!taskbarIcon) {
            taskbarIcon = document.createElement('button');
            taskbarIcon.className = 'app-taskbar-icon';
            taskbarIcon.dataset.window = windowName;
            taskbarIcon.innerHTML = `
                <img src="${iconSrc}" alt="${windowName}">
                <span>${windowName}</span>
            `;
            taskbarIcon.addEventListener('click', () => {
                window.classList.remove('hidden');
                makeActive(window);
                taskbarIcon.remove();
            });
            appIcons.appendChild(taskbarIcon);
        }
    }

    function closeWindow(window) {
        window.classList.add('hidden');
        const taskbarIcon = document.querySelector(
            `.app-taskbar-icon[data-window="${window.dataset.windowName}"]`
        );
        if (taskbarIcon) {
            taskbarIcon.remove();
        }
    }

    function maximizeWindow(window) {
        const taskbarHeight = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--taskbar-height'));
            
        if (window.style.width === '100%') {
            // Restore previous position
            window.style.width = '80%';
            window.style.height = '60%';
            window.style.top = '20%';
            window.style.left = '20%';
            
            // Re-enable transform for dragging
            window.style.transform = null;
        } else {
            // Save current position if needed for restore
            
            // Reset transform and set to full size
            window.style.transform = 'none';
            window.style.width = '100%';
            window.style.height = `calc(100vh - ${taskbarHeight}px)`;
            window.style.top = '0';
            window.style.left = '0';
        }
        
        makeActive(window);
    }

    function makeActive(window) {
        const maxZ = Math.max(...Array.from(document.querySelectorAll('.app-window'))
            .map(w => parseInt(getComputedStyle(w).zIndex) || 0));
        window.style.zIndex = maxZ + 1;
    }
});
