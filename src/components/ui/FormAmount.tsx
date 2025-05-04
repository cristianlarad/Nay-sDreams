import { FormField } from "./form";
import { FormItem } from "./form";
import { FormLabel } from "./form";
import { FormControl } from "./form";
import { FormMessage } from "./form";
import { Input } from "./input";
import { useTranslation } from "react-i18next";
import { Control, FieldValues, Path } from "react-hook-form";

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

  const formatCurrency = (value: string) => {
    // Eliminar caracteres no numéricos
    const numericValue = value.replace(/[^\d.]/g, "");

    // Convertir a número con dos decimales
    const formattedValue = parseFloat(numericValue).toFixed(2);

    // Formatear como moneda de EE.UU.
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(formattedValue));
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel>{t(label ?? "")}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder || t(`${name}.placeholder`)}
              className={className}
              type="text"
              onChange={(e) => {
                const value = e.target.value;
                const numericValue = value.replace(/[^\d.]/g, "");
                onChange(parseFloat(numericValue) || 0);
              }}
              onBlur={(e) => {
                const value = e.target.value;
                e.target.value = formatCurrency(value);
              }}
              onFocus={(e) => {
                const value = e.target.value.replace(/[^\d.]/g, "");
                e.target.value = value;
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormAmount;
