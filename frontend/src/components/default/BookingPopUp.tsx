"use client"

import { useState } from "react";
import Form from "next/form";
import { Slider, Skeleton } from "@radix-ui/themes";
import { Movie } from "@/client";

/*
    The button in the bottom right hand corner of the page that allows the user to open it and select certain values
    before heading to checkout.

    This component should be placed within the body tag of the page.
 */
export default function BookingPopUp() {
    const [isOpen, setIsOpen] = useState(false);
    const movies= ["", "", ""];

    return (
        <>
            {isOpen ? (
                <div className={"fixed bottom-5 right-5 w-[30dvw] h-[70dvh] rounded-md bg-neutral-700 shadow-lg shadow-neutral-800 flex flex-col items-center py-7 px-5 text-neutral-300"}>
                    <h2>Pre-Booking</h2>
                    <PreBookForm bookableMovies={movies/*use context within layout and that can extend to others?*/}></PreBookForm>
                    <button onClick={() => (setIsOpen(current => !current))} className={"absolute top-10 right-10"}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className={"text-neutral-200"}>
                            <path
                                d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            ) : (
                <button onClick={() => (setIsOpen(current => !current))}
                        className={"fixed bottom-10 right-10 flex justify-center items-center w-[70px] h-[70px] rounded-full  bg-red-400"}>
                    <svg width="30" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
                         className={"text-neutral-300 -translate-y-1/10"}>
                        <path
                            d="M8.8914 2.1937C9.1158 2.35464 9.16725 2.66701 9.00631 2.89141L2.47388 12H13.5C13.7761 12 14 12.2239 14 12.5C14 12.7762 13.7761 13 13.5 13H1.5C1.31254 13 1.14082 12.8952 1.0552 12.7284C0.969578 12.5616 0.984438 12.361 1.09369 12.2086L8.19369 2.30862C8.35462 2.08422 8.667 2.03277 8.8914 2.1937ZM11.1 6.50001C11.1 6.22387 11.3238 6.00001 11.6 6.00001C11.8761 6.00001 12.1 6.22387 12.1 6.50001C12.1 6.77615 11.8761 7.00001 11.6 7.00001C11.3238 7.00001 11.1 6.77615 11.1 6.50001ZM10.4 4.00001C10.1239 4.00001 9.90003 4.22387 9.90003 4.50001C9.90003 4.77615 10.1239 5.00001 10.4 5.00001C10.6762 5.00001 10.9 4.77615 10.9 4.50001C10.9 4.22387 10.6762 4.00001 10.4 4.00001ZM12.1 8.50001C12.1 8.22387 12.3238 8.00001 12.6 8.00001C12.8761 8.00001 13.1 8.22387 13.1 8.50001C13.1 8.77615 12.8761 9.00001 12.6 9.00001C12.3238 9.00001 12.1 8.77615 12.1 8.50001ZM13.4 10C13.1239 10 12.9 10.2239 12.9 10.5C12.9 10.7761 13.1239 11 13.4 11C13.6762 11 13.9 10.7761 13.9 10.5C13.9 10.2239 13.6762 10 13.4 10Z"
                            fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                </button>
            )}
        </>
    );
}

/*
    A form including the bookable movies, their times, the amount of tickets, and the ability to continue to checkout.
    When a user chooses a movie it grabs the showtimes for that to replace the skeletons.
    When the user continues to book the values the user chose will be saved in cookies for further use.
 */
function PreBookForm({ bookableMovies }: {bookableMovies: Movie[]}) {

    const [showTimes, setShowTimes] = useState<String[] | null>(null);
    const [numOfTickets, setNumOfTickets] = useState<number>(1);

    /*
        Sets showTimes to current chosen movie.
        Will need to update when we decide how show_times will be in the database.
        Will need figure out finding the amount of tickets left for a movie.
    */
    const handleChange = (event) => {
        setShowTimes(null);
        setNumOfTickets(1);
        if (event.target.value != "") {
            //setShowTimes(bookableMovies.find(movie => movie.title === event.target.value)?.show_times);
            //setNumOfTickets(bookableMovies.find(movie => movie.title === event.target.value)?.tickets);
        }
    }

    return(
        <Form>
            <div>
                <label>Movie</label>
                <select onSelect={handleChange}>
                    <option id={"movieChoice"} value={""}>-- Select a Movie --</option>
                    {bookableMovies.map((movie, index) => (
                        <option key={index} value={movie.title}>{movie.title}</option>
                    ))}
                </select>
            </div>
            <div>
                <p>Times</p>
                {showTimes === null ?
                    {}
                    :
                    {/*showTimes.map((time, index) => {
                            <ShowTimeCard time={time} key={index}/>
                        })*/}
                }
            </div>
            <div>
                <label>Amount of Tickets</label>
                <Slider.Root className="SliderRoot" defaultValue={[1]} min={1} max={numOfTickets} step={1}>
                    <Slider.Track className="SliderTrack">
                        <Slider.Range className="SliderRange" />
                    </Slider.Track>
                    <Slider.Thumb className="SliderThumb" aria-label="Volume" />
                </Slider.Root>
            </div>
        </Form>
    );
}

function ShowTimeCard(time: string | null) {
    return(
        <>
            {time === null ? (
                    <Skeleton>
                        <div className={"rounded-full w-[20px] h-[10px]"}></div>
                    </Skeleton>
                ) : (
                    <>
                        <input type={"radio"} id={time} name={"chosen_movie_time"} value={time}/>
                        <label htmlFor={time}>{time}</label>
                    </>
            )}
        </>
    );
}