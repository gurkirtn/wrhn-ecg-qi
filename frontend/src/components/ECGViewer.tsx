export function ECGViewer({ label = "Synthetic ECG placeholder" }: { label?: string }) {
  return <figure aria-label={label}>
    <img src="/ecg-placeholder.png" alt={label}/>
    <figcaption>Mock waveform for interface development only.</figcaption>
  </figure>;
}
