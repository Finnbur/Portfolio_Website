$(function () {
    const $nav = $('.nav');
    const $links = $('.nav-link');
    const $indicator = $('.nav-indicator');
    const $header = $('header');

    // Pair each nav link with the section it points to, in document order.
    const sections = $links.map(function () {
        const $link = $(this);
        const $section = $($link.attr('href'));
        return $section.length ? { link: $link, section: $section } : null;
    }).get().filter(Boolean);

    let isClickScrolling = false;
    let clickScrollTimeout = null;

    function moveIndicatorTo($link, animate = true) {
        const navLeft = $nav.offset().left;
        const linkLeft = $link.offset().left;
        const linkWidth = $link.outerWidth();

        if (!animate) $indicator.css('transition', 'none');

        $indicator.css({
            left: (linkLeft - navLeft) + 'px',
            width: linkWidth + 'px'
        });

        if (!animate) {
            $indicator[0].offsetHeight; // force reflow so the transition stays off for this update
            $indicator.css('transition', '');
        }
    }

    function setActive($link, animate = true) {
        if ($link.hasClass('active')) return;
        $links.removeClass('active');
        $link.addClass('active');
        moveIndicatorTo($link, animate);
    }

    function updateActiveOnScroll() {
        if (isClickScrolling || !sections.length) return;

        const triggerLine = $header.outerHeight() + (window.innerHeight * 0.15);
        const scrollY = window.scrollY;
        const atBottom = (scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - 2);

        let current = sections[0];
        sections.forEach(item => {
            if (item.section.offset().top <= scrollY + triggerLine) {
                current = item;
            }
        });

        // Guarantees the last link lights up even if the final section
        // is too short for its top to ever reach the trigger line.
        if (atBottom) {
            current = sections[sections.length - 1];
        }

        setActive(current.link);
    }

    function waitForScrollToSettle(callback) {
        if ('onscrollend' in window) {
            const handler = function () {
                window.removeEventListener('scrollend', handler);
                callback();
            };
            window.addEventListener('scrollend', handler);
        } else {
            clearTimeout(clickScrollTimeout);
            clickScrollTimeout = setTimeout(callback, 800);
        }
    }

    let scrollTicking = false;
    $(window).on('scroll', function () {
        if (!scrollTicking) {
            window.requestAnimationFrame(function () {
                updateActiveOnScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    $links.on('click', function () {
        setActive($(this));

        // Ignore scroll-driven updates until the smooth scroll triggered by
        // this click has settled, so the indicator doesn't jump to sections
        // it passes through on the way to the clicked one.
        isClickScrolling = true;
        waitForScrollToSettle(function () {
            isClickScrolling = false;
        });
    });

    $(window).on('resize', function () {
        const $active = $links.filter('.active').length ? $links.filter('.active') : $links.first();
        moveIndicatorTo($active, false);
    });

    setActive($links.first(), false);
    updateActiveOnScroll();
});