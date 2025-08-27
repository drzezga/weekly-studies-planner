import { WeekView } from "react-weekview";
import "../index.css";

import { useLocalStorage } from "usehooks-ts";
import { useMemo, useState } from "react";
import { defaultEvent, EventEditor } from "./EventEditor";
import { EventList } from "./EventList";
import CalendarView from "./CalendarView";
import colors from "../distinctColors";

export type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface Occurence {
  day: Day;
  startTime: string;
  endTime: string;
};

export interface MyEvent {
  name: string,
  teacher: string,
  occurences: Occurence[],
  selected: boolean;
  hidden: boolean;
}


export function App() {
  const [events, setEvents, resetEvents] = useLocalStorage<MyEvent[]>('events', []);
  const [currentEvent, setCurrentEvent] = useState<MyEvent>(defaultEvent());

  const addEvent = (event: MyEvent) => {
    setEvents([...events, event]);
  };

  function createEvent() {
    if (currentEvent.name == "" || currentEvent.teacher == "" || currentEvent.occurences.length == 0) {
      alert("Please fill in all fields");
      return;
    }
    for (let occurence of currentEvent.occurences) {
      if (occurence.startTime == "" || occurence.endTime == "") {
        alert("Please fill in all fields");
        return;
      }
    }
    addEvent(currentEvent);
    setCurrentEvent(defaultEvent());
  }

  const removeEvent = (index: number) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  const modifyEvent = (index: number) => {
    setCurrentEvent(events[index]);
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  const toggleHideEvent = (index: number) => {
    const updatedEvents = [...events];
    updatedEvents[index].hidden = !updatedEvents[index].hidden;
    setEvents(updatedEvents);
  };

  const toggleSelectEvent = (index: number) => {
    const updatedEvents = [...events];
    for (let i = 0; i < events.length; i++) {
      if (i !== index && updatedEvents[i].name == updatedEvents[index].name) {
        updatedEvents[i].selected = false;
      }
    }
    updatedEvents[index].selected = !updatedEvents[index].selected;
    setEvents(updatedEvents);
  };

  return (
    <div className="app">
      <div style={{ gridArea: "cal" }}>
        <CalendarView events={events} importCSV={() => { }} exportCSV={() => { }} toggleSelectEvent={toggleSelectEvent} />
      </div>
      <div style={{ gridArea: "list", overflow: "scroll", padding: "1em" }}>
        <EventList events={events} colorMap={colors} toggleHideEvent={toggleHideEvent} toggleSelectEvent={toggleSelectEvent} removeEvent={removeEvent} modifyEvent={modifyEvent} />
      </div>
      <div style={{ gridArea: "editor", padding: "1em" }}>
        <EventEditor
          currentEvent={currentEvent}
          setCurrentEvent={setCurrentEvent}
          createEvent={createEvent}
          suggestedNames={[...(new Set(events.map(event => event.name)))]}
          suggestedTeachers={[...(new Set(events.map(event => event.teacher)))]}
        />
      </div>
    </div>
  );

}

export default App;
