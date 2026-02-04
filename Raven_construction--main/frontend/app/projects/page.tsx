"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";

export default function ProjectsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["projects"], queryFn: api.projects.list });
  const [name, setName] = useState("");

  const create = useMutation({
    mutationFn: () => api.projects.create({ name }),
    onSuccess: async () => {
      setName("");
      await qc.invalidateQueries({ queryKey: ["projects"] });
    }
  });

  const del = useMutation({
    mutationFn: (id: number) => api.projects.remove(id),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Projects</h1>

      <div className="rounded border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="font-medium">Create Project</div>
        <input className="w-full rounded bg-zinc-950 border border-zinc-800 p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <button className="rounded bg-zinc-100 text-zinc-900 px-4 py-2 font-medium" onClick={()=>create.mutate()}>
          Create
        </button>
      </div>

      <div className="rounded border border-zinc-800 overflow-hidden">
        <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 font-medium">All Projects</div>
        <div className="divide-y divide-zinc-800">
          {(q.data || []).map((p: any) => (
            <div key={p.id} className="px-4 py-3 flex items-center justify-between">
              <div className="font-medium">{p.name}</div>
              <button className="text-red-300 hover:text-red-200" onClick={()=>del.mutate(p.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
