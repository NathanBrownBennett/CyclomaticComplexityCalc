
from flask import Flask, request, jsonify, send_file
import os
import lizard
import matplotlib.pyplot as plt
from io import BytesIO

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'js', 'java', 'c', 'py'}

render.html("<form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="script" accept=".js">
        <button type="submit">Upload</button>
    </form>

    <h2>Analysis Result</h2>
    <div id="analysisResult"></div>

    <h2>Matlab Graph Preview</h2>
    <iframe id="matlabPreview" style="width: 100%; height: 500px;"></iframe>

    <script src="static/js/analysis.js"></script>")

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(error="No file part"), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify(error="No selected file"), 400
    if file and allowed_file(file.filename):
        filename = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filename)
        complexity_info = analyze_complexity(filename)
        return jsonify(complexity_info)
    else:
        return jsonify(error="File type not allowed"), 400

def analyze_complexity(file_path):
    analysis_result = lizard.analyze_file(file_path)
    lines_per_thousand = analysis_result.nloc / 1000

    function_info = {}
    for func in analysis_result.function_list:
        function_info[func.name] = {
            'nloc': func.nloc,
            'cyclomatic_complexity': func.cyclomatic_complexity,
            'token_count': func.token_count,
        }
        
    # Generate and save the graph
    graph_file_path = generate_graph(function_info, file_path)
    
    return {
        'filename': file_path,
        'nloc': analysis_result.nloc,
        'cyclomatic_complexity': analysis_result.average_cyclomatic_complexity,
        'function_count': len(analysis_result.function_list),
        'lines_per_thousand': lines_per_thousand,
        'graph_file_path': graph_file_path
    }

def generate_graph(function_info, file_path):
    names = list(function_info.keys())
    values = [info['cyclomatic_complexity'] for info in function_info.values()]
    
    plt.figure(figsize=(10, 5))
    plt.bar(names, values)
    plt.title('Cyclomatic Complexity per Function')
    plt.xlabel('Functions')
    plt.ylabel('Cyclomatic Complexity')
    
    graph_name = os.path.basename(file_path) + '_graph.png'
    graph_file_path = os.path.join(UPLOAD_FOLDER, graph_name)
    plt.savefig(graph_file_path)
    plt.close()
    
    return graph_file_path

@app.route('/graph/<filename>')
def get_graph(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename), as_attachment=True)

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)