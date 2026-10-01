const FOCUS = [
  "Web applications",
  "Distributed systems",
  "Cloud infrastructure",
  "Interactive experiences",
];

export function Observatory() {
  return (
    <div className="space-y-5 font-mono text-[12px] leading-6 tracking-[0.08em]">
      <p className="text-muted text-[10px] tracking-[0.2em]">
        OBSERVATION DECK
      </p>
      <p>CREW MEMBER</p>
      <p className="text-muted">FULL STACK ENGINEER</p>
      <div>
        <p className="text-muted text-[10px] tracking-[0.18em]">FOCUS</p>
        <ul className="mt-2 space-y-1">
          {FOCUS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
