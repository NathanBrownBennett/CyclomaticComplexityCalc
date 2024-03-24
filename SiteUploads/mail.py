import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart 
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl

def send_quote_email(recipient, quote_breakdown):
    sender = "support@grafted.ai"
    password = "w)XS=RJQMxZN'37"  # Ensure to securely manage your password
    smtp_server = "smtp.office365.com"
    port = 587  # Correct port for SMTP_SSL

    # Use default context to avoid version mismatch
    context = ssl.create_default_context()

    # Prepare email
    message = MIMEMultipart()
    message["Subject"] = "Your Quote from Grafted"
    message["From"] = sender
    message["To"] = recipient
    body_text = f"""Dear Customer,\n\nHere's your quote breakdown:\n\n{quote_breakdown}\n\nThanks,\nGrafted Team"""
    message.attach(MIMEText(body_text, 'plain'))
    context = ssl.create_default_context()
    print("Connecting to server... ")
    # Connect using SMTP and upgrade to TLS
    with smtplib.SMTP(smtp_server, port) as server:
        server.ehlo()  # Can be important for some servers
        server.starttls(context=context)  # Secure the connection
        server.ehlo()  # Can be important after starting TLS
        print("Connected, logging in...")
        server.login(sender, password)
        print("Logged in, sending email...")
        server.sendmail(sender, recipient, message.as_string())
        print("Email sent!")

# Example call (ensure to replace recipient and password with actual values)
# send_quote_email("recipient@example.com", "Total Charge: £1,125.00 GBP")


send_quote_email("travis.trzc@gmail.com", "£1,250.00 GBP")