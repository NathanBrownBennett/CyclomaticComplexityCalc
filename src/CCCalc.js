const fs = require('fs');

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

function analyzeFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${filePath}`);
            return;
        }
        const complexity = calculateCyclomaticComplexity(data);
        console.log(`Cyclomatic Complexity of ${filePath}: ${complexity}`);
    });
}

// Example usage:
const filePaths = [
    'path/to/your/file.java',
    'path/to/your/file.c',
    'path/to/your/file.cpp',
    'path/to/your/file.py',
    'path/to/your/file.cs', // Add paths to your source code files here
];

filePaths.forEach(analyzeFile);
