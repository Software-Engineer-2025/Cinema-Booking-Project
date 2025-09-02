

export default function Button( { children }: { children?: React.ReactNode } ) {
  return <button className={`px-6 py-2 font-special uppercase text-2xl opacity-60`}>{children}</button>;
}