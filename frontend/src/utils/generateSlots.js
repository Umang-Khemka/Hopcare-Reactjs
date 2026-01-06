export const generateSlots = () => {
  const slots = [];
  let hour = 9;
  let minute = 0;

  while (hour < 17) {
    const h = hour.toString().padStart(2, "0");
    const m = minute.toString().padStart(2, "0");
    slots.push(`${h}:${m}`);

    minute += 30;
    if (minute === 60) {
      hour++;
      minute = 0;
    }
  }
  return slots;
};
