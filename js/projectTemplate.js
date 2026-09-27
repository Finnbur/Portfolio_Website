function getDefaultPrimaryColor() {
    return getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-color')
        .trim() || '#FFCD00';
}

function buildSlideImages(imageBase, imageCount = 3, imageExt = 'png') {
    return Array.from({ length: imageCount }, (_, i) => `${imageBase}${i}.${imageExt}`);
}

function createSlideshow(images, imageAlt = '') {
    const $slideshow = $('<div class="project-slideshow"></div>');
    const $track = $('<div class="slideshow-track"></div>');

    images.forEach((src, i) => {
        $track.append(
            $('<img>')
                .attr('src', src)
                .attr('alt', imageAlt)
                .addClass('slide')
                .toggleClass('active', i === 0)
        );
    });

    const $dots = $('<div class="slide-dots"></div>');
    images.forEach((_, i) => {
        $dots.append(
            $('<span class="dot"></span>')
                .toggleClass('active', i === 0)
                .attr('data-index', i)
        );
    });

    const $prev = $('<button type="button" class="slide-nav slide-prev" aria-label="Previous image">&#10094;</button>');
    const $next = $('<button type="button" class="slide-nav slide-next" aria-label="Next image">&#10095;</button>');

    $slideshow.append($track, $prev, $next, $dots);

    let current = 0;
    let timer = null;

    function goTo(index) {
        current = (index + images.length) % images.length;
        $track.children('.slide').removeClass('active').eq(current).addClass('active');
        $dots.children('.dot').removeClass('active').eq(current).addClass('active');
    }

    function next() { goTo(current + 1); }
    function prevSlide() { goTo(current - 1); }

    $next.on('click', () => { next(); });
    $prev.on('click', () => { prevSlide(); });
    $dots.on('click', '.dot', function () {
        goTo(Number($(this).data('index')));
    });

    return $slideshow;
}

function createProjectItem({
    title,
    text,
    languages,
    image,
    imageCount = 3,
    imageExt = 'png',
    imageAlt = '',
    githubLink,
    websiteLink,
    titleColor,
    imageSide = 'left'
}) {
    const color = titleColor || getDefaultPrimaryColor();
    const $item = $('<div class="project-item"></div>').attr('data-color', color);

    const $info = $('<div class="project-info"></div>').html(`
        <h3 style="color: ${color};">${title}</h3>
        <span>${languages}</span>
        <p>${text}</p>
    `);

    if (githubLink) {
    $info.append($(`<a href="${githubLink}" style="color: ${color};" class="project-link" target="_blank" rel="noopener noreferrer">Bekijk op GitHub &rarr;</a>`))
    }
    if (websiteLink) {
        $info.append($(`<a href="${websiteLink}" style="color: ${color};" class="project-link" target="_blank" rel="noopener noreferrer">Bekijk live website &rarr;</a>`))
    }

    const images = buildSlideImages(image, imageCount, imageExt);
    const $imageWrap = $('<div class="project-image"></div>').append(createSlideshow(images, imageAlt));

    if (imageSide === 'right') {
        $item.append($info, $imageWrap);
    } else {
        $item.append($imageWrap, $info);
    }

    return $item;
}

function renderProjects(projects, containerSelector = '.project-list') {
    const $container = $(containerSelector);
    if (!$container.length) return;

    $container.empty();
    projects.forEach(project => {
        $container.append(createProjectItem(project));
    });
}

function syncPrimaryColorOnScroll({
    itemSelector = '.project-item',
    root = document.documentElement
} = {}) {
    const items = document.querySelectorAll(itemSelector);
    if (!items.length || !('IntersectionObserver' in window)) return;

    const defaultColor = getDefaultPrimaryColor();
    const ratios = new Map(Array.from(items, item => [item, 0]));

    const applyActiveColor = () => {
        let bestItem = null;
        let bestRatio = 0;
        ratios.forEach((ratio, item) => {
            if (ratio > bestRatio) {
                bestRatio = ratio;
                bestItem = item;
            }
        });
        root.style.setProperty('--primary-color', bestItem ? bestItem.dataset.color : defaultColor);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => ratios.set(entry.target, entry.intersectionRatio));
        applyActiveColor();
    }, {
        threshold: Array.from({ length: 21 }, (_, i) => i / 20),
        rootMargin: '-35% 0px -35% 0px'
    });

    items.forEach(item => observer.observe(item));
}

$(function () {
    const projects = [
        { 
            title: 'GamePlanner', 
            languages: '#Twig, #SCSS, #PHP, #MySQL, #JS(jQeury), #Ajax',
            text: 'GamePlanner is een gamified huishoudplanner, je voltooit taken om punten te verdienen, die je kan inwisselen voor mini-games. Het project is gebouwd door een team van web en game developers. Mijn rol was de backend, een eigen PHP framework en de styling van de website, inclusief alle SVG-iconen heb ik ontworpen.',
            image: 'img/gamePlanner', 
            imageAlt: 'GamePlanner preview', 
            githubLink: 'https://github.com/ihartdiscopolo/GamePlanner', 
            titleColor: '#62CC6F', 
            imageSide: 'right' 
        },
        { 
            title: 'Escapetalk', 
            languages: '#Twig, #SCSS, #PHP, #Bitbucket, #JavaScript, #Ajax',
            text: 'Information about Escapetalk.', 
            image: 'img/escapetalk', 
            imageAlt: 'Escapetalk preview', 
            websiteLink: 'https://escapetalk.nl', 
            titleColor: '#ec4040', 
            imageSide: 'left' 
        },
        { 
            title: 'Coincap', 
            text: 'Information about Coincap.', 
            image: 'img/coinCap', 
            imageAlt: 'Coincap preview', 
            githubLink: 'https://github.com/Finnbur/Coin-cap', 
            titleColor: '#497ecc', 
            imageSide: 'right' 
        },
        { 
            title: 'Guess the number', 
            text: 'Information about Guess the number.', 
            image: 'img/guessTheNumber', 
            imageAlt: 'Guess the number preview', 
            githubLink: 'https://github.com/Finnbur/guess-the-number', 
            titleColor: '#497ecc', 
            imageSide: 'left' 
        },
        { 
            title: 'Dungeons & Monsters', 
            text: 'Information about Dungeons & Monsters.', 
            image: 'img/DNM', 
            imageAlt: 'Dungeons and Monsters preview', 
            githubLink: 'https://github.com/IvyOwO06/dnd_above_and_beyond', 
            titleColor: '#C29CE5', 
            imageSide: 'right' 
        }
    ];

    renderProjects(projects);
    syncPrimaryColorOnScroll();
});