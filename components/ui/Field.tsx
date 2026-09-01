import type { ComponentProps } from "react";

type FieldProps = {
  label: string;
  name: string;
  errors?: string[];
  hint?: string;
} & Omit<ComponentProps<"input">, "id" | "name" | "className">;

export function Field({ label, name, errors, hint, ...rest }: FieldProps) {
  const invalid = Boolean(errors?.length);
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const describedBy =
    [invalid ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="font-display text-sm font-bold text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="field-input"
        {...rest}
      />
      {hint && !invalid && (
        <p id={hintId} className="text-xs text-ink-faint">
          {hint}
        </p>
      )}
      {invalid && (
        <p id={errorId} className="text-xs font-semibold text-danger">
          {errors?.[0]}
        </p>
      )}
    </div>
  );
}
