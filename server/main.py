from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

# Read the prompt from prompt.txt
with open("prompt.txt", "r", encoding="utf-8") as f:
    conversation = f.read()

output_files = ["layer1.txt", "layer2.txt", "layer3.txt", "layer4.txt", "response.txt"]
for file in output_files:
    open(file, "w").close()

def run_layer(prompt, instruction, filename):
    response = model.generate_content(f"{instruction}\n\n{prompt}")
    with open(filename, "w", encoding="utf-8") as out_file:
        out_file.write(response.text)
    return response.text

# Layer 1: Extract intent, keywords
layer1_instruction = (
    "Stage 1: What is the customer asking for?\n"
    "Extract the customer's intent and keywords from the following conversation."
)
layer1_output = run_layer(conversation, layer1_instruction, "layer1.txt")

# Layer 2: Retrieve regulations, check for contradictions
layer2_instruction = (
    "Stage 2: What regulations apply?\n"
    "Given the extracted intent and keywords, retrieve relevant regulations from a knowledge base (assume you have access), and check if anything the banker said misleads or contradicts those regulations."
)
layer2_output = run_layer(layer1_output, layer2_instruction, "layer2.txt")

# Layer 3: Get requirements
layer3_instruction = (
    "Stage 3: What must be disclosed?\n"
    "Based on the previous analysis, list all requirements that must be disclosed to the client."
)
layer3_output = run_layer(layer2_output, layer3_instruction, "layer3.txt")

# Layer 4: Check compliance, track conversation
layer4_instruction = (
    "Stage 4: Did agent include all requirements?\n"
    "Check if the banker included all required disclosures and track compliance throughout the conversation. "
    "Here is the original conversation transcript, followed by the list of requirements."
)
layer4_input = f"Conversation transcript:\n{conversation}\n\nRequirements from previous analysis:\n{layer3_output}"
layer4_output = run_layer(layer4_input, layer4_instruction, "layer4.txt")

# Layer 5: Generate score and reasoning
layer5_instruction = (
    "Stage 5: Rate the risk and explain why.\n"
    "Based on all previous analysis, generate a score for the banker and explain your reasoning. The score is out of 10"
)
final_output = run_layer(layer4_output, layer5_instruction, "response.txt")

print("Pipeline complete. See layer1.txt, layer2.txt, layer3.txt, layer4.txt, and response.txt for outputs.")