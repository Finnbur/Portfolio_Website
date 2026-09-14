$(function () {
    const $nav = $('.nav');
    const $links = $('.nav-link');
    const $indicator = $('.nav-indicator');

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
            $indicator[0].offsetHeight
            $indicator.css('transition', '');
        }
    }

    function setActive($link, animate = true) {
        $links.removeClass('active');
        $link.addClass('active');
        moveIndicatorTo($link, animate);
    }

    $links.on('click', function () {
        setActive($(this));
    });

    $(window).on('resize', function () {
        const $active = $links.filter('.active').length ? $links.filter('.active') : $links.first();
        moveIndicatorTo($active, false);
    });

    setActive($links.first(), false);
});