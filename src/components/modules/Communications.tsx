"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CONTACT } from "@/data/contact";
import { audio } from "@/lib/audio/audioManager";
import { useStationStore } from "@/store/stationStore";
import { Button } from "@/components/ui/Button";

export function Communications() {
  const [status, setStatus] = useState("");
  const [carrier, setCarrier] = useState(0);
  const [burst, setBurst] = useState(0);
  const pushLog = useStationStore((state) => state.pushLog);
  const reducedMotion = useStationStore((state) => state.reducedMotion);

  useEffect(() => {
    if (burst === 0 || carrier >= 4 || reducedMotion) return;
    const id = window.setTimeout(() => {
      setCarrier((value) => Math.min(4, value + 1));
    }, 160);
    return () => window.clearTimeout(id);
  }, [burst, carrier, reducedMotion]);

  useEffect(() => {
    if (burst === 0 || carrier < 4) return;
    pushLog("CARRIER LOCK — SIGNAL 4/4");
  }, [burst, carrier, pushLog]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = String(data.get("message") ?? "").trim();
    if (!message) return;
    audio.play("confirm");
    setStatus("MESSAGE QUEUED — LOCAL BUFFER");
    setBurst((value) => value + 1);
    setCarrier(reducedMotion ? 4 : 1);
    pushLog("OUTBOUND MESSAGE QUEUED");
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-4">
      <form className="space-y-3" onSubmit={onSubmit}>
        <label
          className="block font-mono text-[10px] tracking-[0.16em]"
          htmlFor="callsign"
        >
          CALLSIGN
          <input
            id="callsign"
            name="callsign"
            className="border-line mt-2 w-full border bg-transparent px-2 py-2 text-[12px] tracking-normal"
            autoComplete="name"
          />
        </label>
        <label
          className="block font-mono text-[10px] tracking-[0.16em]"
          htmlFor="message"
        >
          MESSAGE
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="border-line mt-2 w-full border bg-transparent px-2 py-2 text-[12px] tracking-normal"
          />
        </label>
        <Button type="submit">TRANSMIT MESSAGE</Button>
        {status ? (
          <p className="text-accent font-mono text-[10px] tracking-[0.14em]">
            {status}
          </p>
        ) : null}
        {carrier > 0 ? (
          <div
            className="flex items-end gap-1"
            aria-label={`Carrier strength ${Math.min(carrier, 4)} of 4`}
          >
            {[1, 2, 3, 4].map((level) => (
              <span
                key={level}
                className={`w-1 ${level <= carrier ? "bg-accent" : "bg-line"}`}
                style={{ height: `${4 + level * 3}px` }}
              />
            ))}
          </div>
        ) : null}
      </form>
      <div className="flex flex-col gap-2">
        <a
          className="border-line hover:border-accent border px-3 py-2 font-mono text-[10px] tracking-[0.16em]"
          href={CONTACT.github}
          target="_blank"
          rel="noreferrer"
        >
          GITHUB
        </a>
        {CONTACT.linkedin ? (
          <a
            className="border-line hover:border-accent border px-3 py-2 font-mono text-[10px] tracking-[0.16em]"
            href={CONTACT.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LINKEDIN
          </a>
        ) : (
          <button
            type="button"
            className="border-line text-muted border px-3 py-2 text-left font-mono text-[10px] tracking-[0.16em]"
            onClick={() => setStatus("LINKEDIN CHANNEL UNASSIGNED")}
          >
            LINKEDIN
          </button>
        )}
        <a
          className="border-line hover:border-accent border px-3 py-2 font-mono text-[10px] tracking-[0.16em]"
          href={`mailto:${CONTACT.email}`}
        >
          EMAIL
        </a>
      </div>
    </div>
  );
}
