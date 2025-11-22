
from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai
import os

# Configure the API key from the environment variable
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create the model instance
model = genai.GenerativeModel("gemini-2.5-flash")

# Generate content
response = model.generate_content("Explain how AI works in a few words")
print(response.text)