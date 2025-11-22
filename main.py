from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

# Read the prompt from prompt.txt
with open("prompt.txt", "r", encoding="utf-8") as f:
    user_prompt = f.read()

system_instruction = (
    "You are an assistant to a banker. The banker will send you the conversation that they had with a client. "
    "Your job is to provide a score with how the banker did in the conversation. The score is based on how well the banker communicated with the client."
)

response = model.generate_content(f"{system_instruction}\n\n{user_prompt}")

# Write the response to a text file
with open("response.txt", "w", encoding="utf-8") as out_file:
    out_file.write(response.text)

print("Read output.txt for the model's response.")