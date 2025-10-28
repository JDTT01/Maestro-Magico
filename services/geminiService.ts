import { GoogleGenAI, Modality } from "@google/genai";
import { ExplanationStyle, VoiceMode, ChatMessage } from "../types";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. The application will not work without it.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getStyleInstruction = (style: ExplanationStyle): string => {
  switch (style) {
    case 'concise':
      return "Tu explicación debe ser concisa, directa y al grano. Evita detalles innecesarios y céntrate en la idea principal. El objetivo es la brevedad y la claridad.";
    case 'detailed':
      return "Proporciona una explicación detallada y exhaustiva. Profundiza en los conceptos clave, ofrece ejemplos y desglosa la información para que no quede ninguna duda. Sé minucioso.";
    case 'professional':
      return "Adopta un tono formal, objetivo y profesional. Utiliza un lenguaje preciso y estructurado, como si estuvieras dando una conferencia o escribiendo un informe técnico. Evita coloquialismos.";
    case 'friendly':
    default:
      return "Habla como si fueras un excelente amigo que domina completamente el tema. Tu tono debe ser profesional pero muy cercano, claro y entretenido.";
  }
}

export const generateTitleForContent = async (content: string): Promise<string> => {
    try {
        const prompt = `Crea un título corto y atractivo (máximo 6 palabras) para el siguiente texto. El título debe resumir la idea principal. Responde únicamente con el título, sin comillas ni texto introductorio. El texto es: "${content.substring(0, 500)}..."`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const title = response.text.trim().replace(/^"|"$/g, ''); // Remove surrounding quotes if any
        if (!title) {
            return "Lección sin título";
        }
        return title;
    } catch (error) {
        console.error("Error generating title:", error);
        return "Lección sin título"; // Fallback title
    }
};

