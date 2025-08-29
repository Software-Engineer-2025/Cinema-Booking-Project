import Button from "../ui/Button";

export default function Navbar() {
    return(
        <nav className="w-full p-4 bg-gray-800 text-white flex justify-between items-center">
            <div className="text-2xl font-bold">Cinema</div>
            <div className="space-x-4">
                <Button />
                <Button />
                <Button />
            </div>
        </nav>
    )
}