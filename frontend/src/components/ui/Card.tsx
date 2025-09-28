import {type ComponentProps, forwardRef } from 'react';

type CardProps = ComponentProps<'div'>

/**
 * A simple, styled container component with a card-like appearance.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    const cardClasses = `bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg p-6 ${className || ''}`;

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
