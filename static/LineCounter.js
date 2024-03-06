function countLines(fileContent) {
    const lines = fileContent.split('\n');
    const lineCount = lines.length;
    return `${(lineCount / 1000).toFixed(2)}k lines`;
}

self.onmessage = function(event) {
    const fileContent = event.data;
    const LineCount = countLines(fileContent);
    self.postMessage(LineCount);
};