export default function Home() {
  return (
    <main className="bg-background relative min-h-full flex-1">
      <h1 className="sr-only">ORBITAL-07, deep space research station</h1>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-8">
        <div>
          <p className="text-muted font-mono text-[10px] tracking-[0.34em]">
            ORBITAL-07
          </p>
          <p className="text-foreground/70 mt-2 font-mono text-[10px] tracking-[0.16em]">
            DEEP SPACE RESEARCH STATION
          </p>
        </div>
        <p className="text-accent font-mono text-[10px] tracking-[0.18em]">
          LINK STANDBY
        </p>
      </div>
    </main>
  );
}
