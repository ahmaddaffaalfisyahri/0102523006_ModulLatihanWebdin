import { prisma } from '@/lib/prisma';
import EditEmployeeForm from './EditEmployeeForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Params = Promise<{ id: string }>;

export default async function EditEmployeePage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const employeeId = parseInt(id);

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      skills: true,
      position: {
        include: { department: true },
      },
    },
  });

  if (!employee) {
    notFound();
  }

  const departments = await prisma.department.findMany();
  const positions   = await prisma.position.findMany();
  const skills      = await prisma.skill.findMany();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20">
      <div className="max-w-3xl mx-auto p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/employees"
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Edit Karyawan
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Mengubah data: <span className="font-medium text-gray-700">{employee.name}</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <EditEmployeeForm
          employee={{
            id: employee.id,
            name: employee.name,
            email: employee.email,
            gender: employee.gender,
            status: employee.status,
            photoPath: employee.photoPath,
            positionId: employee.positionId,
            position: { departmentId: employee.position.departmentId },
            skills: employee.skills.map((s) => ({ id: s.id })),
          }}
          departments={departments}
          positions={positions}
          skills={skills}
        />
      </div>
    </main>
  );
}
