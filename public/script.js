document.getElementById('btn-search').addEventListener('click', function (event) {
    event.preventDefault();

    const searchQuery = document.getElementById('search-input').value;

    window.location.href = '/' + encodeURIComponent(searchQuery);
});
document.addEventListener('DOMContentLoaded', function () {
    const bodyContainer = document.querySelector('.body');

    fetch('/api/champions')
        .then(response => response.json())
        .then(championsData => {
            championsData.forEach(champion => {
                const championContainer = document.createElement('div');
                championContainer.classList.add('champion-container');
                championContainer.addEventListener('click', function (event) {
                    event.preventDefault();
                    const championName = championContainer.querySelector('.champion-name').textContent;
                    window.location.href = '/' + encodeURIComponent(championName);
                });

                const championImage = document.createElement('img');
                championImage.classList.add('champion-image');
                championImage.src = `championsImages/${champion.name}.png`;

                const championName = document.createElement('div');
                championName.classList.add('champion-name');
                championName.textContent = champion.name;

                championContainer.appendChild(championImage);
                championContainer.appendChild(championName);

                bodyContainer.appendChild(championContainer);
            });
        })
        .catch(error => console.error('Error fetching champion data:', error));
});
function handleSearch(input) {
    let championContainers = document.getElementsByClassName('champion-container');

    Array.from(championContainers).forEach(championContainer => {
        let championName = championContainer.querySelector('.champion-name').textContent;
        if (!championName.startsWith(input)) {
            championContainer.style.display = 'none';
        } else {
            championContainer.style.display = 'flex'; 
        }
    });
}



