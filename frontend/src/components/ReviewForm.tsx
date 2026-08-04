"use client";

import { useState } from "react";

export function ReviewForm({ onSubmit }: { onSubmit: (diagnosis: string, notes: string) => void }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  return <form onSubmit={event => { event.preventDefault(); onSubmit(diagnosis, notes); }}>
    <label>Final diagnosis<input required value={diagnosis} onChange={event => setDiagnosis(event.target.value)}/></label>
    <label>Review notes<textarea required value={notes} onChange={event => setNotes(event.target.value)}/></label>
    <button type="submit">Submit review</button>
  </form>;
}
