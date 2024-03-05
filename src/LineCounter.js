function countLines(fileContent) {
    const lines = fileContent.split('\n');
    const lineCount = lines.length;
    return `${(lineCount / 1000).toFixed(2)}k lines`;
}