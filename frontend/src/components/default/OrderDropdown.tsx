"use client"

import {useState} from "react";

export default function OrderDropdown({ order }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const bookingDate = new Date(order.booking_date);

    return(
        <div className={"w-full flex flex-col items-end"}>
            <div className={"w-full flex flex-row justify-between items-center border rounded-xs p-4 font-bold"} onClick={() => setIsOpen(prevState => !prevState)}>
                <div>Order {order.booking_id} : {bookingDate.toLocaleString()}</div>
                <div>
                    {isOpen ? (
                        <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                    ) : (
                        <svg width="25" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6.18194 4.18185C6.35767 4.00611 6.6426 4.00611 6.81833 4.18185L9.81833 7.18185C9.90272 7.26624 9.95013 7.3807 9.95013 7.50005C9.95013 7.6194 9.90272 7.73386 9.81833 7.81825L6.81833 10.8182C6.6426 10.994 6.35767 10.994 6.18194 10.8182C6.0062 10.6425 6.0062 10.3576 6.18194 10.1819L8.86374 7.50005L6.18194 4.81825C6.0062 4.64251 6.0062 4.35759 6.18194 4.18185Z"
                                fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                    )}
                </div>
            </div>
            {isOpen ? (
                <div className={"flex flex-col w-[75dvw] text-white/70"}>
                    <DropdownBar>
                        Movie: {order.show?.movie?.title}
                    </DropdownBar>
                    <DropdownBar>
                        Total Price: $ {order.total_amount}
                    </DropdownBar>
                    <DropdownBar>
                        Card Used: XXXX-XXXX-XXXX-{order.paymentcards?.card_last_four}
                    </DropdownBar>
                    {order.ticket?.map((tick) => {
                        return <DropdownBar>1 x {tick.ticket_type.toUpperCase()} Ticket : Price -
                            $ {tick.price}</DropdownBar>
                    })}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

function DropdownBar({children}) {
    return (
        <div className={"w-full flex flex-row justify-between items-center border rounded-xs p-4"}>
            {children}
        </div>
    );
}