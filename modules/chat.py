# chatbot.py
import openai, os
from flask import jsonify
from dotenv import load_dotenv

class Chatbot:
    def __init__(self, model_name="gpt-3.5-turbo"):

        load_dotenv()

        self.model_name = model_name
        #self.api_key = os.getenv('OPENAI_API_KEY')
        openai.api_key = self.api_key

        self.site_context = """
            Welcome to the CCSA Tool website. Our tool is designed to help software developers calculate the cyclomatic complexity of their code, aiding in understanding the potential maintenance cost and likelihood of bugs. 

            Key Tools:
            - CCcalc: Calculates cyclomatic complexity. Users upload their code file, and CCcalc provides the complexity rating.
            - O[N] Calc: Estimates the time complexity of code. Upload your code file, and receive an estimate of its time complexity, helping optimize performance.
            - Line Counter: Counts the total number of lines in your code. Simply upload your code file to receive a line count, offering insights into project size.
            - SuperMetric: Provides various metrics about your code, including cyclomatic complexity, line count, and time complexity. Upload your code file to get a comprehensive metrics report.

            Our Team:
            - Nathan Brown-Bennett, Analyst Designer & Programmer, plays a pivotal role in developing our analysis tools.
            - Abeera Salik, Project Manager, ensures our projects stay on track and meet our quality standards.
            - Daniyal Ahmed, Designer, is responsible for the aesthetic and user-friendly design of our tools.
            - Joseph Akiti, Security Analyst, safeguards our tools and website from cyber threats.
            - Jonel Arapi, Web-App UI Developer, specializes in creating intuitive user interfaces for our applications.
            - Travis Trzcinski, Backend Developer, focuses on server-side logic and database management, ensuring our tools run smoothly.
            - Bilal Toumi, Analyst Designer, contributes to tool design and analysis features, enhancing functionality.

            Privacy Policy:
            At CCSA, we are committed to protecting your personal data. We collect information like code files and analysis results to improve our tools. Information collection is also part of our customer feedback processes. Personal data is used strictly to enhance user experience and tool functionality. We adhere to strict data retention policies, ensuring data is kept only as long as necessary and then securely deleted. Users have rights over their data, including access, correction, and deletion requests.

            Website Information:
            - About Us: This page likely contains information about the organization, its mission, vision, and team.
            - Index: This is the homepage of the website, showcasing our tools.
            - Login: This page is used for user authentication, where users can enter their credentials to access their accounts.
            - Privacy: This page likely outlines the website’s privacy policy, including details on data collection, storage, and usage.
            - Sign Up: This page is used for new users to create an account, likely requiring personal information and consent to terms and conditions.
            - Uploads: This page is where authenticated users can upload their own source code files. The accepted file types for upload are Python (‘.py’), Java (‘.java’), C (‘.c’), C++ (‘.cpp’), C# (‘.cs’), and JavaScript (‘.js’). Once uploaded, users can use their code with various tools available on the website, such as CCcalc app, O[N] Calc app, Line counter app, and SuperMetric App.

            Other Information:
            - We secure users with TOTP 2FA. When users first create their account they are made to setup the 2FA. Our system shows them a QR code and a manual entry key that can be used
            - Our website has multiple players of input validation to protect the integrity of our systems

            For any questions regarding our Privacy Policy or tools, please contact us directly.
        """

    def generate_response(self, user_input):
        prompt = f"{self.site_context}\nUser asks: {user_input}\nHow should the assistant respond?"
        response = openai.ChatCompletion.create(
            model=self.model_name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant for the CCSA Tool."},
                {"role": "user", "content": prompt},
            ]
        )
        response_text = response.choices[0].message['content'].strip()
        return response_text