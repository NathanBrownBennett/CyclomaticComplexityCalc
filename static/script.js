function uploadFile() {
    var analysisType = document.getElementById('analysisType').value;
    var formData = new FormData(document.getElementById('fileUploadForm'));
    formData.append('analysisType', analysisType); // Ensure this data is sent to the server

    // AJAX request setup (modify the URL to your Flask route)
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Handle success, update progress bar, and display results
            var response = JSON.parse(xhr.responseText);
            updateProgressBar(100); // Example: update progress to 100% upon success
            showResults(response); // Implement this function based on how you want to display results
        } else {
            // Handle error
            showError("Upload failed with status: " + xhr.status);
        }
    };
    xhr.send(formData);
}

function showError(message) {
    // Display the error message in a specific HTML element
    var errorElement = document.getElementById('errorElement');
    errorElement.style.display = 'block';
    errorElement.textContent = message;
}

function showUploadForm(id) {
    // Get the upload form element
    var uploadFormElement = document.getElementById('id');

    uploadFormElement.onclick = function () {
           // Show the upload form
    uploadForm.style.display = 'block';
    uploadForm.style.visibility = 'visible';
    uploadForm.style.transition = 'visibility 0s, opacity 0.5s linear';
    uploadForm.textContent = id;
    
    };
}

function closeUploadForm() {
    // Get the upload form element
    var uploadFormElement = document.getElementById('uploadForm');

    // Hide the upload form
    uploadFormElement.style.display = 'none';
    uploadFormElement.style.visibility = 'hidden';
    uploadFormElement.style.transition = 'visibility 0s, opacity 0.5s linear';
}