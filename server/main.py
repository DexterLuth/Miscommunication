from dotenv import load_dotenv
import os
import google.generativeai as genai
import re

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-flash-latest")

# Read the prompt from prompt.txt
with open("prompt.txt", "r", encoding="utf-8") as f:
    conversation = f.read()

output_files = ["Relevant.txt", "Clarity.txt", "Assurance.txt", "Accurate.txt", "response.txt"]
for file in output_files:
    open(file, "w").close()

def run_layer(prompt, instruction, filename):
    response = model.generate_content(f"{instruction}\n\n{prompt}")
    with open(filename, "w", encoding="utf-8") as out_file:
        out_file.write(response.text)
    return response.text

layer1_instruction = (
    "1. Relevance to the Question (Yes/No)?\n"
    "Evaluate whether the banker’s response directly addresses the client’s question. Answer Yes or No and then breifly explain why. Ignore friendliness, tone, or partial explanations — focus strictly on whether the banker’s reply matches the client’s inquiry."
)
layer1_output = run_layer(conversation, layer1_instruction, "Relevant.txt")

layer2_instruction = (
    "2. Clarity of Explanation (Score 1–10)\n"
    "Given the extracted intent and keywords, retrieve relevant regulations from a knowledge base (assume you have access), and check if anything the banker said misleads or contradicts those regulations."
)
layer2_output = run_layer(conversation, layer2_instruction, "Clarity.txt")

layer3_instruction = (
    "3. Assurance of Understanding (Score 1–10)\n"
    "Rate how effectively the banker ensured the client understood the information. Look for confirmation questions, checks for understanding, clear summarization, or invitations for clarification. Score from 1 to 10, where 1 = no effort and 10 = strong effort to verify understanding."
)
layer3_output = run_layer(conversation, layer3_instruction, "Assurance.txt")

layer4_instruction = (
    "4. Accuracy of Explanation (Score 1–10)\n"
    "Evaluate how factually accurate the banker’s explanation is, based on standard banking terminology and practices. Identify whether the information given is correct, partially correct, or incorrect. Provide a score from 1 to 10, where 1 = inaccurate and 10 = fully accurate."
)
layer4_output = run_layer(conversation, layer4_instruction, "Accurate.txt")

layer5_instruction = (
    "5. Structure of Explanation (Score 1–10)\n"
    "Rate how well the banker organized the explanation. Assess logical sequencing, coherence, clear step-by-step flow, and lack of topic jumping. Provide a score from 1 to 10, where 1 = poorly structured and 10 = highly structured."
)

layer5_output = run_layer(conversation, layer5_instruction, "Scruture.txt")

def read_file_safe(path):
    try:
        with open(path, 'r', encoding='utf-8') as fh:
            return fh.read()
    except Exception:
        return ''

clarity_text = read_file_safe('Clarity.txt')
assurance_text = read_file_safe('Assurance.txt')
accurate_text = read_file_safe('Accurate.txt')
structure_text = read_file_safe('Scruture.txt')

layer7_prompt = (
    "You are an assistant that extracts numeric scores and a short summary from previous analysis outputs. "
    "Inputs below are outputs from layers 2-6. Each output may include a numeric score and explanation.\n\n"
    "Task:\n"
    "1) Extract a single numeric score for each layer as follows: Clarity (1-10), Assurance (1-10), Accurate (1-10), Structure (1-10).\n"
    "2) Compute the arithmetic average across the five normalized scores (clarity, assurance, accurate, structure).\n"
    "3) Provide a brief (1-2 sentence) summary for each layer and a one-paragraph overall summary.\n"
    "4) Output a small paragraph or maybe a few sentances as to where the issues lie in the conversation. If some of the scores are low, mention that but if most of the scores are really good then congradulate them\n\n"
    "Here are the layer outputs:\n\n"
    "CLARITY:\n" + clarity_text + "\n\n"
    "ASSURANCE:\n" + assurance_text + "\n\n"
    "ACCURATE:\n" + accurate_text + "\n\n"
    "STRUCTURE:\n" + structure_text + "\n\n"
)

layer7_response = model.generate_content(layer7_prompt)

with open('response.txt', 'w', encoding='utf-8') as respf:
    respf.write(layer7_response.text)

print("Pipeline complete.")