import type { ReactNode } from "react";
import { Button } from "./Button";

type PanelProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Panel({ title, onClose, children }: PanelProps) {
  return (
    <section
      role="dialog"
      aria-label={title}
      className="border-line pointer-events-auto absolute inset-x-3 top-20 bottom-16 flex flex-col border bg-[#080a0d]/95 sm:inset-x-auto sm:right-5 sm:w-[25rem]"
    >
      <header className="border-line flex items-center justify-between gap-4 border-b px-4 py-3">
        <h2 className="font-mono text-[11px] tracking-[0.22em]">{title}</h2>
        <Button onClick={onClose}>RETURN</Button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
    </section>
  );
}
