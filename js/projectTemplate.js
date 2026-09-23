function createProjectItem({
    title,
    text,
    image,
    imageAlt = '',
    githubLink,
    imageSide = 'left'
}) {
    const $item = $('<div class="project-item"></div>');

    const $info = $('<div class="project-info"></div>').html(`
        <h3>${title}</h3>
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

// ---- Example usage (run once the DOM is ready) ----
$(function () {
    const projects = [
        {
            title: 'GamePlanner',
            text: 'Information about GamePlanner.',
            image: 'img/gamePlanner.png',
            imageAlt: 'GamePlanner preview',
            githubLink: 'https://github.com/username/gameplanner',
            imageSide: 'right'
        },
        {
            title: 'Escapetalk',
            text: 'Information about Escapetalk.',
            image: 'img/escapetalk.png',
            imageAlt: 'Escapetalk preview',
            githubLink: 'https://github.com/username/escapetalk',
            imageSide: 'left'
        },
        {
            title: 'Coincap',
            text: 'Information about Coincap.',
            image: 'images/coincap.png',
            imageAlt: 'Coincap preview',
            githubLink: 'https://github.com/username/coincap',
            imageSide: 'right'
        },
        {
            title: 'Guess the number',
            text: 'Information about Guess the number.',
            image: 'images/guessthenumber.png',
            imageAlt: 'Guess the number preview',
            githubLink: 'https://github.com/username/guessthenumber',
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
});