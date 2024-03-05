self.onmessage = function(event) {
    const fileContent = event.data;
    const complexity = calculateCyclomaticComplexity(fileContent);
    self.postMessage(complexity);
};

function calculateCyclomaticComplexity(fileContent) {
    // Regular expressions to match different control structures
    const patterns = [
        /if\s*\(/g, // if statements
        /else\s+if\s*\(/g, // else if statements
        /for\s*\(/g, // for loops
        /while\s*\(/g, // while loops
        /do\s*\{/g, // do-while loops
        /\?\s*.*\s*:/g, // ternary operators
        /case\s+.*:/g, // switch case
        /catch\s*\(/g, // catch statements
    ];

    let complexity = 1; // Starting with 1 for the linear path
    patterns.forEach(pattern => {
        const matches = fileContent.match(pattern);
        complexity += matches ? matches.length : 0;
    });

    return complexity;
}
