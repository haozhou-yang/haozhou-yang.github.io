// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
(function () {
    var themeStorageKey = 'haozhou-theme';
    var themeToggle = document.getElementById('theme-toggle');
    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

    function getSavedTheme() {
        try {
            var savedTheme = localStorage.getItem(themeStorageKey);
            return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null;
        } catch (error) {
            return null;
        }
    }

    function applyTheme(theme, savePreference) {
        document.documentElement.setAttribute('data-theme', theme);

        var themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#f8f9fa');
        }

        if (themeToggle) {
            var nextThemeName = theme === 'dark' ? 'light' : 'dark';
            var icon = themeToggle.querySelector('i');
            themeToggle.setAttribute('aria-label', 'Switch to ' + nextThemeName + ' mode');
            themeToggle.setAttribute('title', 'Switch to ' + nextThemeName + ' mode');
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        if (savePreference) {
            try {
                localStorage.setItem(themeStorageKey, theme);
            } catch (error) {
                // The selected theme still applies for the current page.
            }
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
        });
    }

    var savedTheme = getSavedTheme();
    applyTheme(savedTheme || (systemTheme.matches ? 'dark' : 'light'), false);

    function followSystemTheme(event) {
        if (!getSavedTheme()) {
            applyTheme(event.matches ? 'dark' : 'light', false);
        }
    }

    if (systemTheme.addEventListener) {
        systemTheme.addEventListener('change', followSystemTheme);
    } else if (systemTheme.addListener) {
        systemTheme.addListener(followSystemTheme);
    }
}());

$(function () {
    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()

    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });
})
