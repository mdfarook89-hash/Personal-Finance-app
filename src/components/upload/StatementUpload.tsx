'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function StatementUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: form,
    });
    const json = await res.json();
    if (res.ok) {
      alert(`Imported ${json.imported} expenses. Redirecting to expenses list...`);
      router.push('/expenses');
    } else {
      alert('Upload failed: ' + (json.error || 'unknown error'));
    }
    setUploading(false);
  };

  return (
    <div className="space-y-4 p-4 border rounded bg-white shadow-sm max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Upload Credit‑Card Statement</h2>
      <p className="text-sm text-gray-600">
        Accepts CSV (with columns: date, amount, description, category, paymentMethod) or PDF (OCR will extract transactions).
      </p>
      <Input type="file" accept=".csv,.pdf" onChange={handleFileChange} />
      <Button onClick={upload} disabled={!file || uploading}>
        {uploading ? 'Uploading…' : 'Upload & Import'}
      </Button>
    </div>
  );
}
