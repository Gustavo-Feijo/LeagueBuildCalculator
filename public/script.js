document.addEventListener('DOMContentLoaded', function () {

    const bodyContainer = document.querySelector('.body');

    //Fetch all the champions from the directory.
    fetch('/api/champions')
        .then(response => response.json())
        .then(championsData => {
            championsData.forEach(champion => {

                const championContainer = document.createElement('div');

                //Gets the data for each champion.
                const key = Object.keys(champion['data'])[0];
                const data = champion['data'][key];
                championContainer.classList.add('champion-container');

                //Create the champion image and use the image provided via public/ to show the champion.
                const championImage = document.createElement('img');
                championImage.classList.add('champion-image');
                championImage.src = `championsImages/${data.image.full}`;


                const championName = document.createElement('div');
                championName.classList.add('champion-name');
                championName.textContent = data.name;

                championContainer.appendChild(championImage);
                championContainer.appendChild(championName);

                //Add the redirect for the champion URL, with the URL being the champion name without any spaces.
                championContainer.addEventListener('click', function (event) {
                    event.preventDefault();
                    const championName = championContainer.querySelector('.champion-name').textContent.replace(/\s/g, "");;
                    window.location.href = '/' + encodeURIComponent(championName);
                });

                //Adds the current champion to the list.
                bodyContainer.appendChild(championContainer);
            });
        })
        .catch(error => console.error('Error fetching champion data:', error));
});

//Make the champion visible if the search term matches the champion name, being handled every single time the input is changed.
function handleSearch(input) {

    let championContainers = document.getElementsByClassName('champion-container');
    Array.from(championContainers).forEach(championContainer => {
        
        let championName = championContainer.querySelector('.champion-name').textContent.toLowerCase();

        if (!championName.startsWith(input.toLowerCase())) {
            championContainer.style.display = 'none';
        } else {
            championContainer.style.display = 'flex';
        }
    });
}



