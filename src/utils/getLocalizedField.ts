import { useState, useEffect } from "react";
import axios from "axios";

interface UseMyMemoryTranslationReturn {
  translatedText: string;
  isLoading: boolean;
  error: string | null;
}

// Caché en memoria a nivel de módulo
// La clave será algo como: "textoOriginal_sourceLang_targetLang"
// El valor será el texto traducido.
const translationCache: { [key: string]: string } = {};

const useMyMemoryTranslation = (
  textToTranslate: string,
  sourceLang: string,
  targetLang: string
): UseMyMemoryTranslationReturn => {
  const [translatedText, setTranslatedText] = useState<string>(textToTranslate);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!textToTranslate || sourceLang === targetLang || !targetLang) {
      setTranslatedText(textToTranslate);
      setIsLoading(false);
      setError(null);
      return;
    }

    const cacheKey = `${textToTranslate}_${sourceLang}_${targetLang}`;

    // 1. Verificar la caché primero
    if (translationCache[cacheKey]) {
      setTranslatedText(translationCache[cacheKey]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const abortController = new AbortController();

    const fetchTranslation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://api.mymemory.translated.net/get",
          {
            params: {
              q: textToTranslate,
              langpair: `${sourceLang}|${targetLang}`,
            },
            signal: abortController.signal,
          }
        );

        if (
          response.data &&
          response.data.responseData &&
          response.data.responseData.translatedText
        ) {
          const fetchedTranslation = response.data.responseData.translatedText;
          translationCache[cacheKey] = fetchedTranslation; // 2. Guardar en caché
          setTranslatedText(fetchedTranslation);
        } else {
          setTranslatedText(textToTranslate);
          setError(
            "La traducción no se pudo obtener o el formato es inesperado."
          );
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Petición de traducción cancelada:", err.message);
        } else {
          console.error("Error al traducir el texto:", err);
          setTranslatedText(textToTranslate);
          setError("Error al conectar con el servicio de traducción.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslation();

    return () => {
      abortController.abort();
    };
  }, [textToTranslate, sourceLang, targetLang]);

  return { translatedText, isLoading, error };
};

export default useMyMemoryTranslation;
