import {type ComponentProps, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

/**
 * A standardized button component with variants.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading = false, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2";

    const variantClasses = {
      primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500",
      danger: "bg-yellow-500 text-gray-900 hover:bg-yellow-600 focus:ring-yellow-400",
    };

    const finalClasses = `${baseClasses} ${variantClasses[variant]} ${className || ''}`;

    return (
      <button ref={ref} className={finalClasses} disabled={isLoading} {...props}>
        {isLoading ? (
          <span className="animate-spin h-5 w-5 border-b-2 border-current rounded-full" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
