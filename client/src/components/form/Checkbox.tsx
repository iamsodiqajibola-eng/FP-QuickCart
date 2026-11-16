import type { InputHTMLAttributes, ReactNode } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  children: ReactNode;
  error?: string;
};

const Checkbox = ({
  children,
  error,
  className = "",
  ...inputProps
}: CheckboxProps) => {
  return (
    <div className={className}>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-ink-soft">
        <input
          type="checkbox"
          className="mt-0.5 size-4.5 shrink-0 cursor-pointer accent-primary"
          {...inputProps}
        />
        <span>{children}</span>
      </label>

      {error && (
        <p className="mt-1.5 text-[13px] leading-4.5 text-danger">{error}</p>
      )}
    </div>
  );
};

export default Checkbox;
