import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./form"; // Tus componentes de UI
import { Input } from "./input"; // Tu componente Input
import { useTranslation } from "react-i18next";
import {
  Control,
  FieldValues,
  Path,
  // ControllerRenderProps, // No se usa directamente aquí
} from "react-hook-form";
import React, { useEffect, useRef, useCallback } from "react"; // Importaciones de React

interface FormAmountProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  className?: string;
}

function FormAmount<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
}: FormAmountProps<TFieldValues>) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  // NUEVO: Estado local para el valor de visualización mientras se edita
  const [displayValue, setDisplayValue] = React.useState<string>("");

  const formatearMoneda = useCallback(
    (valorNumerico: number | string): string => {
      // ... (sin cambios)
      const numero =
        typeof valorNumerico === "string"
          ? parseFloat(valorNumerico.replace(/[^\d.]/g, ""))
          : valorNumerico;
      if (isNaN(numero)) {
        return "";
      }
      return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numero);
    },
    []
  );

  const obtenerValorNumericoCrudo = (valorInput: string): string => {
    // ... (sin cambios)
    return valorInput.replace(/[^\d.]/g, "");
  };

  // Efecto para inicializar y sincronizar displayValue con field.value (formateado)
  // cuando el campo NO está en foco.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      const formValue = control._formValues[name]; // Acceder al valor del formulario directamente
      if (typeof formValue === "number" && !isNaN(formValue)) {
        setDisplayValue(formatearMoneda(formValue));
      } else if (
        formValue === "." ||
        (typeof formValue === "string" && parseFloat(formValue))
      ) {
        const num = parseFloat(formValue);
        setDisplayValue(
          !isNaN(num) ? formatearMoneda(num) : formatearMoneda(0)
        );
      } else if (formValue === undefined || formValue === "") {
        setDisplayValue(""); // Mostrar vacío si el valor del form es undefined o ""
      } else {
        // Por si acaso llega un valor inesperado, intentar formatearlo o mostrar vacío
        setDisplayValue(formatearMoneda(0));
      }
    }
  }, [control._formValues[name], name, control, formatearMoneda]); // Depender del valor real del formulario

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const manejarCambioInput = (e: React.ChangeEvent<HTMLInputElement>) => {
          const valorActualInput = e.target.value;
          // Actualiza el displayValue inmediatamente con lo que el usuario escribe
          setDisplayValue(valorActualInput);

          let valorLimpio = obtenerValorNumericoCrudo(valorActualInput);

          if (valorLimpio === "") {
            field.onChange(undefined); // Campo vacío
            return;
          }
          if (valorLimpio === ".") {
            field.onChange("."); // Permitir solo un punto inicialmente
            return;
          }

          const partes = valorLimpio.split(".");
          if (partes.length > 2) {
            // Múltiples puntos
            // Tomar solo hasta el segundo punto y quitar el resto
            valorLimpio = partes[0] + "." + partes[1].slice(0, 2);
            // Actualizar también el displayValue para que el usuario no vea los puntos extra
            setDisplayValue(valorLimpio);
          }

          // Si el valor limpio termina en punto (y es el único punto)
          if (valorLimpio.endsWith(".") && partes.length <= 2) {
            field.onChange(valorLimpio);
          } else {
            // Es un número o candidato a número
            const valorNumerico = parseFloat(valorLimpio);
            if (!isNaN(valorNumerico)) {
              // Limitar decimales en el valor que se guarda en el form state
              const valorConDecimalesLimitados = parseFloat(
                valorNumerico.toFixed(2)
              );
              field.onChange(valorConDecimalesLimitados);
            } else {
              // Si no es un número válido después de limpiar (ej. "abc"),
              // y no es vacío ni solo un punto (ya manejados),
              // podrías limpiar el form state o dejar que la validación lo maneje.
              // Por ahora, si se vuelve inválido, podría ser undefined.
              field.onChange(undefined);
            }
          }
        };

        const manejarBlurInput = () => {
          const valorActualFormulario = field.value; // Valor del estado de RHF
          if (
            typeof valorActualFormulario === "number" &&
            !isNaN(valorActualFormulario)
          ) {
            setDisplayValue(formatearMoneda(valorActualFormulario));
          } else if (valorActualFormulario === ".") {
            setDisplayValue(formatearMoneda(0)); // o "" si prefieres para un "." solo
            field.onChange(0); // Actualizar el form state también
          } else if (
            typeof valorActualFormulario === "string" &&
            valorActualFormulario === ""
          ) {
            setDisplayValue("");
          } else {
            // Si es undefined, o un string que no es "." ni ""
            setDisplayValue(formatearMoneda(0)); // Formatear como 0 o vacío
            if (field.value !== undefined && field.value !== 0) {
              // Evitar loop si ya es 0 o undefined
              field.onChange(0); // Actualizar el form state si estaba inválido/undefined
            }
          }
          field.onBlur(); // Importante para la validación de RHF
        };

        const manejarFocusInput = () => {
          const valorActualFormulario = field.value;
          if (typeof valorActualFormulario === "number") {
            // Si es "0", mostrar vacío para que el usuario pueda escribir fácilmente
            setDisplayValue(
              valorActualFormulario === 0
                ? ""
                : valorActualFormulario.toString()
            );
          } else if (typeof valorActualFormulario === "string") {
            // Podría ser "."
            setDisplayValue(valorActualFormulario);
          } else {
            // undefined
            setDisplayValue("");
          }
        };

        return (
          <FormItem>
            <FormLabel>{label ? t(label) : t(name)}</FormLabel>
            <FormControl>
              <Input
                name={field.name}
                ref={(e: HTMLInputElement | null) => {
                  field.ref(e);
                  inputRef.current = e;
                }}
                value={displayValue} // Usar el estado local para el valor del input
                placeholder={placeholder || t(`${name}.placeholder`, name)}
                className={className}
                type="text" // Importante para el formateo
                onChange={manejarCambioInput}
                onBlur={manejarBlurInput}
                onFocus={manejarFocusInput}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default FormAmount;
