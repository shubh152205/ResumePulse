from openai import OpenAI
import os

client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = "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"
)

completion = client.chat.completions.create(
  model="meta/llama-3.1-70b-instruct",
  messages=[{"role":"user","content":"Hello, can you hear me? Respond with 'Yes, I am working!'"}],
  temperature=0.2,
  top_p=0.7,
  max_tokens=1024,
  stream=True
)

print("NVIDIA NIM Response: ", end="")
for chunk in completion:
  if chunk.choices and chunk.choices[0].delta.content is not None:
    print(chunk.choices[0].delta.content, end="")
print("\n")
