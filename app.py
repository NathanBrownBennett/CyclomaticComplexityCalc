# Importing necessary libraries
import os
import base64
import requests
from flask import Flask, request, redirect, url_for, session, render_template, jsonify
from modules.chat import Chatbot
from modules.security import File as FileSecurity
from modules.db import (
    check_username_exists,
    create_user,
    get_totp_uri,
    generate_qr_code,
    generate_secret_key,
    verify_code,
    get_totp_secret,
    validate_password,
    upload_file,
    verify_otp,
    get_user_uploads,
    get_raw_user_uploads,
    delete_file
)

# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Flask app configuration
app = Flask(__name__, static_url_path='/static', static_folder='static', template_folder='templates')
app.secret_key = generate_secret_key()
app.config['UPLOAD_FOLDER'] = './SiteUploads'
app.config['ALLOWED_EXTENSIONS'] = {'.py', '.java', '.c', '.cpp', '.cs', '.js'}

# Function to check if user is authenticated
def is_authenticated():
    if 'username' in session:
        if 'verified' in session and session['verified']:
            return 'authenticated'
        else:
            return 'otp_prompt'
    else:
        return 'not_authenticated'

# Redirect authenticated users
@app.before_request
def redirect_authenticated_users():
    if 'username' in session and request.endpoint in ['signup.html', 'login.html', 'uploads.html']:
        return redirect(url_for('index'))

# Route for file upload
@app.route('/FileUpload', methods=['POST'])
def file_upload():
    # Check if a file was uploaded and the user is authenticated
    if 'file' not in request.files or 'username' not in session:
        return redirect(request.url)

    file = request.files['file']
    filename = file.filename
    fileResponse = FileSecurity(file)
    fileChecked = fileResponse.validate_file()

    if fileChecked[0]:
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # Get the username
        username = session['username']
        file.seek(0)
        content = file.read()
        title = request.form.get("title")

        # Add the file to the database
        upload_file(username, filename, filename.split(".")[-1], title, content)

        return "Success", 200

    return fileChecked[1], 400
# Route for file deletion
@app.route('/DeleteFile', methods=['POST'])
def file_delete():
    file_id = request.form.get('id')
    try:
        delete_file(session["username"], file_id)
    except:
        return 'Failed to delete', 400
    return 'File deleted', 200

# Route for uploads
@app.route('/uploads')
def uploads():
    if 'username' in session:
        uploads = get_user_uploads(session['username'])
        uploadF = [{"fileid": upload[0], "filename": upload[1], "filetype": upload[2], "description": upload[3]} for upload in uploads]
        return render_template('uploads.html', username=session['username'], uploads=uploadF)
    else:
        return redirect(url_for('login_page'))

# Route for chat
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('text', '')
    bot = Chatbot()
    response_text = bot.generate_response(user_input)
    return jsonify({"response": response_text}), 200

# Routes for different pages
@app.route('/', methods=["GET"])
def index():
    return render_template('Index.html')

@app.route('/AboutUs', methods=["GET"])
def about_us():
    return render_template('AboutUs.html')

@app.route('/Privacy', methods=["GET"])
def privacy():
    return render_template('Privacy.html')

@app.route('/Index', methods=["GET"])
def index_page():
    status = is_authenticated()
    if status == "authenticated":
        uploads = get_raw_user_uploads(session["username"])
        uploadMapped = [{"fileid": upload[0], "filename": upload[2], "filetype": upload[3], "title": upload[4], "source": upload[5]} for upload in uploads]
        return render_template('Index.html', files=uploadMapped)
    elif status == "otp_prompt":
        return render_template("otp_input.html")
    return redirect(url_for("login_page"))

# Routes for different pages
@app.route('/login', methods=["GET"])
def login_page():
    return render_template('login.html')

@app.route('/signup', methods=["GET"])
def signup_page():
    return render_template('signup.html') 

@app.route('/setup_totp', methods=['GET'])
def setup_totp():
    return render_template('setup_totp.html', totp_uri=123)

# Signup API
@app.route('/api/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('signup.html') 

    username = request.json.get('username')
    password = request.json.get('password')
    recaptcha_token = request.json.get('g-recaptcha-response')

    url = 'https://www.google.com/recaptcha/api/siteverify'
    payload = {
        'secret': '6LeATaIpAAAAAJA2TUHj5TC5acBcfUzn8iMDT1yF',
        'response': recaptcha_token
    }
    response = requests.post(url, data=payload) 
    result = response.json()

    if result['success']:
        if check_username_exists(username):
            return render_template('signup.html', error="Username already in use")
        
        totp_secret = create_user(username, password)
        totp_uri = get_totp_uri(username, totp_secret)
        qr_code = generate_qr_code(totp_uri)

        session['username'] = username
        return render_template('setup_totp.html', totp_uri=totp_uri, qr_code=qr_code)
    else:
        return render_template('signup.html', error="Invalid reCAPTCHA")

@app.route('/otp_input', methods=['GET', 'POST'])
def otp_input():
    if request.method == 'POST':
        otp = request.form.get('otp')
        if verify_otp(session['username'], otp):
            return redirect(url_for('home'))
        else:
            return render_template('otp_input.html', error="Invalid OTP.")
    else:
        return render_template('otp_input.html')

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    if validate_password(username, password):
        session['username'] = username
        session['verified'] = False
        return render_template('otp_input.html')
    else:
        return render_template('login.html', error="Invalid username or password.")

@app.route('/api/logout', methods=['POST', 'GET'])
def logout():
    session.clear()
    return redirect(url_for('login_page'))

@app.route('/api/verify_otp', methods=['POST'])
def verify_otp():
    username = session['username']
    code = request.json.get('otp')
    totp_secret = get_totp_secret(username)

    if verify_code(totp_secret, code):
        session['verified'] = True
        return redirect(url_for('index_page'))
    else:
        return jsonify(success=False, error="Invalid OTP."), 401

# Route for OTP verification
@app.route('/api/verify', methods=['POST'])
def verify():
    username = session['username']  # Get the username from the session
    totp_secret = get_totp_secret(username)  # Get the TOTP secret for the user
    data = request.get_json()  # Get the request data
    code = data.get('code')  # Get the OTP code from the request data

    # Verify the OTP code
    if verify_code(totp_secret, code):
        return jsonify({"status": "success"}), 200  # Code is valid
    else:
        return jsonify({"status": "error", "message": "Invalid code. Please try again."}), 400  # Code is invalid

# Main function
if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)  # Create the upload folder if it doesn't exist
    app.run(debug=True, host='0.0.0.0')  # Run the app