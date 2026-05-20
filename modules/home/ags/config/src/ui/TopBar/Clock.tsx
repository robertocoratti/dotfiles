import { createPoll } from "ags/time";
import Box from "../../components/Box";
import Text from "../../components/Text";

export default function Clock() {
  const time = createPoll(1, () => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: now.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  });

  return (
    <Box class="bar-clock" gap={6}>
      <Text class="bar-clock-date" children={time(() => time.get().date)} />
      <Text children={time(() => time.get().time)} />
    </Box>
  );
}
