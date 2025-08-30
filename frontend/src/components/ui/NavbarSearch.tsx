import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function NavbarSearch() {
  return (
    <div className="flex items-center gap-2 border-b-2 border-white pb-1 w-full">
      <input
        type="text"
        placeholder="Search a Movie"
        className="bg-transparent text-white font-body placeholder:text-white/30 focus:outline-none w-full"
      />
      <MagnifyingGlassIcon className="w-5 h-5 text-white" />
    </div>
  );
}
