import addTimes from "../addTimes";
import { Day, MyEvent, Occurence } from "./App";

export const defaultOccurence = (): Occurence => ({
  day: "mon",
  startTime: "15:00",
  endTime: "16:30",
} as Occurence);

export const defaultEvent = (): MyEvent => ({
  name: "",
  teacher: "",
  occurences: [
    defaultOccurence()
  ],
  selected: false,
  hidden: false,
});


type EventEditorProps = {
  currentEvent: MyEvent;
  setCurrentEvent: React.Dispatch<React.SetStateAction<MyEvent>>;
  createEvent: () => void;
  suggestedNames: string[];
  suggestedTeachers: string[];
};

function OccurenceEditor({ occurence, setOccurence }: { occurence: Occurence, setOccurence: (o: Occurence) => void }) {
  function setDay(event: React.ChangeEvent<HTMLSelectElement>) {
    setOccurence({ ...occurence, day: event.target.value as Day });
  }

  function setStartTime(event: React.ChangeEvent<HTMLInputElement>) {
    setOccurence({ ...occurence, endTime: addTimes(event.target.value, "00:45"), startTime: event.target.value });
  }

  function setEndTime(event: React.ChangeEvent<HTMLInputElement>) {
    setOccurence({ ...occurence, endTime: event.target.value });
  }

  return <div>
    <label htmlFor="day">Day:</label>
    <select value={occurence.day} onChange={setDay}>
      <option value="mon">Monday</option>
      <option value="tue">Tuesday</option>
      <option value="wed">Wednesday</option>
      <option value="thu">Thursday</option>
      <option value="fri">Friday</option>
      <option value="sat">Saturday</option>
      <option value="sun">Sunday</option>
    </select>

    <br />

    <label htmlFor="startTime">Time:</label>
    <input type="time" step={900} min="7:30" max="21:30" id="startTime" value={occurence.startTime} onChange={setStartTime} />
    {/*<br />*/}
    <label htmlFor="endTime"> until </label>
    <input type="time" step={900} min="7:30" max="21:30" id="endTime" value={occurence.endTime} onChange={setEndTime} />
  </div>
}

export function EventEditor({ currentEvent, setCurrentEvent, createEvent, suggestedNames, suggestedTeachers }: EventEditorProps) {
  const setOccurenceCurry = (index: number) => (occurence: Occurence) => {
    const newOccurences = [...currentEvent.occurences];
    newOccurences[index] = occurence;
    setCurrentEvent({ ...currentEvent, occurences: newOccurences });
  };

  const setName = (name: string) => {
    setCurrentEvent({ ...currentEvent, name });
  };

  const setTeacher = (teacher: string) => {
    setCurrentEvent({ ...currentEvent, teacher });
  };

  const addOccurence = () => {
    const newOccurences = [...currentEvent.occurences, defaultOccurence()] as Occurence[];
    setCurrentEvent({ ...currentEvent, occurences: newOccurences });
  };

  const removeOccurence = () => {
    if (currentEvent.occurences.length <= 1) return;
    const newOccurences = currentEvent.occurences.slice(0, -1);
    setCurrentEvent({ ...currentEvent, occurences: newOccurences });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <datalist id="name-list">
        {suggestedNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
      <datalist id="teacher-list">
        {suggestedTeachers.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <h3>Create new event</h3>
      <label htmlFor="name">Name:</label>

      <input
        type="text"
        id="name"
        value={currentEvent.name}
        list="name-list"
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="teacher">Teacher:</label>
      <input
        type="text"
        id="teacher"
        value={currentEvent.teacher}
        list="teacher-list"
        onChange={(e) => setTeacher(e.target.value)}
      />

      <ul>
        {currentEvent.occurences.map((occurence, index) => (
          <li key={index}>
            <OccurenceEditor occurence={occurence} setOccurence={setOccurenceCurry(index)} />
          </li>
        ))}
        <button onClick={() => addOccurence()}>➕</button>
        <button onClick={() => removeOccurence()}>➖</button>
      </ul>

      <button onClick={createEvent}>Add Event</button>
    </div>
  );
}
