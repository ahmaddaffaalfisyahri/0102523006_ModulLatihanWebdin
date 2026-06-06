'use client';

import { useState, useRef } from 'react';
import { createEmployee } from './actions';

// Tipe data dari props (dikirim dari Server Component)
type Department = { id: number; name: string };
type Position   = { id: number; name: string; departmentId: number };
type Skill      = { id: number; name: string };

type Props = {
  departments: Department[];
  positions:   Position[];
  skills:      Skill[];
};

export default function EmployeeForm({ departments, positions, skills }: Props) {
  // State untuk cascading dropdown
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Filter position berdasarkan department yang dipilih
  const filteredPositions = positions.filter(
    (p) => p.departmentId === parseInt(selectedDeptId)
  );

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createEmployee(formData);
      setSuccess('Karyawan berhasil ditambahkan!');
      formRef.current?.reset();
      setSelectedDeptId('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat menyimpan data.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Tambah Karyawan</h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      {/* ── TEXT INPUT: Nama ── */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Nama Lengkap
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="Contoh: Budi Santoso"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all bg-gray-50/50 hover:bg-white"
        />
      </div>

      {/* ── EMAIL INPUT ── */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="budi@email.com"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all bg-gray-50/50 hover:bg-white"
        />
      </div>

      {/* ── RADIO BUTTON: Jenis Kelamin ── */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Jenis Kelamin
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input type="radio" name="gender" value="male" required className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Laki-laki</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input type="radio" name="gender" value="female" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Perempuan</span>
          </label>
        </div>
      </div>

      {/* ── DROPDOWN BIASA: Status ── */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Status Karyawan
        </label>
        <select
          name="status"
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all bg-gray-50/50 hover:bg-white"
        >
          <option value="">-- Pilih Status --</option>
          <option value="active">Aktif</option>
          <option value="probation">Masa Percobaan</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      {/* ── CASCADING DROPDOWN: Department → Position ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Dropdown 1: Department */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Departemen
          </label>
          <select
            name="departmentId"
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all bg-gray-50/50 hover:bg-white"
          >
            <option value="">-- Pilih Departemen --</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Dropdown 2: Position (isi berubah otomatis) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Jabatan
          </label>
          <select
            name="positionId"
            required
            disabled={!selectedDeptId}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all bg-gray-50/50 hover:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            <option value="">
              {selectedDeptId ? '-- Pilih Jabatan --' : '(Pilih departemen dulu)'}
            </option>
            {filteredPositions.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── CHECKBOX: Skill (Many-to-Many) ── */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Skill (boleh pilih lebih dari satu)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {skills.map((skill) => (
            <label key={skill.id} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-blue-50/50 transition-colors group">
              <input
                type="checkbox"
                name="skills"
                value={skill.id}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{skill.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── FILE INPUT: Upload Foto ── */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Foto Profil
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors file:cursor-pointer"
        />
        <p className="text-xs text-gray-400 mt-1.5">Format: JPG, PNG, WEBP. Maks 2MB.</p>
      </div>

      {/* ── TOMBOL SUBMIT ── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Menyimpan...
          </span>
        ) : (
          'Simpan Karyawan'
        )}
      </button>
    </form>
  );
}
