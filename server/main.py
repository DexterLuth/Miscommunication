from dotenv import load_dotenv
import os
import google.generativeai as genai
import re

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-flash-latest")

def run_layer(prompt, instruction, filename):
    response = model.generate_content(f"{instruction}\n\n{prompt}")
    with open(filename, "w", encoding="utf-8") as out_file:
        out_file.write(response.text)
    return response.text

def layer1(conversation: str) -> str:
    layer1_instruction = (
        "1. Relevance to the Question (Yes/No)?\n"
        "Evaluate whether the banker’s response directly addresses the client’s question. Answer Yes or No and then breifly explain why. Ignore friendliness, tone, or partial explanations — focus strictly on whether the banker’s reply matches the client’s inquiry."
    )
    print("Layer 1 Complete")
    return model.generate_content(f"{conversation}\n\n{layer1_instruction}").text


def layer2(conversation: str):
    layer2_instruction = (
        "2. Clarity of Explanation (Score 1–10)\n"
        "Given the extracted intent and keywords, retrieve relevant regulations from a knowledge base (assume you have access), and check if anything the banker said misleads or contradicts those regulations."
    )
    print("Layer 2 Complete")
    return model.generate_content(f"{conversation}\n\n{layer2_instruction}").text

def layer3(conversation: str):
    layer3_instruction = (
        "3. Assurance of Understanding (Score 1–10)\n"
        "Rate how effectively the banker ensured the client understood the information. Look for confirmation questions, checks for understanding, clear summarization, or invitations for clarification. Score from 1 to 10, where 1 = no effort and 10 = strong effort to verify understanding."
    )
    print("Layer 3 Complete")
    return model.generate_content(f"{conversation}\n\n{layer3_instruction}").text


def layer4(conversation: str):
    layer4_instruction = (
        "4. Accuracy of Explanation (Score 1–10)\n"
        "Evaluate how factually accurate the banker’s explanation is, based on standard banking terminology and practices. Identify whether the information given is correct, partially correct, or incorrect. Provide a score from 1 to 10, where 1 = inaccurate and 10 = fully accurate."
    )
    print("Layer 4 Complete")
    return model.generate_content(f"{conversation}\n\n{layer4_instruction}").text


def layer5(conversation: str):
    layer5_instruction = (
        "5. Structure of Explanation (Score 1–10)\n"
        "Rate how well the banker organized the explanation. Assess logical sequencing, coherence, clear step-by-step flow, and lack of topic jumping. Provide a score from 1 to 10, where 1 = poorly structured and 10 = highly structured."
    )

    print("Layer 5 Complete")
    return model.generate_content(f"{conversation}\n\n{layer5_instruction}").text

def layer6(clarity: str, assurance: str, accurate: str, structure: str) -> str:
    layer6_prompt = (
        "You are an assistant that extracts numeric scores and a short summary from previous analysis outputs. "
        "Inputs below are outputs from layers 2-6. Each output may include a numeric score and explanation.\n\n"
        "Task:\n"
        "1) Extract a single numeric score for each layer as follows: Clarity (1-10),, Assurance (1-10), Accurate (1-10), Structure (1-10).\n"
        "2) Compute the arithmetic average across the five normalized scores (clarity, assurance, accurate, structure).\n"
        "3) Provide a brief (1-2 sentence) summary for each layer and a one-paragraph overall summary.\n"
        "4) Output a small paragraph or maybe a few sentances as to where the issues lie in the conversation. If some of the scores are low, mention that but if most of the scores are really good then congradulate them\n\n"
        "Here are the layer outputs:\n\n"
        "CLARITY:\n" + clarity + "\n\n"
        "ASSURANCE:\n" + assurance + "\n\n"
        "ACCURATE:\n" + accurate + "\n\n"
        "STRUCTURE:\n" + structure + "\n\n"
        "The last line of the output must be in this format:"
        "Overall Score: X.YZ"
    )

    layer6_response = model.generate_content(layer6_prompt)
    return layer6_response

def read_file_safe(path: str) -> str:
    try:
        with open(path, 'r', encoding='utf-8') as fh:
            return fh.read()
    except Exception:
        return ''

def processTranscript(transcript: str) -> float:
    # Call layers
    relevance = layer1(transcript)
    clarity = layer2(transcript)
    assurance = layer4(transcript)
    accurate = layer5(transcript)
    structure = layer6(transcript)

    # Determine final output
    output = layer6(clarity, assurance, accurate, structure)
    
    print("Pipeline complete. Layer 7 written to layer7.txt and response.txt")
    print(output.text)

    # Extract output
    split = output.text.split('\n')
    line = split[-1].split(":")
    return line[-1]

if __name__ == "__main__":
    processTranscript()