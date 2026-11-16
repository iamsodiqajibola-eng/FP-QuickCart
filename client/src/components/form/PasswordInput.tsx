import { useState } from "react";
import {
  MdLockOutline,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import TextInput, { type TextInputProps } from "./TextInput";

const PasswordInput = (props: Omit<TextInputProps, "type" | "trailing">) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextInput
      icon={MdLockOutline}
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((shown) => !shown)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="text-muted transition-colors hover:text-ink"
        >
          {visible ? (
            <MdOutlineVisibilityOff size={20} />
          ) : (
            <MdOutlineVisibility size={20} />
          )}
        </button>
      }
    />
  );
};

export default PasswordInput;
