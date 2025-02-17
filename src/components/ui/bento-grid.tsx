import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 w-full", className)}
    >
      {children}
    </div>
  );
};

/*
cool implementation for later --> add moving highlighted borders

*/
export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  children,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group hover:shadow-xl transition duration-200 shadow-input p-4 bg-black border border-stone-400 justify-between flex flex-col space-y-4",
        className,
      )}
    >
      {header}
      <div>
        {icon}

        <div className="group-hover:translate-x-2 transition duration-200">
          {title && (
            <div className="font-sans font-bold text-white mb-2 mt-2">
              {title}
            </div>
          )}
          {description && (
            <div className="font-sans font-normal text-gray-400 text-xs">
              {description}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
