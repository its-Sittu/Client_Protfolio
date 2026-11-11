"use client";

import * as React from "react";
import { CountingNumber } from "@/components/ui/counting-number";

export function CountingNumberDemo() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-8">
      <div>
        <span className="text-xs uppercase text-slate-400 block mb-2">Established in</span>
        <CountingNumber
          className="font-semibold text-5xl tracking-tight text-white"
          value={1975}
          trigger="view"
        />
      </div>
      <div>
        <span className="text-xs uppercase text-slate-400 block mb-2">Projects Completed</span>
        <CountingNumber
          className="font-semibold text-5xl tracking-tight text-white"
          value={100}
          suffix="+"
          trigger="view"
        />
      </div>
      <div>
        <span className="text-xs uppercase text-slate-400 block mb-2">Work Employed</span>
        <CountingNumber
          className="font-semibold text-5xl tracking-tight text-white"
          value={1000}
          suffix="+"
          grouping
          trigger="view"
        />
      </div>
      <div>
        <span className="text-xs uppercase text-slate-400 block mb-2">Active Projects</span>
        <CountingNumber
          className="font-semibold text-5xl tracking-tight text-white"
          value={50}
          trigger="view"
        />
      </div>
      <div>
        <span className="text-xs uppercase text-slate-400 block mb-2">Clients & Partners</span>
        <CountingNumber
          className="font-semibold text-5xl tracking-tight text-white"
          value={40}
          suffix="+"
          trigger="view"
        />
      </div>
      <div>
        <span className="text-xs uppercase text-slate-400 block mb-2">Years Experience</span>
        <CountingNumber
          className="font-semibold text-5xl tracking-tight text-white"
          value={10}
          suffix="+"
          trigger="view"
        />
      </div>
    </div>
  );
}

