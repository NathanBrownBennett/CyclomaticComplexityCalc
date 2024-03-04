from flask import Flask, request, redirect, url_for, render_template
import os
from werkzeug.utils import secure_filename

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='templates')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'js'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/', methods=["GET", "POST"])
def index():
    return render_template('Index.html')

@app.route('/AboutUs', methods=["GET"])
def about_us():
    return render_template('AboutUs.html')

@app.route('/Privacy', methods=["GET"])
def privacy():
    return render_template('Privacy.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'fileUpload' not in request.files:
        return redirect(request.url)
    file = request.files['fileUpload']
    if file.filename == '':
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return redirect(url_for('uploaded_file',
                                filename=filename))
    else:
        return "File not allowed. Please upload a script file."

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=8080)