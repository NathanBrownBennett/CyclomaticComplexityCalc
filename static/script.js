document.addEventListener('DOMContentLoaded', (event) => {
    // Core

    const CCCalc = document.getElementById('CCCalc');
    const ONCalc = document.getElementById('ONCalc');
    const LineCounter = document.getElementById('LineCounter');
    const SuperMetric = document.getElementById('SuperMetric');
    const uploadOverlay = document.getElementById('uploadOverlay');
    const closeButton = document.querySelector('.close-button');
    const uploadTitle = document.querySelector('#uploadForm h2');
    const fileUpload = document.getElementById('fileUpload');
    const uploadButton = document.querySelector('#fileUploadForm button');
    const ip = data.visitor_IP;
    const Result = document.getElementById('ResultSection');
    //const resultFrame = document.getElementById('');
    const resultText = document.getElementById('resultText');
    const progressBar = document.getElementById('progressBar');
    const progressBarFill = document.getElementById('progressBarFill');
    //const AppResult = document.getElementById('AppResult');
    const AppResultText = document.getElementById('AppResultText');

    // Get all file select dropdowns
    const fileSelects = document.querySelectorAll('.file-select');

    // Add event listener to each file select dropdown
    fileSelects.forEach(function(fileSelect) {
        fileSelect.addEventListener('change', function() {
            // Get the selected file ID
            var fileId = this.value;

            // TODO: Use the file ID to load the file into the tool
        });
    });

    function toggleChat() {
        var chatContainer = document.getElementById('chat-container');
        var chatToggle = document.getElementById('chat-toggle');
        if (chatContainer.style.display === 'none') {
            chatContainer.style.display = 'block';
            chatToggle.style.display = 'none';
        } else {
            chatContainer.style.display = 'none';
            chatToggle.style.display = 'flex';
        }
    }
    
    function createWorker(app, scriptPath, outputText) {
        return new Promise((resolve, reject) => {
            fetch(scriptPath)
                .then(response => response.text())
                .then(script => {
                    const worker = new Worker(URL.createObjectURL(new Blob([script], {type: 'text/javascript'})));
                    worker.onmessage = function(e) {
                        const analysisResult = e.data;
                        // Update the AppResultText textarea with the analysis result
                        AppResultText.value = analysisResult;
                        // Make the AppResultText textarea visible
                        AppResultText.style.display = 'block';
                        resolve(analysisResult);
                    };
                    worker.postMessage(outputText);
                })
                .catch(reject);
        });
    }

    // Display results
    
    function whichapp(app, outputText) {
        console.log('Analysing', outputText, 'with', app);
        switch (app) {
            case 'CCCalc':
                return createWorker(app, '/static/CCCalc.js', outputText);
            case 'ONCalc':
                return createWorker(app, '/static/BigN.js', outputText);
            case 'LineCounter':
                return createWorker(app, '/static/LineCounter.js', outputText);
            case 'SuperMetric':
                console.log('Analysing' , outputText, 'with', app);
                // Return a new Promise
                return new Promise((resolve, reject) => {
                    // Run all three workers in parallel and wait for all of them to finish
                    Promise.all([
                        createWorker('CCCalc', '/static/CCCalc.js', outputText),
                        createWorker('ONCalc', '/static/BigN.js', outputText),
                        createWorker('LineCounter', '/static/LineCounter.js', outputText)
                    ]).then(([ccCalcResult, onCalcResult, lineCounterResult]) => {
                        // Combine the results into the SuperMetric
                        const superMetric = `CCCalc: ${ccCalcResult}\nONCalc: ${onCalcResult}\nLineCounter: ${lineCounterResult}`;
                        // Update the AppResultText textarea with the SuperMetric
                        AppResultText.value = superMetric;
                        // Make the AppResultText textarea visible
                        AppResultText.style.display = 'block';
                        // Resolve the Promise with the SuperMetric
                        resolve(superMetric);
                    }).catch(reject);  // Reject the Promise if there's an error
                });

                break;
            default:
                return Promise.reject('Invalid app');
        }
    }

    function displayResults(app, outputText) {
        console.log('Starting displayResults for', app);
        //resultFrame.style.display = 'block';
        resultText.style.display = 'block';
        progressBar.style.display = 'block';
        progressBarFill.style.width = '0%';
        console.log('frame and progress bar are displayed');
        Result.style.display = 'block';
        console.log('Result Section is displayed');
        resultText.value = outputText;
        progressBarFill.style.width = '50%';
        console.log('resultText is displayed');
        //appAnalysis = whichapp(app,outputText);
        //appAnalysis = null;

        whichapp(app,outputText).then(result => {
            appAnalysis = result
            console.log(AppResultText);
            console.log(appAnalysis);
            console.log('appAnalysis is made');
            //AppResult.style.display = 'block';
            console.log('AppResult is displayed');
            progressBarFill.style.width = '75%';
            AppResultText.style.display = 'block';
            progressBarFill.style.width = '80%';
            AppResultText.innerHTML = appAnalysis;
            console.log('AppResultText is displayed');
            progressBarFill.style.width = '100%';
            console.log('progress bar is filled');
         })
         .catch(error => {
            console.error('Error in analysis:', error);
         });


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
    
        // Get the selected option element
        var option = document.getElementById('fileSelect').selectedOptions[0];
    
        let file;
        let filename;
    
        // If a file is selected in the dropdown menu, use it
        if (option) {
            filename = option.value;
            // Get the source of the file from the data-source attribute
            file = option.getAttribute('data-source');
    
            // Remove the leading "b'" and trailing "'"
            file = file.substring(2, file.length - 1);
    
            // Replace "\\r\\n" with "\n" to convert to genuine new lines
            file = file.replace(/\\r\\n/g, "\n");
        }
        // Otherwise, try to upload a new file
        else {
            file = fileUpload.files[0];
            filename = file ? file.name : '';
        }
    
        console.log('variable file is made');
    
        const reader = new FileReader();
        reader.onload = function(e) {
            console.log('File reader for', app, "after upload button is pressed");
            const outputText = e.target.result;
            displayResults(app, outputText);
            const deviceInfo = getDeviceInformation();
            console.log('deviceInfo is made');
            saveUploadData(filename, this.app, deviceInfo);
            console.log('called saveUploadData');
            // Since we can't use fs and path, we'll use localStorage instead
            localStorage.setItem(filename, outputText);
            console.log('called localStorage');
        };
        reader.readAsText(new Blob([file]));
        console.log('File reader is read');
    });
    
    // Close upload form    
    const closeUploadForm = () => {
        console.log('Close upload form called');
        uploadOverlay.style.display = 'none';
        //resultFrame.style.display = 'none';
        resultText.style.display = 'none';
        resultText.value ='';
        fileUpload.value = '';
        progressBar.style.display = 'none';
        progressBarFill.style.width = '0%';
        //AppResult.style.display = 'none';
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