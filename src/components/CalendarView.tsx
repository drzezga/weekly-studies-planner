
// Import CSS if your build tool supports it
import '@event-calendar/core/index.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MyEvent } from './App';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'
import colors from '../distinctColors';
import { EventClickArg } from '@fullcalendar/core/index.js';
// import { EventInput } from '@fullcalendar/core/index.js';

function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

type CalendarViewProps = {
  events: MyEvent[];
  importCSV: () => void;
  exportCSV: () => void;
  toggleSelectEvent: (id: number) => void;
};

export default function CalendarView({ events, importCSV, exportCSV, toggleSelectEvent }: CalendarViewProps) {

  const parsedEvents = useMemo(() => {
    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    // Get the actual dates of the current week's weekdays
    const lastWeekdays = {
      mon: prevMonday,
      tue: addDays(prevMonday, 1),
      wed: addDays(prevMonday, 2),
      thu: addDays(prevMonday, 3),
      fri: addDays(prevMonday, 4),
      sat: addDays(prevMonday, 5),
      sun: addDays(prevMonday, 6)
    }

    return events.flatMap(
      (ev, i) =>
        ev.hidden // n^2 ugh
          || events.some((ev2, j) => events[j].selected && (j !== i) && (ev.name === ev2.name))
          ? [] :
          ev.occurences.map(occurence => {
            const startTime = new Date(lastWeekdays[occurence.day]);
            const [startHours, startMinutes] = occurence.startTime.split(":");
            startTime.setHours(parseInt(startHours), parseInt(startMinutes));

            const endTime = new Date(startTime);
            const [endHours, endMinutes] = occurence.endTime.split(":");
            endTime.setHours(parseInt(endHours), parseInt(endMinutes));

            return {
              id: i + "::" + ev.name + "-" + startTime.toISOString() + "-" + endTime.toISOString(),
              title: ev.name + "\n\n" + ev.teacher,
              start: startTime,
              end: endTime,
              color: colors[i],
            };
          }))
  }, [events]);

  const zoomLevels = [5, 10, 12, 15, 20, 30];
  const [currentZoomLevel, setCurrentZoomLevel] = useState(2);

  function zoomOut() {
    if (currentZoomLevel < zoomLevels.length - 1)
      setCurrentZoomLevel(currentZoomLevel + 1);
  }

  function zoomIn() {
    if (currentZoomLevel > 0)
      setCurrentZoomLevel(currentZoomLevel - 1);
  }

  const [showWeekend, setShowWeekend] = useState(false);

  function toggleWeekend(): void {
    setShowWeekend(!showWeekend);
  }

  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{ center: "", end: "", left: "importCSV exportCSV", right: "showWeekend + -", start: "" }}
      customButtons={{
        "+": {
          text: "+",
          click: zoomIn
        },
        "-": {
          text: "-",
          click: zoomOut
        },
        showWeekend: {
          text: "Toggle Weekend",
          click: () => toggleWeekend()
        },
        importCSV: {
          text: "Import CSV",
          click: importCSV
        },
        exportCSV: {
          text: "Export CSV",
          click: exportCSV
        },

      }}
      firstDay={1}
      allDaySlot={false}
      // slotLabelInterval={{ minutes: 5 }}
      slotDuration={{ minutes: zoomLevels[currentZoomLevel] }}
      slotLabelFormat={{ hour12: false, minute: '2-digit', hour: "2-digit" }}
      eventTimeFormat={{ hour12: false, minute: '2-digit', hour: "2-digit" }}
      slotMinTime={"7:00"}
      height={"100%"}
      dayHeaderFormat={{ weekday: 'short' }}
      eventClick={(arg: EventClickArg) => {
        let id = parseInt(arg.event.id.split("::")[0]);
        toggleSelectEvent(id);
      }}
      weekends={showWeekend}
      events={parsedEvents}
    />
  )
}
