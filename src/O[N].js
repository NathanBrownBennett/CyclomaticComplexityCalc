function ONCalc(fileContent) {
    let lines = fileContent.split('\n');
    let loopDepth = 0;
    let isRecursionUsed = false;
    let isLogarithmic = false;
    let functionName = '';

    lines.forEach(line => {
        if (line.includes('for') || line.includes('while')) {
            // Detect loop start and increment loop depth
            loopDepth++;
            // Check for patterns that suggest the loop could be halving the dataset
            if (line.includes('/= 2') || line.includes('>>= 1')) {
                isLogarithmic = true;
            }
        }
        if (line.includes('function') || line.includes('def')) {
            // Capture function name for recursion check
            functionName = line.match(/function (\w+)/) || line.match(/def (\w+)/);
            if (functionName && functionName.length > 1) {
                functionName = functionName[1];
            }
        }
        if (functionName && line.includes(functionName)) {
            // Check for recursion
            isRecursionUsed = true;
        }
    });

    let ON = "O[1]"; // Assume constant time by default
    if (isRecursionUsed) {
        ON = "O[n]"; // Simplification for recursion
    } else if (loopDepth === 1) {
        if (isLogarithmic) {
            ON = "O[log n]"; // Detected potential halving pattern
        } else {
            ON = "O[n]"; // Single loop implies linear complexity
        }
    } else if (loopDepth > 1) {
        ON = "O[n^2]"; // Nested loops imply quadratic complexity
    }

    return "The O[N] Complexity of the uploaded script is " + ON;
}

self.onmessage = function(event) {
    const fileContent = event.data;
    const ON = ONCalc(fileContent);
    self.postMessage(ON);
};
