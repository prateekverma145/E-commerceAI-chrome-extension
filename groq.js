import Groq from "groq-sdk";
const API_KEY = "yout groq api key";

// groq-wrapper.js (or include directly in your popup.js if you prefer)


const groq = new Groq({ apiKey: API_KEY });

async function askGroq(question, context) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Use the provided context to answer questions about the product." },
        { role: "user", content: `Context: ${context}\nQuestion: ${question}` }
      ],
      model: "llama-3.3-70b-versatile"
    });
    console.log("chatCompletion:", chatCompletion.choices[0]?.message?.content);
    return chatCompletion.choices[0]?.message?.content || "No answer returned.";
  } catch (error) {
    console.error("Error in askGroq:", error);
    return "An error occurred while processing your request.";
  }
}

export { askGroq };
