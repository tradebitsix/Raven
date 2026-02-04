"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";

export default function UsersPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["users"], queryFn: api.users.list });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [password, setPassword] = useState("");

  const create = useMutation({
    mutationFn: () => api.users.create({ name, email: email || null, role, password: password || null }),
    onSuccess: async () => {
      setName(""); setEmail(""); setPassword("");
      await qc.invalidateQueries({ queryKey: ["users"] });
    }
  });

  const del = useMutation({
    mutationFn: (id: number) => api.users.remove(id),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Users</h1>

      <div className="rounded border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="font-medium">Create User</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="w-full rounded bg-zinc-950 border border-zinc-800 p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full rounded bg-zinc-950 border border-zinc-800 p-2" placeholder="Email (optional)" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full rounded bg-zinc-950 border border-zinc-800 p-2" placeholder="Role" value={role} onChange={e=>setRole(e.target.value)} />
          <input className="w-full rounded bg-zinc-950 border border-zinc-800 p-2" placeholder="Password (optional)" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="rounded bg-zinc-100 text-zinc-900 px-4 py-2 font-medium" onClick={()=>create.mutate()}>
          Create
        </button>
      </div>

      <div className="rounded border border-zinc-800 overflow-hidden">
        <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 font-medium">All Users</div>
        <div className="divide-y divide-zinc-800">
          {(q.data || []).map((u: any) => (
            <div key={u.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-zinc-400 text-sm">{u.email || "—"} • {u.role}</div>
              </div>
              <button className="text-red-300 hover:text-red-200" onClick={()=>del.mutate(u.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
