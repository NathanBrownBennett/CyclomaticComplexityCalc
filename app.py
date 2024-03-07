# Hey dudes - Travis

from flask import Flask, request, redirect, url_for, render_template
import os
from werkzeug.utils import secure_filename

app = Flask(__name__, static_url_path='/static', static_folder='static', template_folder='templates')
app.config['UPLOAD_FOLDER'] = './SiteUploads'
app.config['ALLOWED_EXTENSIONS'] = {'.py', '.java', '.c', '.cpp', '.cs', '.js'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/SiteUploads', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return "No File Selected",400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return "Success",200
    else:
        return "Invalid File",400



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
    app.run(debug=True, host='0.0.0.0')