const { translate } = require("@vitalets/google-translate-api");

const translateText = async (text, targetLang) => {
  if (!text || !text.trim()) return "";
  try {
    const res = await translate(text, { to: targetLang });
    return res.text;
  } catch (err) {
    console.error(`Translation error for ${targetLang}:`, err.message);
    return text;
  }
};

const autoTranslateKathaAndQuestions = async ({
  title,
  content,
  questions,
}) => {
  const translations = {
    hi: {
      title,
      content,
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        explanation: q.explanation || "",
      })),
    },
  };

  const targets = [
    { code: "en", name: "English" },
    { code: "mr", name: "Marathi" },
    { code: "sa", name: "Sanskrit" },
  ];

  for (const lang of targets) {
    try {
      const transTitle = await translateText(title, lang.code);
      const transContent = await translateText(content, lang.code);

      const transQuestions = await Promise.all(
        questions.map(async (q) => {
          const qText = await translateText(q.question, lang.code);
          const opts = await Promise.all(
            q.options.map((opt) => translateText(opt, lang.code)),
          );
          const exp = q.explanation
            ? await translateText(q.explanation, lang.code)
            : "";
          return {
            question: qText,
            options: opts,
            explanation: exp,
          };
        }),
      );

      translations[lang.code] = {
        title: transTitle,
        content: transContent,
        questions: transQuestions,
      };
    } catch (langErr) {
      console.error(`Skipping translation for ${lang.name}:`, langErr.message);
      translations[lang.code] = translations.hi;
    }
  }

  return translations;
};

module.exports = { autoTranslateKathaAndQuestions };
