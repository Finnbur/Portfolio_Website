function getDefaultPrimaryColor() {
    return getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-color')
        .trim() || '#FFCD00';
}

function createProjectItem({
    title,
    text,
    image,
    imageAlt = '',
    githubLink,
    titleColor,
    imageSide = 'left'
}) {
    const color = titleColor || getDefaultPrimaryColor();
    const $item = $('<div class="project-item"></div>').attr('data-color', color);

    const $info = $('<div class="project-info"></div>').html(`
        <h3 style="color: ${color};">${title}</h3>
        <p>${text}</p>
        <a href="${githubLink}" class="project-link" target="_blank" rel="noopener noreferrer">View on GitHub &rarr;</a>
    `);

    const $image = $('<div class="project-image"></div>').html(
        `<img src="${image}" alt="${imageAlt}">`
    );

    // Source order determines left/right because .project-item is a flex row
    if (imageSide === 'right') {
        $item.append($info, $image);
    } else {
        $item.append($image, $info);
    }

    return $item;
}

/**
 * Renders a list of projects into a container.
 * @param {Array<Object>} projects
 * @param {string} [containerSelector='.project-list']
 */
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
        // Only the middle band of the viewport counts toward "active" —
        // tweak these percentages to make a section trigger earlier/later.
        rootMargin: '-35% 0px -35% 0px'
    });

    items.forEach(item => observer.observe(item));
}

$(function () {
    const projects = [
        {
            title: 'GamePlanner',
            text: 'Information about GamePlanner.',
            image: 'img/gamePlanner.png',
            imageAlt: 'GamePlanner preview',
            githubLink: 'https://github.com/ihartdiscopolo/GamePlanner',
            titleColor: '#62CC6F',
            imageSide: 'right'
        },
        {
            title: 'Escapetalk',
            text: 'Information about Escapetalk.',
            image: 'img/escapetalk.png',
            imageAlt: 'Escapetalk preview',
            githubLink: 'https://github.com/username/escapetalk',
            titleColor: '#ec4040',
            imageSide: 'left'
        },
        {
            title: 'Coincap',
            text: 'Information about Coincap.',
            image: 'img/coinCap.png',
            imageAlt: 'Coincap preview',
            githubLink: 'https://github.com/username/coincap',
            titleColor: '#2b76e6',
            imageSide: 'right'
        },
        {
            title: 'Guess the number',
            text: 'Information about Guess the number.',
            image: 'img/guessTheNumber.png',
            imageAlt: 'Guess the number preview',
            githubLink: 'https://github.com/username/guessthenumber',
            titleColor: '#2b76e6',
            imageSide: 'left'
        },
        {
            title: 'Dnd Above and Beyond',
            text: 'Information about Dnd Above and Beyond.',
            image: 'images/dndabovebeyond.png',
            imageAlt: 'Dnd Above and Beyond preview',
            githubLink: 'https://github.com/username/dndabovebeyond',
            imageSide: 'right'
        }
    ];

    renderProjects(projects);
    syncPrimaryColorOnScroll();
});