const { spawn } = require('child_process');
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    var fileInput = document.querySelector('input[type="file"]');
    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var contents = e.target.result;

            // Calculate cyclomatic complexity
            var complexity = calculateCyclomaticComplexity(contents);
            document.getElementById('analysisResult').textContent = 'Cyclomatic Complexity: ' + complexity;

            // Send the file to the server
            var formData = new FormData();
            formData.append('script', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Display the graph in the iframe
                document.getElementById('matlabPreview').src = data.graphUrl;
            })
            .catch(error => console.error('Error:', error));
        };

        reader.readAsText(file);
    }
});

function calculateCyclomaticComplexity(script) {
    return new Promise((resolve, reject) => {
        const python = spawn('python', ['./src/CCCalc.py', script]);
        let result = '';

        python.stdout.on('data', (data) => {
            result += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Python script exited with code ${code}`));
            }
            resolve(result);
        });
    });
}
