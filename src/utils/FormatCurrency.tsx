interface FormatCurrencyProps {
  value: number | undefined;
}

export const FormatCurrency = ({ value }: FormatCurrencyProps) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  if (!value) {
    return 0;
  }
  return <>{formatter.format(value)}</>;
};
