// src/components/ui/ExpandableText.tsx (NUEVO ARCHIVO)
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ExpandableTextProps {
  text: string;
  lineLimit: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, lineLimit }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        // Esta es una forma de verificar si el contenido desborda el contenedor
        // Para line-clamp, necesitamos ver si el scrollHeight es mayor que el clientHeight
        // cuando el line-clamp está potencialmente activo.
        // O, más simple, si el número de líneas real (si pudiéramos calcularlo) excede el lineLimit.
        // CSS line-clamp es más directo para el truncamiento visual.
        // La necesidad del botón "Ver más" se puede determinar si el texto es suficientemente largo.

        // Estimación simple basada en la longitud del texto y una longitud promedio de línea.
        // Una solución más precisa requeriría medir el texto renderizado.
        // Por ahora, vamos a asumir que si el texto tiene más de X caracteres, podría desbordar.
        // Una mejor aproximación para line-clamp: si el texto es largo, asumimos que puede necesitar "Ver más".
        // Un cálculo exacto post-renderizado es más complejo.
        // Vamos a basar la aparición del botón "Ver más" en una heurística de longitud de texto,
        // ya que `line-clamp` no nos dice directamente si truncó o no de forma programática fácil.

        // Heurística: si el texto tiene más de (lineLimit * 50) caracteres (aprox. 50 chars/línea)
        if (text.length > lineLimit * 50) {
          // Ajusta este multiplicador según sea necesario
          setIsOverflowing(true);
        } else {
          setIsOverflowing(false);
        }
      }
    };

    checkOverflow();
    // Podríamos añadir un listener a window.resize si el contenedor cambia de tamaño.
    // window.addEventListener('resize', checkOverflow);
    // return () => window.removeEventListener('resize', checkOverflow);
  }, [text, lineLimit]);

  // Otra forma de manejar la visibilidad del botón "Ver más" es renderizar dos veces
  // o medir. Por simplicidad con line-clamp, si es potencialmente largo, mostramos el botón.

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <p
        ref={textRef}
        className={`whitespace-pre-wrap break-words ${
          !isExpanded ? `line-clamp-${lineLimit}` : ""
        }`}
      >
        {text}
      </p>
      {isOverflowing && (
        <button
          onClick={toggleExpanded}
          className="text-pink-500 cursor-pointer hover:text-pink-700 text-sm mt-1"
        >
          {isExpanded ? t("see.less") : t("see.more")}
        </button>
      )}
    </div>
  );
};

// Es importante que configures Tailwind para que reconozca `line-clamp-*`
// En tu tailwind.config.js, asegúrate de tener el plugin @tailwindcss/line-clamp:
// plugins: [
//   require('@tailwindcss/line-clamp'),
// ],
// Y luego puedes usar clases como line-clamp-1, line-clamp-2, line-clamp-4, etc.
// Si no quieres usar el plugin, tendrías que usar CSS más manual.
// Para este ejemplo, asumiré que `line-clamp-4` (o el número que sea) está disponible.
// Si `lineLimit` es dinámico y no quieres generar todas las clases `line-clamp-N`,
// podrías usar style en su lugar, pero es menos "Tailwindy".
// style={!isExpanded ? { WebkitLineClamp: lineLimit, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}}

export default ExpandableText;
