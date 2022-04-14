import { asyncReduce } from "../lib";

export const makeEventsPoint = () => {
  let events;

  beforeEach(() => {
    events = [];
  });

  const addEvent = (event) => {
    beforeEach(() => {
      events.push(event);
    });
  };

  const runEvents = () => asyncReduce(events);

  return [addEvent, runEvents];
};
