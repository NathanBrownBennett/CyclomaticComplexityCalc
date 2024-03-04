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
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    const saveUploadData = (ip, time, location, device, app, fileName) => {
        const data = {
            ip,
            time,
            location,
            device,
            app,
            fileName
        };
        fetch('/SiteUploads.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    };

    uploadButton.addEventListener('click', () => {
        const file = fileUpload.files[0];
        if (file && file.size <= MAX_FILE_SIZE && ['.py', '.java', '.c', '.cpp', '.cs'].includes(file.name.split('.').pop())) {
            const formData = new FormData();
            formData.append('file', file);
            fetch('/SiteUploads', {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response.ok) {
                    // Assuming you have a way to get these values
                    const ip = 'ip';
                    const time = new Date().toISOString();
                    const location = 'location';
                    const device = 'device';
                    const app = analysisType.value;
                    saveUploadData(ip, time, location, device, app, file.name);
                }
            });
        } else {
            alert('Invalid file. Please select a .py, .java, .c, .cpp, or .cs file that is less than 50MB.');
        }
    });
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