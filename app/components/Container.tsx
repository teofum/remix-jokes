type Props = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function Container({ children, className, ...props }: Props) {
  return (
    <div
      className={`
        w-lg
        max-w-[calc(100%-1rem*2)]
        md:max-w-[calc(100%-2.5rem*2)]
        mx-auto
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
