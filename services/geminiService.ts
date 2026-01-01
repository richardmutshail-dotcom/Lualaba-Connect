import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes symptoms using Gemini 3 Flash.
 */
export const checkSymptoms = async (symptoms: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tu es un assistant médical virtuel pour la province du Lualaba, RDC. 
      L'utilisateur décrit ses symptômes : "${symptoms}".
      Analyse ces symptômes et fournis une orientation (ce n'est PAS un diagnostic médical officiel).
      Suggère des remèdes simples ou conseille de voir un médecin si nécessaire.
      Sois concis, empathique et utilise un langage clair.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "Désolé, je n'ai pas pu analyser les symptômes. Veuillez consulter un médecin.";
  } catch (error) {
    console.error("Gemini Health Error:", error);
    return "Erreur de connexion au service d'analyse. Vérifiez votre réseau.";
  }
};

/**
 * Identifies a pill/medication from an image OR text using Gemini.
 */
export const analyzeMedication = async (base64Image: string | null, medicationName: string): Promise<string> => {
  try {
    const modelName = base64Image ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview';
    
    let prompt = "Tu es un assistant pharmacien virtuel. ";
    
    if (base64Image && medicationName) {
      prompt += `J'ai une image d'un médicament et je pense qu'il s'agit de "${medicationName}". Identifie-le formellement, confirme si le nom correspond à l'image, et donne son usage, posologie usuelle et précautions.`;
    } else if (base64Image) {
      prompt += "Identifie ce médicament (boîte, pilule ou flacon) à partir de l'image. Donne son nom probable, son usage courant, la posologie usuelle et les précautions importantes.";
    } else if (medicationName) {
      prompt += `Donne-moi des informations sur le médicament nommé "${medicationName}". Inclus : à quoi il sert, comment le prendre généralement, et les effets secondaires/précautions.`;
    } else {
      return "Veuillez fournir une image ou un nom de médicament.";
    }

    prompt += " Réponds en français de manière claire et structurée. Ajoute un avertissement que tu es une IA et qu'il faut consulter un médecin.";

    const contents: any = {};
    
    if (base64Image) {
        // Remove data URL prefix if present
        const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
        contents.parts = [
            { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
            { text: prompt }
        ];
    } else {
        contents.parts = [{ text: prompt }];
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: contents
    });

    return response.text || "Impossible d'analyser la demande.";
  } catch (error) {
    console.error("Gemini Med Error:", error);
    return "Erreur lors de l'analyse du médicament. Veuillez réessayer.";
  }
};

/**
 * Local assistant chatbot (News, Safety, Community).
 */
export const askLocalAssistant = async (query: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tu es "Masta", un assistant personnel local pour le Lualaba.
      Tu connais l'actualité locale, les règles de sécurité dans les mines, et les services communautaires.
      Question de l'utilisateur : "${query}".
      Réponds de manière utile et locale. Ne commence pas par une salutation, entre directement dans le vif du sujet.`,
    });
    const aiText = response.text || "Je n'ai pas trouvé d'information.";
    return `Jambo ici Masta ton assistant personnel. ${aiText}`;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Service momentanément indisponible.";
  }
};
