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
    const ip = data.visitor_IP || '?';
    const resultFrame = document.getElementById('resultFrame');
    const resultText = document.getElementById('resultText');
    const progressBar = document.getElementById('progressBar');
    const progressBarFill = document.getElementById('progressBarFill');
    const AppResult = document.getElementById('AppResult');
    const AppResultText = document.getElementById('AppResultText');

    // Display results

    function whichapp(app,outputText) {
        console.log('Analysing' , outputText, 'with', app);
        let analysisResult;
        if (app == 'CCCalc') {
            fetch('/src/CCCalc.js')
            .then(response => response.text())
            .then(script => {
                const worker = new Worker(URL.createObjectURL(new Blob([script], {type: 'text/javascript'})));
                worker.onmessage = function(e) {
                    analysisResult = e.data;
                    return analysisResult;
                };
                worker.postMessage(outputText);
            });
        }
        else if (app == 'ONCalc') {
            console.log('Analysing' , outputText, 'with', app);
            fetch('/src/O[N].js')
            .then(response => response.text())
            .then(script => {
                const worker = new Worker(URL.createObjectURL(new Blob([script], {type: 'text/javascript'})));
                worker.onmessage = function(e) {
                    analysisResult = e.data;
                    return analysisResult;
                };
                worker.postMessage(outputText);
            });
        }
        else if (app == 'LineCounter') {
            console.log('Analysing' , outputText, 'with', app);
            fetch('/src/LineCounter.js')
                .then(response => response.text())
                .then(script => {
                    const worker = new Worker(URL.createObjectURL(new Blob([script], {type: 'text/javascript'})));
                    worker.onmessage = function(e) {
                        analysisResult = e.data;
                        return analysisResult;
                    };
                    worker.postMessage(outputText);
                });
        }
        else if (app == 'SuperMetric') {
            console.log('Analysing' , outputText, 'with', app);
            fetch('/src/SuperMetric.js')
            .then(response => response.text())
            .then(script => {
                const worker = new Worker(URL.createObjectURL(new Blob([script], {type: 'text/javascript'})));
                worker.onmessage = function(e) {
                    analysisResult = e.data;
                    return analysisResult;
                };
                worker.postMessage(outputText);
            });
        }
    }

    function displayResults(app, outputText) {
        console.log('Displaying results for', app);
        resultFrame.style.display = 'block';
        resultText.style.display = 'block';
        progressBar.style.display = 'block';
        progressBarFill.style.width = '0%';
        resultText.value = outputText;
        progressBarFill.style.width = '50%';
        appAnalysis = whichapp(app,outputText);
        progressBarFill.style.width = '75%';
        AppResultText.style.display = 'block';
        progressBarFill.style.width = '80%';
        AppResultText.innerHTML = appAnalysis;
        progressBarFill.style.width = '100%';
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
        resultFrame.style.display = 'none';
        resultText.style.display = 'none';
        resultText.value ='';
        fileUpload.value = '';
        progressBar.style.display = 'none';
        progressBarFill.style.width = '0%';
        AppResult.style.display = 'none';
        AppResultText.style.display = 'none';
        AppResultText.value = '';
        analysisType.value = '';
        uploadTitle.innerHTML = 'Upload your script';
        console.log('Upload form closed');
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