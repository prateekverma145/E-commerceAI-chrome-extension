import os
import asyncio
import re
from flask import Flask, request, jsonify
from crawl4ai import AsyncWebCrawler
from groq import Groq
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Setup your API key and model details.
GROQ_API_KEY = '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'
MODEL = "llama-3.3-70b-versatile"
client = Groq(api_key=GROQ_API_KEY)

def remove_links(text):
    """
    Remove markdown and HTML links from the provided text.
    """
    text = re.sub(r'\[([^\]]+)\]\((https?:\/\/[^\)]+)\)', r'\1', text)
    text = re.sub(r'<a\s+href=[\'"]?([^\'">]+)[\'"]?>(.*?)<\/a>', r'\2', text)
    text = re.sub(r'https?:\/\/\S+', '', text)
    return text

async def crawl_page(url):
    """
    Crawl the given URL using AsyncWebCrawler and clean the markdown content.
    """
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url)
        cleaned_text = remove_links(result.markdown)
        return cleaned_text

def extract_info(context):
    """
    Sends the crawled content to Groq API to extract structured information.
    """
    prompt = f"Extract all the relevant information from the following context:\n{context}"

    messages = [
        {"role": "system", "content": "You are an AI that extracts key details from product descriptions."},
        {"role": "user", "content": prompt}
    ]

    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model=MODEL,
            stream=False,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return str(e)

@app.route("/crawl", methods=["POST"])
def crawl():
    """
    Expects a JSON body with a 'url' key.
    Crawls the page, extracts structured information, and returns it.
    """
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"error": "Missing url parameter"}), 400

    try:
        context = asyncio.run(crawl_page(url))
        extracted_info = extract_info(context)  # Pass context to Groq AI
        return jsonify({"context": extracted_info})  # Return structured data
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ask", methods=["POST"])
def ask():
    """
    Expects a JSON body with 'question' and 'context' keys.
    Uses the Groq API to generate an answer using the provided context.
    """
    data = request.get_json()
    question = data.get("question")
    context = data.get("context", "")
    if not question or not context:
        return jsonify({"error": "Missing question or context"}), 400

    messages = [
        {
            "role": "system",
            "content": "Use the provided context to answer questions about the product."
        },
        {
            "role": "user",
            "content": f"Context: {context}\nQuestion: {question}"
        }
    ]

    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model=MODEL,
            stream=False,
        )
        answer = chat_completion.choices[0].message.content
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
