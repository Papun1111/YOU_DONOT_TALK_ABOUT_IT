import {type ComponentProps, forwardRef } from 'react';

type InputProps = ComponentProps<'input'>

/**
 * A styled text input component for forms.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const inputClasses = `w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md
                          text-gray-200 placeholder-gray-400 
                          focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                          transition-colors ${className || ''}`;
    
    return <input ref={ref} className={inputClasses} {...props} />;
  }
);

Input.displayName = "Input";
export default Input;
