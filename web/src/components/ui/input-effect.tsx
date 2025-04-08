import React, { forwardRef, InputHTMLAttributes } from "react";
import "./input-effect.css";

interface InputEffectProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "required"> {
  label: string;
  required?: boolean;
}

export const InputEffect = forwardRef<HTMLInputElement, InputEffectProps>(
  ({ label, required = true, className = "", ...props }, ref) => {
    // Split the label into individual characters
    const characters = label.split("");

    return (
      <div className="form-control">
        <input
          type="text"
          required={required}
          className={className}
          ref={ref}
          {...props}
        />
        <label>
          {characters.map((char, index) => (
            <span
              key={`${char}-${index}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {char}
            </span>
          ))}
        </label>
      </div>
    );
  }
);
