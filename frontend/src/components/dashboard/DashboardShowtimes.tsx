import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {allPromosQuery, allShowroomsQuery} from "@/lib/utils/queries";
import {Showroom} from "@/client";

export default function DashboardShowtimes({ movie, onClose, onUpdate }) {
  const [showtimes, setShowtimes] = useState(movie.show_times || []);
  const [newShowtime, setNewShowtime] = useState("");
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [selectedShowroom, setSelectedShowroom] = useState([]);

  const { data: allShowrooms = [], refetch: refetchPromos } = useQuery(allShowroomsQuery());

  useEffect(() => {
    setShowrooms(allShowrooms)
  }, [allShowrooms]);

  const handleAddShowtime = () => {
    if (newShowtime.trim()) {
      const updated = [...showtimes, newShowtime];
      setShowtimes(updated);
      setNewShowtime("");
    }
  };

  const handleDeleteShowtime = (index) => {
    const updated = showtimes.filter((_, i) => i !== index);
    setShowtimes(updated);
  };

  const handleSave = () => {
    //onUpdate(movie.movie_id, showtimes);
    onClose();
  };

  const formatShowtime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            Showtimes for "{movie.title}"
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <input
                type="datetime-local"
                value={newShowtime}
                onChange={(e) => setNewShowtime(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                placeholder="Add new showtime"
            />

            <select
                value={selectedShowroom}
                onChange={(e) => setSelectedShowroom(e.target.value)}
                className="border rounded px-3 py-2"
            >
              <option value="">Showroom?</option>
              {showrooms.map((showroom) => (
                  <option key={showroom.showroom_id} value={showroom.showroom_id}>
                    {showroom.showroom_id}
                  </option>
              ))}
            </select>

            <button
                onClick={handleAddShowtime}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {showtimes.length === 0 ? (
                <p className="text-gray-500 text-sm">No showtimes added yet</p>
            ) : (
                showtimes.map((time, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center border rounded px-4 py-2 bg-gray-50"
                >
                  <span>{formatShowtime(time)}</span>
                  <button
                    onClick={() => handleDeleteShowtime(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
