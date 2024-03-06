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
    //let app = this.app;
    const ip = data.visitor_IP || '?';
    const resultFrame = document.getElementById('resultFrame');
    const resultText = document.getElementById('resultText');
    const progressBar = document.getElementById('progressBar');
    const progressBarFill = document.getElementById('progressBarFill');
    const AppResult = document.getElementById('AppResult');
    const AppResultText = document.getElementById('AppResultText');

    // Display results

    function whichapp(app,outputText) {
        let analysisResult;
        if (app == 'CCCalc') {
            console.log('Analysing' , outputText, 'with', app);
            fetch('CCCalc.js')
            .then(response => response.text())
            .then(script => {
                console.log('Formulating worker for', app);
                const worker = new Worker(URL.createObjectURL(new Blob([script], {type: 'text/javascript'})));
                worker.onmessage = function(e) {
                    console.log('worker is made for', app);
                    analysisResult = e.data;
                    console.log(analysisResult);
                };
                worker.postMessage(outputText);
                return analysisResult;
            });
        }
        else if (app == 'ONCalc') {
            console.log('Analysing' , outputText, 'with', app);
            fetch('O[N].js')
            .then(response => response.text())
            .then(script => {
                console.log('Formulating worker for', app);
                const worker = new Worker(URL.createObjectURL(new Blob([script], {type: 'text/javascript'})));
                worker.onmessage = function(e) {
                    console.log('worker is made for', app);
                    analysisResult = e.data;
                    console.log(analysisResult);
                };
                worker.postMessage(outputText);
                return analysisResult;
            });
        }
        else if (app == 'LineCounter') {
            console.log('Analysing' , outputText, 'with', app);
            fetch('/static/LineCounter.js')
                .then(response => response.text())
                .then(script => {
                    console.log('Formulating worker for', app);
                    const worker = new Worker(URL.createObjectURL(new Blob([script], {type: 'text/javascript'})));
                    worker.onmessage = function(e) {
                        console.log('worker is made for', app);
                        analysisResult = e.data;
                        console.log(analysisResult);
                    };
                    worker.postMessage(outputText);
                    return analysisResult;
                });
        }
        else if (app == 'SuperMetric') {
            console.log('Analysing' , outputText, 'with', app);
            fetch('SuperMetric.js')
            .then(response => response.text())
            .then(script => {
                console.log('Formulating worker for', app);
                const worker = new Worker(URL.createObjectURL(new Blob([script], {type: 'text/javascript'})));
                worker.onmessage = function(e) {
                    console.log('worker is made for', app);
                    analysisResult = e.data;
                    console.log(analysisResult);
                };
                worker.postMessage(outputText);
                return analysisResult;
            });
        }
    }

    function displayResults(app, outputText) {
        console.log('Starting displayResults for', app);
        resultFrame.style.display = 'block';
        resultText.style.display = 'block';
        progressBar.style.display = 'block';
        progressBarFill.style.width = '0%';
        console.log('frame and progress bar are displayed');
        resultText.value = outputText;
        progressBarFill.style.width = '50%';
        console.log('resultText is displayed');
        appAnalysis = whichapp(app,outputText);
        console.log(AppResultText);
        console.log(appAnalysis);
        console.log('appAnalysis is made');
        AppResult.style.display = 'block';
        console.log('AppResult is displayed');
        progressBarFill.style.width = '75%';
        AppResultText.style.display = 'block';
        progressBarFill.style.width = '80%';
        AppResultText.innerHTML = appAnalysis;
        console.log('AppResultText is displayed');
        progressBarFill.style.width = '100%';
        console.log('progress bar is filled');
    }

    const getDeviceInformation = () => {
        return navigator.userAgent || '?';
    };
    console.log('getDeviceInformation is made');

    // Save upload data

    const saveUploadData = (fileName, app, device) => {
        const data = {
            fileName,
            app,
            device
        };
        console.log('data is made');

        // Since we can't use fs and path, we'll use localStorage instead
        let uploads = JSON.parse(localStorage.getItem('uploads')) || [];
        console.log('uploads is made');
        uploads.push(data);
        console.log('uploads is pushed');
        localStorage.setItem('uploads', JSON.stringify(uploads));
        console.log('uploads is saved');
    };

    uploadButton.addEventListener('click', async () => {
        console.log('Upload button clicked');
        const app = this.app;
        console.log('app clicked is', app);
        console.log('variable app is made');
        const file = fileUpload.files[0];
        console.log('variable file is made');
        const filename = file ? file.name : '';
        console.log('variable filename is made');

        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('File reader for', app, "after upload button is pressed");
            const outputText = e.target.result;
            displayResults(app, outputText);
            const deviceInfo = getDeviceInformation();
            console.log('deviceInfo is made');
            saveUploadData(filename, app, deviceInfo);
            console.log('called saveUploadData');
            // Since we can't use fs and path, we'll use localStorage instead
            localStorage.setItem(filename, outputText);
            console.log('called localStorage');
        };
        reader.readAsText(file);
        console.log('File reader is read');
    });

    
    // Close upload form    
    const closeUploadForm = () => {
        console.log('Close upload form called');
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
        app = '';
        uploadTitle.innerHTML = 'Upload your script';
        console.log('Upload form closed');
    };

    closeButton.addEventListener('click', () => {
        console.log('Close button clicked');
        closeUploadForm();
    });

    const showUploadForm = (message) => {
        console.log('Show upload form called');
        uploadOverlay.style.display = 'block';
        uploadTitle.innerHTML = message;
    };

    CCCalc.addEventListener('click', () => {
        this.app = "CCCalc";
        console.log(app, 'clicked');
        showUploadForm('Upload your script to calculate the cyclomatic complexity');
    });

    ONCalc.addEventListener('click', () => {
        this.app = "ONCalc";
        console.log(app, 'clicked');
        showUploadForm('Upload your script to calculate the O[N] Complexity');
        
    });

    LineCounter.addEventListener('click', () => {
        this.app = "LineCounter";
        console.log(app, 'clicked');
        showUploadForm('Upload your script to calculate the amount of lines it contains');
        
    });

    SuperMetric.addEventListener('click', () => {
        this.app = "SuperMetric";
        console.log(app, 'clicked');
        showUploadForm('Upload your script to calculate Cyclomatic Complexity, O[N] and amount of lines in the script.');
        
    });
});