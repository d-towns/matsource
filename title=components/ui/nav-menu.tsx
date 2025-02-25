import React from 'react';
import { cn } from '@/lib/utils';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';

const ListItem = React.forwardRef<
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-transparent text-foreground hover:bg-muted focus:bg-muted",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
>(null);

ListItem.displayName = "ListItem";

export default ListItem; 