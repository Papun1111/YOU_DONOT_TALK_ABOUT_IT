import {type ComponentProps } from 'react';

interface SpinnerProps extends ComponentProps<'div'> {
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A simple loading spinner component.
 */
const Spinner = ({ size = 'md', className, ...props }: SpinnerProps) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  const spinnerClasses = `animate-spin rounded-full border-red-500 border-t-transparent ${sizeClasses[size]} ${className || ''}`;

  return <div className={spinnerClasses} role="status" {...props} />;
};

export default Spinner;
