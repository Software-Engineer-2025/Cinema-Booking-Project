import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {
  allShowroomsQuery,
  getShowsByMovieIDQuery,
  useAddShowCard, useDeleteShowByIdCard
} from "@/lib/utils/queries";
import {Show, ShowCreate, Showroom} from "@/client";
import {toast} from "sonner";

export default function DashboardShowtimes({ movie, onClose, onUpdate, refetch}) {
  const [newShowtime, setNewShowtime] = useState("");
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [selectedShowroom, setSelectedShowroom] = useState<number>(-1);
  const [shows, setShows] = useState<Show[]>([]);


  const { data: allShows = [], refetch: refetchShows } = useQuery(
      getShowsByMovieIDQuery(parseInt(movie.movie_id))
  );
  const { data: allShowrooms = [], refetch: refetchShowrooms } = useQuery(allShowroomsQuery());

  useEffect(() => {
    setShowrooms(allShowrooms)
  }, [allShowrooms]);

  useEffect(() => {
    setShows(allShows)
  }, [allShows]);

  const addShow = useAddShowCard();

  const handleAddShowtime = () => {
    try {
      if (selectedShowroom === -1) {
        throw new Error("Showroom not selected.")
      }

      // puts Date into string value that can be passed to the database
      const dateTime = new Date(newShowtime);
      const date = dateTime.toISOString().split('T')[0] || "";
      const time = dateTime.toTimeString().split(' ')[0] || "";
      const showToAdd: ShowCreate = {
        movie_id: movie.movie_id,
        showroom_id: selectedShowroom || -1,
        date: date,
        time: time,
      }

      // adds ShowCreate object to the database
      addShow.mutateAsync(showToAdd, {
        onSuccess: () => {
          refetch();
          toast("Showtime has been added!", {
            description: `Show for movie_id: ${showToAdd.movie_id} has been created.`,
            action: {
              label: "done"
            }
          });
          onClose();
        },
        onError: () => {
          refetch();
          toast("Showtime has failed to be created!", {
            description: `Show for movie_id: ${showToAdd.movie_id} has not been created due to a conflict error`,
            action: {
              label: "done"
            }
          });
        }
      });
    } catch (error) {
      toast("There was an error when trying to add the showtime!", {
        description: error.message,
        action: {
          label: "done"
        }
      });
    }
  }

  const deleteShow = useDeleteShowByIdCard();

  const handleDeleteShowtime = (show_id) => {
    deleteShow.mutate(show_id, {
      onSuccess: () => {
        toast("Showtime deleted!", {
          description: `Show ${show_id} has been deleted.`,
          action: {
            label: "done"
          }
        });
        refetch();
        onClose();
      },
      onError: () => {
        toast("The showtime has failed to be deleted!", {
          description: `Show ${show_id} persists, HAZAH`,
          action: {
            label: "done"
          }
        });
        refetch();
        onClose();
      }
    });
  };

  // formats the date from the database to a version that looks good for the user
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  // formats the time from the database to a version that looks good for the user
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const timeObj = new Date();
    timeObj.setHours(parseInt(hours), parseInt(minutes));
    return timeObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

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
                onChange={(e) => setSelectedShowroom(parseInt(e.target.value))}
                className="border rounded px-3 py-2"
            >
              <option value="-1">Showroom?</option>
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
            {shows.length === 0 ? (
                <p className="text-gray-500 text-sm">No showtimes added yet</p>
                ) : (
                shows?.map((index) => (
                    <div
                        key={index.show_id}
                        className="flex justify-between items-center border rounded px-4 py-2 bg-gray-50"
                    >
                    <span>{formatDate(index.date)} {formatTime(index.time)}</span>
                    <span>Showroom: {index.showroom_id}</span>
                    <button
                      onClick={() => handleDeleteShowtime(index.show_id)}
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
                )))
            }
          </div>
        </div>

        {/*
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
        */}
      </div>
    </div>
  );
}
