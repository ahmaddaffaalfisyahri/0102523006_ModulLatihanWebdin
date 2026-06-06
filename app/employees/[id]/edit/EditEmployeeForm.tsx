'use client';

import { useState, useRef } from 'react';
import { updateEmployee } from '../../actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Department = { id: number; name: string };
type Position   = { id: number; name: string; departmentId: number };
type Skill      = { id: number; name: string };
type Employee   = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
  photoPath: string | null;
  positionId: number;
  position: { departmentId: number };
  skills: { id: number }[];
};

type Props = {
  employee: Employee;
  departments: Department[];
  positions:   Position[];
  skills:      Skill[];
};

export default function EditEmployeeForm({ employee, departments, positions, skills }: Props) {
  const router = useRouter();
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    employee.position.departmentId.toString()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const filteredPositions = positions.filter(
    (p) => p.departmentId === parseInt(selectedDeptId)
  );

  const employeeSkillIds = employee.skills.map((s) => s.id);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      await updateEmployee(employee.id, formData);
      router.push('/employees');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat mengupdate data.');
      }
      setIsSubmitting(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Edit Karyawan</h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Current Photo */}
      {employee.photoPath && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <Image
            src={employee.photoPath}
            alt={employee.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Foto saat ini</p>
            <p className="text-xs text-gray-400">Upload foto baru untuk mengganti</p>
          </div>
        </div>
      )}

      {/* Nama */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={employee.name}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all bg-gray-50/50 hover:bg-white"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
        <input
          type="email"
          name="email"
          required
          defaultValue={employee.email}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all bg-gray-50/50 hover:bg-white"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="gender"
              value="male"
              required
              defaultChecked={employee.gender === 'male'}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Laki-laki</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="radio"
              name="gender"
              value="female"
              defaultChecked={employee.gender === 'female'}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Perempuan</span>
          </label>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status Karyawan</label>
        <select
          name="status"
          required
          defaultValue={employee.status}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all bg-gray-50/50 hover:bg-white"
        >
          <option value="">-- Pilih Status --</option>
          <option value="active">Aktif</option>
          <option value="probation">Masa Percobaan</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      {/* Cascading Dropdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Departemen</label>
          <select
            name="departmentId"
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all bg-gray-50/50 hover:bg-white"
          >
            <option value="">-- Pilih Departemen --</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jabatan</label>
          <select
            name="positionId"
            required
            defaultValue={employee.positionId}
            disabled={!selectedDeptId}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all bg-gray-50/50 hover:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
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

      {/* Skills */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Skill (boleh pilih lebih dari satu)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {skills.map((skill) => (
            <label key={skill.id} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-amber-50/50 transition-colors group">
              <input
                type="checkbox"
                name="skills"
                value={skill.id}
                defaultChecked={employeeSkillIds.includes(skill.id)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{skill.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Foto */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Foto Profil {employee.photoPath && '(kosongkan jika tidak ingin mengganti)'}
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 file:transition-colors file:cursor-pointer"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
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
            'Update Karyawan'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push('/employees')}
          className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all active:scale-[0.98]"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
