# Wargwarn - nafe - 2021

from flask import Flask, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename

from modules.security import File as FileSecurity # All Security Related Functionality

import os


app = Flask(__name__, static_url_path='/static', static_folder='static', template_folder='templates')
app.config['UPLOAD_FOLDER'] = './SiteUploads'
app.config['ALLOWED_EXTENSIONS'] = {'.py', '.java', '.c', '.cpp', '.cs', '.js'}

@app.route('/SiteUploads', methods=['POST'])
def upload_file(request):
    if 'file' not in request.files:
        return redirect(request.url)

    file = request.files['file']
    fileResponse = FileSecurity(request.files['file'])
    fileChecked = fileResponse.validate_file()

    if fileChecked[0]:
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
        return "Success", 200
    
    return fileChecked[1], 400

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