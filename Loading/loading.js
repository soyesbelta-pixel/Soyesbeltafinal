// Loading Screen JavaScript

// Auto-hide the splash screen after page loads
window.addEventListener('load', function() {
    // Wait 4 seconds after page load
    setTimeout(function() {
        // Add hide class for fade out animation
        document.getElementById('splash').classList.add('hide');

        // Remove the splash element after animation completes
        setTimeout(function() {
            const splashElement = document.getElementById('splash');
            if (splashElement) {
                splashElement.remove();
            }
        }, 300);
    }, 4000);
});

// Optional: Hide splash on user click (for faster navigation)
document.addEventListener('DOMContentLoaded', function() {
    const splash = document.getElementById('splash');
    if (splash) {
        splash.addEventListener('click', function() {
            splash.classList.add('hide');
            setTimeout(function() {
                if (splash) {
                    splash.remove();
                }
            }, 300);
        });
    }
});

// Optional: Progress simulation (if you want to show real loading progress)
function simulateProgress() {
    let progress = 0;
    const progressBar = document.querySelector('.loading-progress');

    const interval = setInterval(function() {
        progress += 10;
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }

        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 300);
}

// Uncomment to use progress simulation
// simulateProgress();