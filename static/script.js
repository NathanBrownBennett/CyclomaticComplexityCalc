document.addEventListener('DOMContentLoaded', (event) => {
    const CCCalc = document.getElementById('CCCalc');
    const ONCalc = document.getElementById('ONCalc');
    const LineCounter = document.getElementById('LineCounter');
    const SuperMetric = document.getElementById('SuperMetric');
    const uploadOverlay = document.getElementById('uploadOverlay');

    const showUploadForm = () => {
        uploadOverlay.style.display = 'block';
    };

    CCCalc.addEventListener('click', () => {
        console.log('CCCalc clicked');
        showUploadForm();
    });

    ONCalc.addEventListener('click', () => {
        console.log('ONCalc clicked');
        showUploadForm();
    });

    LineCounter.addEventListener('click', () => {
        console.log('LineCounter clicked');
        showUploadForm();
    });

    SuperMetric.addEventListener('click', () => {
        console.log('SuperMetric clicked');
        showUploadForm();
    });
});