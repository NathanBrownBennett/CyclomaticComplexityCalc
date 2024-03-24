# Importing necessary libraries
import sqlite3
import pyotp
import qrcode
from io import BytesIO
import base64
import secrets

# Initialize the database connection
conn = sqlite3.connect('users.db', check_same_thread=False)
cursor = conn.cursor()

# Create users table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    totp_secret TEXT NOT NULL
)
''')
conn.commit()

# Create uploads table with the correct schema
cursor.execute('''
CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    filename TEXT NOT NULL,
    filetype TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY(username) REFERENCES users(username)
)
''')
conn.commit()

# Function to upload file
def upload_file(username, filename, filetype, title, content):
    cursor.execute('INSERT INTO uploads (username, filename, filetype, title, content) VALUES (?, ?, ?, ?, ?)', (username, filename, filetype, title, content))
    conn.commit()

# Function to delete file
def delete_file(username, fileId):
    cursor.execute('DELETE FROM uploads WHERE id = ? AND username = ?', (fileId, username, ))
    conn.commit()

# Function to get user uploads
def get_user_uploads(username):
    cursor.execute('SELECT id, filename, filetype, title FROM uploads WHERE username = ?', (username,))
    return cursor.fetchall()

# Function to get raw user uploads
def get_raw_user_uploads(username):
    cursor.execute('SELECT * FROM uploads WHERE username = ?', (username, ))
    return cursor.fetchall()

# Function to check if username exists
def check_username_exists(username):
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    return cursor.fetchone() is not None

# Function to create user
def create_user(username, password):
    totp_secret = pyotp.random_base32()
    cursor.execute('INSERT INTO users (username, password, totp_secret) VALUES (?, ?, ?)', (username, password, totp_secret))
    conn.commit()
    return totp_secret

# Function to get TOTP URI
def get_totp_uri(username, totp_secret):
    return pyotp.totp.TOTP(totp_secret).provisioning_uri(username, issuer_name='Cyber Group FYP')

# Function to generate QR code
def generate_qr_code(totp_uri):
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
    qr.add_data(totp_uri)
    qr.make(fit=True)
    byte_stream = BytesIO()
    img = qr.make_image(fill='black', back_color='white')
    img.save(byte_stream, format='PNG')
    png_data = byte_stream.getvalue()
    base64_png = base64.b64encode(png_data).decode('utf-8')
    return 'data:image/png;base64,' + base64_png

# Function to verify code
def verify_code(totp_secret, code):
    totp = pyotp.TOTP(totp_secret)
    return totp.verify(code)

# Function to generate secret key
def generate_secret_key():
    return secrets.token_hex(32)

# Function to get TOTP secret
def get_totp_secret(username):
    query = "SELECT totp_secret FROM users WHERE username = ?"
    result = conn.execute(query, (username,))
    totp_secret = result.fetchone()[0]
    return totp_secret

# Function to verify OTP
def verify_otp(username, code):
    # Fetch the TOTP secret for the user from the database
    totp_secret = get_totp_secret(username)
    # Verify the OTP and return the result
    return verify_code(totp_secret, code)

# Function to validate password
def validate_password(username, password):
    # Query to select password from users where username matches
    query = "SELECT password FROM users WHERE username = ?"
    result = conn.execute(query, (str(username),))
    stored_password = result.fetchone()[0]

    # Check if the entered password matches the stored password
    if password == stored_password:
        return True
    else:
        return False
