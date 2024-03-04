function uploadFile() {
    var analysisType = document.getElementById('analysisType').value;
    var fileInput = document.getElementById('fileUpload');
    var formData = new FormData();
    formData.append('fileUpload', fileInput.files[0]);
    formData.append('analysisType', analysisType);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    // Update progress bar
    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            var percentage = (e.loaded / e.total) * 100;
            updateProgressBar(percentage);
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if(response.error) {
                showError(response.error);
            } else {
                document.getElementById('resultText').style.display = 'block';
                document.getElementById('resultText').value = `Cyclomatic Complexity: ${response.complexity}`;
            }
        } else {
            showError("Upload failed with status: " + xhr.status);
        }
    };
    xhr.onerror = function() {
        showError("Upload failed due to a network error.");
    };
    xhr.send(formData);
}

function updateProgressBar(percentage) {
    document.getElementById('progressBarFill').style.width = percentage + '%';
}

function showError(message) {
    // Assume an errorElement exists or create one to display error messages
    alert(message); // Simple error handling for demonstration
}
