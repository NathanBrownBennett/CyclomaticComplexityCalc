document.addEventListener('DOMContentLoaded', (event) => {
    const CCCalc = document.getElementById('CCCalc');
    const ONCalc = document.getElementById('ONCalc');
    const LineCounter = document.getElementById('LineCounter');
    const SuperMetric = document.getElementById('SuperMetric');
    const uploadOverlay = document.getElementById('uploadOverlay');
    const closeButton = document.querySelector('.close-button');
    const uploadTitle = document.querySelector('#uploadForm h2');
    const fileUpload = document.getElementById('fileUpload');
    const uploadButton = document.querySelector('#fileUploadForm button');
    const analysisType = document.getElementById('analysisType');
    const ip = data.VisitorIP || '?';
    const resultFrame = document.getElementById('resultFrame');
    const resultText = document.getElementById('resultText');

    // Display results

    function displayResults(app, outputText) {
        console.log('Displaying results for', app);
        resultFrame.style.display = 'block';
        resultText.style.display = 'block';
        resultText.value = outputText;
    }

    const getDeviceInformation = () => {
        return navigator.userAgent || '?';
    };

    const saveUploadData = (fileName, app, device) => {
        const data = {
            fileName,
            app,
            device
        };

        // Since we can't use fs and path, we'll use localStorage instead
        let uploads = JSON.parse(localStorage.getItem('uploads')) || [];
        uploads.push(data);
        localStorage.setItem('uploads', JSON.stringify(uploads));
    };

    uploadButton.addEventListener('click', async () => {
        console.log('Upload button clicked');
        const app = analysisType.value;
        console.log('variable app is made');
        const file = fileUpload.files[0];
        console.log('variable file is made');
        const filename = file.name;
        console.log('variable filename is made');

        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('Displaying results for', app);
            const outputText = e.target.result;
            displayResults(app, outputText);

            const deviceInfo = getDeviceInformation();
            saveUploadData(filename, app, deviceInfo);

            // Since we can't use fs and path, we'll use localStorage instead
            localStorage.setItem(filename, outputText);
        };
        reader.readAsText(file);
    });

    
    // Close upload form    
    const closeUploadForm = () => {
        uploadOverlay.style.display = 'none';
        results.style.display = 'none';
        resultFrame.style.display = 'none';
        resultText.style.display = 'none';
        resultText.value ='';
        fileUpload.value = ''
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