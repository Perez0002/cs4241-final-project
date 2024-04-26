import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types"

function EventTitle({ eventName, isAdmin }) {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [eventDate, setEventDate] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    const [eventGuests, setEventGuests] = useState(0);
    const [eventUserGuests, setEventUserGuests] = useState(0);
    let thisEvent = null;

    function formatEventDate(dateString) {
        const eventDate = new Date(dateString);
      
        // Options for date and time formatting
        const options = {
          month: 'numeric', // Display month as a number (e.g., "12" for December)
          day: '2-digit',   // Display day as two digits (e.g., "25")
          year: 'numeric',  // Display year as a number (e.g., "2024")
          hour: 'numeric',  // Display hour as a number (e.g., "10" for 10PM)
          minute: '2-digit', // Display minute as two digits (e.g., "00")
          hour12: true      // Use 12-hour format (true for AM/PM)
        };
      
        // Format the date string using options
        const formattedDate = eventDate.toLocaleString('en-US', options);
        
        return formattedDate;
    }

    const getUpcomingEvents = async () => {
        try {
          const response = await fetch("//localhost:3000/api/getUpcomingEvents", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: localStorage.getItem("token") }),
          });
  
            const _events = await response.json();
            setEvents(_events);
        } catch (error) {
          console.error("Error getting events:", error);
        }
      };

    const handleManageEventPage = async (event) => {
        event.preventDefault();
        navigate("/event/manage/" + encodeURI(eventName));
    };

    useEffect(() => {
      getUpcomingEvents();
      thisEvent = events.find(event => event.name === eventName)
      if (thisEvent) {
        const formattedDateString = formatEventDate(thisEvent.date);
        setEventDate(formattedDateString);
        setEventLocation(thisEvent.location);
        setEventGuests(thisEvent.guestCount);
        setEventUserGuests(thisEvent.userInvites);
      }
    }, [events, eventName]);

  return (
    <div>
      <table className="table bg-neutral rounded-none">
        <thead>
          <tr style={{fontSize:  "1rem"}}>
            <th>{eventName}</th>
            <th>Date: {eventDate}</th>
            <th>Location: {eventLocation}</th>
            <th>Total Guests: {eventGuests}</th>
            <th>Your Guest Count: {eventUserGuests}</th>
            {isAdmin && (
                <th>
                    <button
                    className="btn btn-primary ml-2 mt-3 text-black font-bold"
                    type="button"
                    id="manageEventPageButton"
                    onClick={handleManageEventPage}
                    >
                    Manage Event
                    </button>
                </th>
            )}
          </tr>
        </thead>
      </table>
    </div>
  );
}

EventTitle.propTypes = {
  eventName: PropTypes.string,
  isAdmin: PropTypes.bool
}

export default EventTitle;