import { createPoll } from "ags/time";
import Box from "../../components/Box";
import Text from "../../components/Text";
import Button from "../../components/Button";
function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const today = new Date();

  const weeks: Array<
    Array<{
      day: number;
      month: "prev" | "current" | "next";
      isToday: boolean;
    }>
  > = [];

  let currentWeek: Array<{
    day: number;
    month: "prev" | "current" | "next";
    isToday: boolean;
  }> = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    currentWeek.push({
      day: prevMonthDays - i,
      month: "prev",
      isToday: false,
    });
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push({
      day,
      month: "current",
      isToday:
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Next month days
  if (currentWeek.length > 0) {
    const remaining = 7 - currentWeek.length;
    for (let day = 1; day <= remaining; day++) {
      currentWeek.push({
        day,
        month: "next",
        isToday: false,
      });
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

const DAY_NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function Calendar() {
  const now = new Date();
  const time = createPoll(1, () => {
    const d = new Date();
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  });

  const dateStr = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const weeks = getMonthData(now.getFullYear(), now.getMonth());

  return (
    <Box class="calendar-box" vertical>
      <Text class="calendar-clock" children={time(() => time.get())} />
      <Text class="calendar-header" children={dateStr} />

      {/* Day labels */}
      <Box gap={0}>
        {DAY_NAMES.map((day) => (
          <Button hexpand>
            <Text class="calendar-day-label" children={day} />
          </Button>
        ))}
      </Box>

      {/* Calendar grid */}
      {weeks.map((week) => (
        <Box gap={0}>
          {week.map(({ day, month, isToday }) => {
            const classes = ["calendar-day"];
            if (isToday) classes.push("today");
            if (month !== "current") classes.push("other-month");
            return (
              <Button hexpand>
                <box cssClasses={classes}>
                  <label
                    label={`${day}`}
                    halign={3}
                    valign={3}
                    cssClasses={classes}
                  />
                </box>
              </Button>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
