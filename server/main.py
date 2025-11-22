from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-flash-latest")

# Read the prompt from prompt.txt
with open("prompt.txt", "r", encoding="utf-8") as f:
    conversation = f.read()

output_files = ["Relevant.txt", "Clarity.txt", "Friendliness.txt", "Assurance.txt", "Accurate.txt", "response.txt"]
for file in output_files:
    open(file, "w").close()

def run_layer(prompt, instruction, filename):
    response = model.generate_content(f"{instruction}\n\n{prompt}")
    with open(filename, "w", encoding="utf-8") as out_file:
        out_file.write(response.text)
    return response.text

# Layer 1: Extract intent, keywords
layer1_instruction = (
    "1. Relevance to the Question (Yes/No)?\n"
    "Evaluate whether the banker’s response directly addresses the client’s question. Answer only Yes or No. Ignore friendliness, tone, or partial explanations — focus strictly on whether the banker’s reply matches the client’s inquiry."
)
layer1_output = run_layer(conversation, layer1_instruction, "Relevant.txt")

# Layer 2: Retrieve regulations, check for contradictions
layer2_instruction = (
    "2. Clarity of Explanation (Score 1–10)\n"
    "Given the extracted intent and keywords, retrieve relevant regulations from a knowledge base (assume you have access), and check if anything the banker said misleads or contradicts those regulations."
)
layer2_output = run_layer(conversation, layer2_instruction, "Clarity.txt")

# Layer 3: Get requirements
layer3_instruction = (
    "3. Friendliness (Score 1–5)\n"
    "Rate how friendly and approachable the banker sounded. Evaluate warmth, politeness, and positive interpersonal tone. Provide a score from 1 to 5, where 1 = unfriendly and 5 = very friendly."
)
layer3_output = run_layer(conversation, layer3_instruction, "Friendliness.txt")

# Layer 4: Check compliance, track conversation
layer4_instruction = (
    "4. Assurance of Understanding (Score 1–10)\n"
    "Rate how effectively the banker ensured the client understood the information. Look for confirmation questions, checks for understanding, clear summarization, or invitations for clarification. Score from 1 to 10, where 1 = no effort and 10 = strong effort to verify understanding."
)
layer4_output = run_layer(conversation, layer4_instruction, "Assurance.txt")

# Layer 5: Generate score and reasoning
layer5_instruction = (
    "5. Accuracy of Explanation (Score 1–10)\n"
    "Evaluate how factually accurate the banker’s explanation is, based on standard banking terminology and practices. Identify whether the information given is correct, partially correct, or incorrect. Provide a score from 1 to 10, where 1 = inaccurate and 10 = fully accurate."
)
layer5_output = run_layer(conversation, layer5_instruction, "Accurate.txt")

layer6_instruction = (
    "6. Structure of Explanation (Score 1–10)\n"
    "Rate how well the banker organized the explanation. Assess logical sequencing, coherence, clear step-by-step flow, and lack of topic jumping. Provide a score from 1 to 10, where 1 = poorly structured and 10 = highly structured."
)
layer6_output = run_layer(conversation, layer6_instruction, "Scruture.txt")

print("Pipeline complete")