import Button from "../ui/Button";
import NavbarSearch from "../ui/NavbarSearch";
import ProfileIcon from "../ui/ProfileIcon";

export default function Navbar() {
    return(
        <div>
            <nav className="w-full p-4 px-8 text-white flex justify-between items-center font-[var(--font-annapurna)] bg-black relative">
                {/* LEFT ITEMS */}
                <div className="flex items-center gap-8 w-full">
                    <div className="flex items-center">
                        <img src="/logo-cinema.png" alt="Logo" className="w-12 h-12 inline-block mr-2"/>
                        <span className="text-4xl uppercase font-special">Cinema</span>
                    </div>
                    <div className="space-x-4">
                        <Button children="movies" />
                        <Button children="book a ticket"/>
                    </div>
                </div>


                {/* RIGHT ITEMS */}
                <div className="flex items-center gap-4 max-w-lg w-full">   
                    <NavbarSearch />
                    <ProfileIcon />

                </div>

            </nav>
            {/* BLACK GRADIENT EFFECT */}
            <div className="left-0 w-full h-8 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>

        </div>
        
    )
}