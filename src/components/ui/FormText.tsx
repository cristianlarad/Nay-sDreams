import { FormField } from "./form";
import { FormItem } from "./form";
import { FormLabel } from "./form";
import { FormControl } from "./form";
import { FormMessage } from "./form";
import { Textarea } from "./textarea";
import { useTranslation } from "react-i18next";
import { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "./input";

interface FormTextProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  className?: string;
  type?: "text" | "textArea";
}

function FormText<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  type,
}: FormTextProps<TFieldValues>) {
  const { t } = useTranslation();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(label ?? "")}</FormLabel>
          <FormControl>
            {type === "textArea" ? (
              <Textarea
                placeholder={placeholder || t(`${name}.placeholder`)}
                {...field}
                className={`min-h-[120px] resize-y ${className}`}
              />
            ) : (
              <Input
                placeholder={placeholder || t(`${name}.placeholder`)}
                {...field}
                className={className}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormText;
