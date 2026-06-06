import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
  // 1. Buat Department jika belum ada
  let deptTech = await prisma.department.findFirst({ where: { name: 'Technology' } });
  if (!deptTech) {
    deptTech = await prisma.department.create({ data: { name: 'Technology' } });
  }

  let deptHR = await prisma.department.findFirst({ where: { name: 'Human Resource' } });
  if (!deptHR) {
    deptHR = await prisma.department.create({ data: { name: 'Human Resource' } });
  }

  // 2. Buat Position jika belum ada
  const positions = [
    { name: 'Frontend Developer', departmentId: deptTech.id },
    { name: 'Backend Developer',  departmentId: deptTech.id },
    { name: 'HR Generalist',      departmentId: deptHR.id  },
    { name: 'Recruitment Staff',  departmentId: deptHR.id  },
  ];

  for (const pos of positions) {
    const existing = await prisma.position.findFirst({
      where: { name: pos.name, departmentId: pos.departmentId }
    });
    if (!existing) {
      await prisma.position.create({ data: pos });
    }
  }

  // 3. Buat Skill jika belum ada
  const skills = ['React.js', 'Node.js', 'MySQL', 'UI/UX Design'];
  for (const s of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: s } });
    if (!existing) {
      await prisma.skill.create({ data: { name: s } });
    }
  }

  console.log('✅ Seed berhasil!');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); });
