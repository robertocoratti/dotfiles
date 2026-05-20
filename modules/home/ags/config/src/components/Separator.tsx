interface SeparatorProps {
  vertical?: boolean;
}

export default function Separator({ vertical }: SeparatorProps) {
  return <separator orientation={vertical ? 1 : 0} />;
}
