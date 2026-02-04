"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";

export default function JobsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["jobs"], queryFn: api.jobs.list });
  const [name, setName] = useState("");
  const [builder, setBuilder] = useState("");
  const [roofType, setRoofType] = useState("Asphalt");
  const [pitch, setPitch] = useState<number>(6);
  const [areaSqFt, setAreaSqFt] = useState<number>(2000);

  const create = useMutation({
    mutationFn: () => api.jobs.create({ name, builder, roof_type: roofType, pitch, area_sq_ft: areaSqFt, status: "Draft" }),
    onSuccess: async () => {
      setName(""); setBuilder("");
      await qc.invalidateQueries({ queryKey: ["jobs"] });
    }
  });

  const del = useMutation({
    mutationFn: (id: number) => api.jobs.remove(id),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Jobs</h1>

      <div className="rounded border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="font-medium">Create Job</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="w-full rounded bg-zinc-950 border border-zinc-800 p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full rounded bg-zinc-950 border border-zinc-800 p-2" placeholder="Builder" value={builder} onChange={e=>setBuilder(e.target.value)} />
          <input className="w-full rounded bg-zinc-950 border border-zinc-800 p-2" placeholder="Roof Type" value={roofType} onChange={e=>setRoofType(e.target.value)} />
          <input className="w-full rounded bg-zinc-950 border border-zinc-800 p-2" placeholder="Pitch" type="number" value={pitch} onChange={e=>setPitch(parseInt(e.target.value||"0"))} />
          <input className="w-full rounded bg-zinc-950 border border-zinc-800 p-2" placeholder="Area SqFt" type="number" value={areaSqFt} onChange={e=>setAreaSqFt(parseInt(e.target.value||"0"))} />
        </div>
        <button className="rounded bg-zinc-100 text-zinc-900 px-4 py-2 font-medium" onClick={()=>create.mutate()}>
          Create
        </button>
      </div>

      <div className="rounded border border-zinc-800 overflow-hidden">
        <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 font-medium">All Jobs</div>
        <div className="divide-y divide-zinc-800">
          {(q.data || []).map((j: any) => (
            <div key={j.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{j.name}</div>
                <div className="text-zinc-400 text-sm">{j.builder || "—"} • {j.roof_type || "—"} • pitch {j.pitch ?? "—"} • {j.area_sq_ft ?? "—"} sq ft</div>
              </div>
              <button className="text-red-300 hover:text-red-200" onClick={()=>del.mutate(j.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
