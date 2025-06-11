const fetch = require("node-fetch");
require("dotenv").config();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const userMessage = body.message;

  const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o", // eng so'nggi model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage }
      ]
    })
  });

  const data = await apiResponse.json();
  return {
    statusCode: 200,
    body: JSON.stringify({ reply: data.choices[0].message.content })
  };
};
