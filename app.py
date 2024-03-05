from flask import Flask, request, redirect, url_for, render_template
import os
from werkzeug.utils import secure_filename

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='templates')
app.config['UPLOAD_FOLDER'] = './SiteUploads'
app.config['ALLOWED_EXTENSIONS'] = {'.py', '.java', '.c', '.cpp', '.cs', '.js'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/SiteUploads', methods=['POST'])
def upload_file():
    # check if the post request has the file part
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return redirect(url_for('uploaded_file', filename=filename))
    else:
        return "File not allowed. Please upload a file with one of the following extensions: .py, .java, .c, .cpp, .cs, .js"

@app.route('/', methods=["GET", "POST"])
def index():
    return render_template('Index.html')

@app.route('/AboutUs.html', methods=["GET"])
def about_us():
    return render_template('AboutUs.html')

@app.route('/Privacy.html', methods=["GET"])
def privacy():
    return render_template('Privacy.html')

@app.route('/Index.html', methods=["GET"])
def index_page():
    return render_template('Index.html')

if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=False, host='0.0.0.0')