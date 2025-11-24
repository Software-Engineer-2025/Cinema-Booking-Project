import { useState } from "react";
import EditableCell from "./EditableCell";
import ShowtimesModal from "./DashboardShowtimes";
import {toast} from "sonner";

export default function MovieTable({ movies, onUpdate, onDelete, onSave, refetch}) {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const columns = [
    "title",
    "release_date",
    "director",
    "cast_list",
    "genre",
    "rating",
    "producer",
    "mpaa_rating",
    "trailer_img",
    "trailer_video",
    "synopsis",
    "reviews",
    "released",
    "featured",
    "duration"
  ];

  const handleUpdateShowtimes = (movieId, showtimes) => {
    onUpdate(movieId, "show_times", showtimes);
  };

  // Shows a specific toast messaged if passedVal (the movie_id) is negative (when it's not saved yet) or not
  const toastNotAvailable = (passedVal: number) => {
    if (passedVal < 0) {
      toast("Unable to edit unadded movie showtime!", {
        description: "Please save the movie then you can add showtimes.",
        action: {
          label: "done"
        }
      });
    } else {
      toast("Unable to edit coming soon movie!", {
        description: "Make sure to add showtimes only to currently running movies.",
        action: {
          label: "done"
        }
      });
    }
  }

  return (
    <>
      <div className="overflow-x-auto border ">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-black">
          <tr>
            <th className="text-left p-3 font-semibold text-white border-b w-12"></th>
            {columns.map((col) => (
                <th
                    key={col}
                    className="text-left p-3 font-semibold text-white border-b capitalize"
                >
                  {col.replaceAll("_", " ")}
                </th>
            ))}
            <th className="text-left p-3 font-semibold text-white border-b">
              Showtimes
            </th>
            <th className="text-left p-3 font-semibold text-white border-b w-12"></th>
          </tr>
          </thead>
          <tbody>
          {movies.map((movie) => (
              <tr key={movie.movie_id} className="hover:bg-gray-50/50">
                <td className="p-3 border-b bg-white/10">
                  <button
                      onClick={() => onDelete(movie.movie_id)}
                      className="cursor-pointer hover:text-red-600"
                  >
                    <svg
                        width="30"
                        height="30"
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
                </td>
                {columns.map((col) => (
                    <EditableCell
                        key={col}
                        value={movie[col]}
                        onChange={(val) => onUpdate(movie.movie_id, col, val)}
                    />
                ))}
                <td className="p-3 border-b bg-white/10">
                  <button
                      onClick={movie.movie_id >= 0 && movie.released ? () => setSelectedMovie(movie) : () => toastNotAvailable(movie.movie_id)}
                      className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm"
                  >
                    Edit
                  </button>
                </td>
                <td className="p-3 border-b bg-white/10">
                  <button
                      onClick={() => onSave(movie)}
                      className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm"
                  >
                    Save
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>

      {selectedMovie && (
          <ShowtimesModal
              movie={selectedMovie}
              onClose={() => setSelectedMovie(null)}
              onUpdate={handleUpdateShowtimes}
              refetch={refetch}
          />
      )}
    </>
  );
}
