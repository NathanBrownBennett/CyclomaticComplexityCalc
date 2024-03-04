from flask import Flask, request, redirect, url_for, render_template
import os

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='templates')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'js'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/', methods=["GET", "POST"])
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'script' not in request.files:
        return redirect(request.url)
    file = request.files['script']
    if file.filename == '':
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return redirect(url_for('uploaded_file',
                                filename=filename))
    else:
        return "File not allowed. Please upload a .js file."

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=8080)