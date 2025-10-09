const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: "AIzaSyB_F09OETrbp1aGd02PfFvfM0GTyF4CTB0",
});

const getCategory = async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Give me one word category for ${prompt}. I am building an expense tracker just the word remove anything else attached to it.`,
    });

    const category = response.text;

    console.log(category);
    res.status(201).json({ category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategory };
