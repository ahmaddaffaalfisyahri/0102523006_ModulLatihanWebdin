import { prisma } from '@/lib/prisma';
import EmployeeForm from './EmployeeForm';
import SearchFilter from './SearchFilter';
import Pagination from './Pagination';
import DeleteButton from './DeleteButton';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

const PER_PAGE = 5;

type SearchParams = Promise<{
  search?: string;
  status?: string;
  page?: string;
}>;

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || '';
  const page = parseInt(params.page || '1');

  // Ambil semua data master untuk form
  const departments = await prisma.department.findMany();
  const positions   = await prisma.position.findMany();
  const skills      = await prisma.skill.findMany();

  // Build where clause untuk search & filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (search) {
    where.name = { contains: search };
  }
  if (status) {
    where.status = status;
  }

  // Hitung total untuk pagination
  const totalCount = await prisma.employee.count({ where });
  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const currentPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));

  // Ambil data karyawan dengan relasi + pagination
  const employees = await prisma.employee.findMany({
    where,
    include: {
      skills: true,
      position: {
        include: {
          department: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: (currentPage - 1) * PER_PAGE,
    take: PER_PAGE,
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Manajemen Karyawan
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Kelola data karyawan perusahaan Anda</p>
          </div>
        </div>

        {/* FORM */}
        <EmployeeForm
          departments={departments}
          positions={positions}
          skills={skills}
        />

        {/* SEARCH & FILTER */}
        <Suspense fallback={null}>
          <SearchFilter />
        </Suspense>

        {/* TABEL DATA */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-800">
                Data Karyawan
              </h2>
              <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                {totalCount} total
              </span>
            </div>
            {(search || status) && (
              <span className="text-xs text-gray-500">
                Menampilkan hasil filter
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-50/50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-3.5 text-left font-semibold">Foto</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Nama &amp; Email</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Gender</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Jabatan &amp; Dept.</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Skill</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <p className="text-gray-400 font-medium">Belum ada data karyawan</p>
                        <p className="text-gray-300 text-xs">Tambahkan karyawan pertama menggunakan form di atas</p>
                      </div>
                    </td>
                  </tr>
                )}
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors">
                    {/* Foto */}
                    <td className="px-5 py-4">
                      {emp.photoPath ? (
                        <Image
                          src={emp.photoPath}
                          alt={emp.name}
                          width={44}
                          height={44}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-500 text-sm font-bold ring-2 ring-white shadow-sm">
                          {emp.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    {/* Nama & Email */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{emp.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{emp.email}</p>
                    </td>

                    {/* Gender */}
                    <td className="px-5 py-4 text-gray-600 text-xs">
                      {emp.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                    </td>

                    {/* Jabatan & Departemen */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-700">{emp.position.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{emp.position.department.name}</p>
                    </td>

                    {/* Skill */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {emp.skills.length === 0 && (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                        {emp.skills.map((s) => (
                          <span
                            key={s.id}
                            className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium border border-blue-100"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        emp.status === 'active'    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'  :
                        emp.status === 'probation' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                     'bg-gray-50 text-gray-500 border border-gray-200'
                      }`}>
                        {emp.status === 'active'    ? '● Aktif'            :
                         emp.status === 'probation' ? '◐ Percobaan'   : '○ Tidak Aktif'}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/employees/${emp.id}/edit`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-semibold transition-colors flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <DeleteButton id={emp.id} name={emp.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Halaman {currentPage} dari {totalPages} ({totalCount} data)
                </span>
              </div>
              <Suspense fallback={null}>
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
