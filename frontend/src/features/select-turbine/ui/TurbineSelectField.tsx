import { useTranslation } from "react-i18next";
import { useId } from "react";

import type { TurbineSelection } from "@/entities/turbine";
import { Field, Select, TurbineMark, type SelectOption } from "@/shared/ui";

const TURBINE_OPTIONS: readonly SelectOption<TurbineSelection>[] = [
  { value: "both", label: "Both turbines" },
  { value: "1", label: "Turbine 1" },
  { value: "2", label: "Turbine 2" },
];

type TurbineSelectFieldProps = {
  value: TurbineSelection;
  onChange: (value: TurbineSelection) => void;
  disabled?: boolean;
};

export function TurbineSelectField({ value, onChange, disabled }: TurbineSelectFieldProps) {
  const { t } = useTranslation();
  const selectId = useId();
  return (
    <Field label={t("Turbines")} htmlFor={selectId} icon={<TurbineMark className="h-6 w-5 text-cream/75" />}>
      <Select
        id={selectId}
        value={value}
        options={TURBINE_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))}
        onValueChange={onChange}
        disabled={disabled}
      />
    </Field>
  );
}
