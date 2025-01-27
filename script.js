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
});