export const explainContentWithVoice = async (content: string, voiceMode: VoiceMode, explanationStyle: ExplanationStyle): Promise<string> => {
  if (!content || content.trim().length < 50) {
    throw new Error("El contenido es muy corto. Proporcióname un texto más sustancial para la lección.");
  }
  
  const styleInstruction = getStyleInstruction(explanationStyle);

  // Step 1: Generate the explanation text first, ensuring it's TTS-friendly.
  let textGenerationPrompt: string;
  if (voiceMode === 'dual') {
    textGenerationPrompt = `
      Actúa como un guionista experto para un podcast educativo y ameno. Tu misión es crear un diálogo conversacional entre dos presentadores, Alex y Beto, para explicar el siguiente texto.

      - INSTRUCCIONES DE INICIO (MUY IMPORTANTE):
      1. La conversación DEBE comenzar con Alex presentando el tema principal del tutorial. Por ejemplo: '¡Hola Beto! Hoy vamos a sumergirnos en el fascinante mundo de [TEMA PRINCIPAL DEL TEXTO]'.
      2. Inmediatamente después, Alex debe revisar si el texto menciona ejercicios, material de práctica o archivos específicos.
      3. Si se mencionan archivos, Alex DEBE decir algo como: 'Y para que no nos perdamos, vamos a usar algunos archivos de práctica. Asegúrate de tener a mano [NOMBRE_ARCHIVO_1.ext], [NOMBRE_ARCHIVO_2.ext], etc.'. Beto debe reaccionar con entusiasmo.
      4. Si no se mencionan archivos pero sí ejercicios, Alex debe decirlo. Por ejemplo: 'Veo que este tema incluye varios ejercicios para que podamos practicar mientras avanzamos. ¡Será muy útil!'.

      - Tarea CRÍTICA durante el guion: Cuando la explicación llegue a un ejercicio, Alex debe guiar a Beto (y al oyente) paso a paso sobre cómo completarlo, especialmente si implica usar un software. Beto puede hacer preguntas para aclarar los pasos.
      
      - Perfiles de los presentadores:
        - Alex: Es el experto, apasionado y claro en sus explicaciones.
        - Beto: Es el principiante curioso y entusiasta, hace preguntas para aclarar conceptos.

      - INSTRUCCIÓN DE ESTILO GENERAL: ${styleInstruction}
      
      - REGLAS DE FORMATO (OBLIGATORIAS):
      - El resultado debe ser un guion de texto plano, sin formato Markdown, viñetas, o cualquier otro carácter especial.
      - El formato de cada línea DEBE ser estrictamente 'Alex: [diálogo]' o 'Beto: [diálogo]'.
      - No añadas líneas en blanco entre los diálogos.
      - No incluyas frases introductorias como "Claro, aquí tienes el guion", simplemente empieza la conversación con Alex.

      Este es el texto que deben explicar:
      ---
      ${content}
      ---
    `;
  } else { // single voice mode
    textGenerationPrompt = `
      Actúa como un maestro experto, amigable y apasionado. Tu misión es crear un guion para una explicación de audio sobre el siguiente texto.

      - INSTRUCCIONES DE INICIO (MUY IMPORTANTE):
      1. Tu explicación DEBE comenzar presentando el tema principal del texto. Por ejemplo: '¡Hola! En esta lección, vamos a sumergirnos en [TEMA PRINCIPAL DEL TEXTO]'.
      2. Inmediatamente después, analiza si el texto menciona ejercicios prácticos, material de apoyo o nombres de archivos específicos.
      3. Si se mencionan archivos, DEBES indicarlo claramente y listar sus nombres. Por ejemplo: 'Para que puedas seguirme, usaremos material de práctica. Los archivos que necesitarás son [NOMBRE_ARCHIVO_1.ext] y [NOMBRE_ARCHIVO_2.ext]. ¡Tenlos listos!'.
      4. Si no hay archivos pero sí ejercicios, menciónalo. Por ejemplo: 'A lo largo de esta explicación, encontrarás varios ejercicios para que pongas a prueba tus conocimientos. ¡Vamos a ello!'.

      - Tarea CRÍTICA durante el guion: A lo largo de la explicación, cuando llegues a un ejercicio, proporciona una guía clara y detallada sobre cómo realizarlo. Si se menciona un software, explica las acciones a tomar dentro de ese software.

      - INSTRUCCIÓN DE ESTILO GENERAL: ${styleInstruction}
      
      - REGLAS DE FORMATO (OBLIGATORIAS):
      - El resultado debe ser texto plano, sin formato Markdown, viñetas, encabezados o cualquier otro carácter especial. Solo el texto que se leerá en voz alta.
      - No incluyas frases introductorias como "Claro, aquí tienes tu guion", simplemente empieza la lección.

      Este es el texto que debes explicarme:
      ---
      ${content}
      ---
    `;
  }


  let explanationText = '';
  try {
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: textGenerationPrompt,
    });
    
    const blockReason = textResponse.promptFeedback?.blockReason;
    if (blockReason) {
        throw new Error(`La generación de texto fue bloqueada por seguridad (${blockReason}). Intenta con otro texto.`);
    }

    explanationText = textResponse.text;
    
    if (!explanationText) {
        const finishReason = textResponse.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
             throw new Error(`La generación de texto falló. Razón: ${finishReason}.`);
        }
        throw new Error("La IA no generó una explicación en texto. El guion estaba vacío.");
    }
  } catch (error) {
    console.error("Error calling Gemini Text API:", error);
    const message = error instanceof Error ? error.message : "Revisa la consola para más detalles.";
    throw new Error(`No se pudo generar el guion de la lección. ${message}`);
  }


  // Step 2: Use the generated text to create the audio speech.
  try {
    const ttsConfig: any = { // Use 'any' for flexibility between single and multi-speaker configs
        responseModalities: [Modality.AUDIO],
    };
    if (voiceMode === 'dual') {
        ttsConfig.speechConfig = {
            multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                    { speaker: 'Alex', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                    { speaker: 'Beto', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
                ]
            }
        };
    } else {
        ttsConfig.speechConfig = {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // A professional and friendly voice for single mode
            },
        };
    }
    
    const ttsResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: explanationText }] }],
      config: ttsConfig,
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
        const blockReason = ttsResponse.promptFeedback?.blockReason;
        if (blockReason) {
            throw new Error(`La solicitud de audio fue bloqueada por seguridad (${blockReason}). Intenta con otro texto.`);
        }
        
        const finishReason = ttsResponse.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
             throw new Error(`La generación de audio falló. Razón: ${finishReason}.`);
        }
        
        throw new Error("La IA no generó una respuesta de audio. El contenido podría ser incompatible o vacío.");
    }
    
    return base64Audio;
  } catch (error) {
    console.error("Error calling Gemini TTS API:", error);
    const message = error instanceof Error ? error.message : "Revisa la consola para más detalles.";
    throw new Error(`No se pudo grabar la lección de audio. ${message}`);
  }
};

export const askQuestionAboutContent = async (
  question: string,
  originalContent: string,
  history: ChatMessage[]
): Promise<string> => {
  try {
    const systemInstruction = `Eres un tutor experto y amigable llamado "Maestro Mágico". Un estudiante está escuchando una explicación en audio sobre el siguiente texto. El estudiante tiene una pregunta. Tu tarea es responderla de manera concisa y clara, basándote ÚNICAMENTE en el contenido del texto proporcionado y en el historial de la conversación. No inventes información. Si la respuesta no está en el texto, indícalo amablemente.

    --- TEXTO ORIGINAL DE LA LECCIÓN ---
    ${originalContent}
    --- FIN DEL TEXTO ---`;

    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    contents.push({
      role: 'user',
      parts: [{ text: question }],
    });
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents, 
        config: {
            systemInstruction: systemInstruction,
        }
    });

    const blockReason = response.promptFeedback?.blockReason;
    if (blockReason) {
        throw new Error(`Tu pregunta fue bloqueada por seguridad (${blockReason}). Intenta reformularla.`);
    }

    const responseText = response.text.trim();
    if (!responseText) {
        const finishReason = response.candidates?.[0]?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
             throw new Error(`La IA no pudo responder. Razón: ${finishReason}.`);
        }
        throw new Error("La IA devolvió una respuesta vacía.");
    }

    return responseText;

  } catch (error) {
      console.error("Error asking question:", error);
      const message = error instanceof Error ? error.message : "No se pudo obtener una respuesta de la IA.";
      throw new Error(message);
  }
};