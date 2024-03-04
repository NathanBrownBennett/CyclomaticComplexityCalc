document.addEventListener('DOMContentLoaded', (event) => {
    const CCCalc = document.getElementById('CCCalc');
    const ONCalc = document.getElementById('ONCalc');
    const LineCounter = document.getElementById('LineCounter');
    const SuperMetric = document.getElementById('SuperMetric');
    const uploadOverlay = document.getElementById('uploadOverlay');
    const closeButton = document.querySelector('.close-button');
    const uploadTitle = document.querySelector('#uploadForm h2');

    const closeUploadForm = () => {
        uploadOverlay.style.display = 'none';
    };

    closeButton.addEventListener('click', () => {
        console.log('Close button clicked');
        closeUploadForm();
    });

    const showUploadForm = (message) => {
        uploadOverlay.style.display = 'block';
        uploadTitle.innerHTML = message;
    };

    CCCalc.addEventListener('click', () => {
        console.log('CCCalc clicked');
        showUploadForm('Upload your script to calculate the cyclomatic complexity');
    });

    ONCalc.addEventListener('click', () => {
        console.log('ONCalc clicked');
        showUploadForm('Upload your script to calculate the O[N] Complexity');
    });

    LineCounter.addEventListener('click', () => {
        console.log('LineCounter clicked');
        showUploadForm('Upload your script to calculate the amount of lines it contains');
    });

    SuperMetric.addEventListener('click', () => {
        console.log('SuperMetric clicked');
        showUploadForm('Upload your script to calculate Cyclomatic Complexity, O[N] and amount of lines in the script.');
    });
});