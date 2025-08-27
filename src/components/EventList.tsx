import { MyEvent } from "./App";

type EventListProps = {
  events: MyEvent[];
  colorMap: string[];
  removeEvent: (index: number) => void;
  modifyEvent: (index: number) => void;
  toggleHideEvent: (index: number) => void;
  toggleSelectEvent: (index: number) => void;
};

export function EventList({ events, removeEvent, toggleHideEvent, toggleSelectEvent, modifyEvent, colorMap }: EventListProps) {
  return (
    <div>
      {events.map((event, index) => (
        <div key={index} style={{ display: "inline-flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
          <input type="checkbox" checked={event.selected} onChange={() => toggleSelectEvent(index)} />
          <p style={{ backgroundColor: colorMap && colorMap[index] }}>{event.name} | {event.teacher} | {event.occurences.map(occurence => `${occurence.day} ${occurence.startTime}-${occurence.endTime}; `)}</p>
          <button onClick={() => toggleHideEvent(index)}>{event.hidden ? '🙈' : '👁️'}</button>
          <button onClick={() => modifyEvent(index)}>✏️</button>
          <button onClick={() => removeEvent(index)}>❌</button>
        </div>
      ))}
    </div>
  );
}
