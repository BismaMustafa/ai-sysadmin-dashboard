from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
from groq import Groq
import os

app = FastAPI()

# Apni actual API key dobara yahan laazmi dalein
os.environ["GROQ_API_KEY"] = "YOUR_GROQ_API_KEY_HERE"
client = Groq()

class CommandRequest(BaseModel):
    user_input: str

@app.post("/generate-command")
def generate_and_run(request: CommandRequest):
    system_prompt = """You are an expert Windows SysAdmin. 
    The user will provide a natural language request. 
    You must output ONLY a valid, safe Windows PowerShell command to solve the issue. 
    Do not include explanations, intro text, or markdown code blocks like ```powershell. 
    Just the raw command."""

    # AI Agent generates the command
    completion = client.chat.completions.create(
        model="qwen/qwen3.8-27b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": request.user_input}
        ],
        temperature=0,
        max_tokens=100
    )

    generated_command = completion.choices[0].message.content.strip()

    # Execution Engine: Running the command on actual PC
    try:
        process = subprocess.run(
            ["powershell", "-Command", generated_command],
            capture_output=True,
            text=True,
            timeout=30  # 30 seconds ke baad auto-stop ho jaye agar stuck ho
        )
        
        # Agar command successful ho to stdout, warna stderr
        output = process.stdout if process.stdout else process.stderr
        status = "Success" if process.returncode == 0 else "Error"
        
    except Exception as e:
        output = str(e)
        status = "System Exception"

    return {
        "user_intent": request.user_input,
        "generated_command": generated_command,
        "execution_status": status,
        "system_output": output.strip()
    }