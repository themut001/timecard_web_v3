import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/hashPassword';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // 既存データをクリア（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      await prisma.tagEffort.deleteMany();
      await prisma.dailyReport.deleteMany();
      await prisma.tag.deleteMany();
      await prisma.attendanceRecord.deleteMany();
      await prisma.request.deleteMany();
      await prisma.user.deleteMany();
      await prisma.department.deleteMany();
      await prisma.setting.deleteMany();
      console.log('✅ Cleared existing data');
    }

    // 部署を作成
    const itDepartment = await prisma.department.create({
      data: {
        id: 'dept_it_001',
        name: 'IT部',
        managerId: 'admin_001', // 管理者を先に作成する必要があるため、後で更新
      },
    });

    const salesDepartment = await prisma.department.create({
      data: {
        id: 'dept_sales_001',
        name: '営業部',
        managerId: 'admin_001', // 管理者を先に作成する必要があるため、後で更新
      },
    });

    console.log('✅ Created departments');

    // 管理者ユーザーを作成
    const adminUser = await prisma.user.create({
      data: {
        id: 'admin_001',
        employeeId: 'A001',
        name: '管理者',
        email: 'admin@company.com',
        passwordHash: await hashPassword('password123'),
        role: 'ADMIN',
        departmentId: itDepartment.id,
      },
    });

    // 一般ユーザーを作成
    const users = [
      {
        id: 'user_001',
        employeeId: 'E001',
        name: '田中太郎',
        email: 'user@company.com',
        password: 'password123',
        role: 'EMPLOYEE' as const,
        departmentId: itDepartment.id,
      },
      {
        id: 'user_002',
        employeeId: 'E002',
        name: '佐藤花子',
        email: 'sato@company.com',
        password: 'password123',
        role: 'EMPLOYEE' as const,
        departmentId: itDepartment.id,
      },
      {
        id: 'user_003',
        employeeId: 'S001',
        name: '鈴木一郎',
        email: 'suzuki@company.com',
        password: 'password123',
        role: 'EMPLOYEE' as const,
        departmentId: salesDepartment.id,
      },
    ];

    for (const userData of users) {
      await prisma.user.create({
        data: {
          id: userData.id,
          employeeId: userData.employeeId,
          name: userData.name,
          email: userData.email,
          passwordHash: await hashPassword(userData.password),
          role: userData.role,
          departmentId: userData.departmentId,
        },
      });
    }

    console.log('✅ Created users');

    // サンプルタグを作成（Notion連携前のデモ用）
    const sampleTags = [
      { name: 'プロジェクトA', notionId: 'notion_a_001' },
      { name: 'プロジェクトB', notionId: 'notion_b_001' },
      { name: 'プロジェクトC', notionId: 'notion_c_001' },
      { name: '内部業務', notionId: 'notion_internal_001' },
      { name: '研修・学習', notionId: 'notion_training_001' },
    ];

    for (const tagData of sampleTags) {
      await prisma.tag.create({
        data: {
          name: tagData.name,
          notionId: tagData.notionId,
          isActive: true,
        },
      });
    }

    console.log('✅ Created sample tags');

    // サンプル勤怠データを作成（過去7日分）
    const today = new Date();
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }

    for (const user of users) {
      for (const date of dates) {
        // 土日は出勤しない
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        const clockInTime = new Date(date);
        clockInTime.setHours(9, Math.floor(Math.random() * 30), 0, 0); // 9:00-9:30の間でランダム

        const clockOutTime = new Date(date);
        clockOutTime.setHours(18, Math.floor(Math.random() * 60), 0, 0); // 18:00-18:59の間でランダム

        const workMinutes = Math.floor((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60));
        const breakTime = 60; // 1時間休憩
        const totalMinutes = Math.max(0, workMinutes - breakTime);
        const totalHours = totalMinutes / 60;

        await prisma.attendanceRecord.create({
          data: {
            userId: user.id,
            date: date,
            clockIn: clockInTime,
            clockOut: clockOutTime,
            breakTime: breakTime,
            totalHours: totalHours,
            status: 'PRESENT',
          },
        });
      }
    }

    console.log('✅ Created sample attendance records');

    // サンプル日報データを作成
    const tags = await prisma.tag.findMany();
    for (const user of users) {
      for (let i = 2; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);

        // 土日は日報なし
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        const dailyReport = await prisma.dailyReport.create({
          data: {
            userId: user.id,
            date: date,
            workContent: `${date.toLocaleDateString('ja-JP')}の作業内容です。プロジェクトの進捗確認と開発作業を行いました。`,
            notes: '特に問題はありませんでした。',
            totalHours: 8,
          },
        });

        // ランダムなタグに工数を割り当て
        const selectedTags = tags.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4個のタグ
        let remainingHours = 8;
        
        for (let j = 0; j < selectedTags.length; j++) {
          const isLast = j === selectedTags.length - 1;
          const hours = isLast ? remainingHours : Math.floor(Math.random() * (remainingHours - 1)) + 1;
          
          await prisma.tagEffort.create({
            data: {
              dailyReportId: dailyReport.id,
              tagId: selectedTags[j].id,
              hours: hours,
            },
          });
          
          remainingHours -= hours;
          if (remainingHours <= 0) break;
        }
      }
    }

    console.log('✅ Created sample daily reports and tag efforts');

    // システム設定を作成
    await prisma.setting.create({
      data: {
        key: 'app_version',
        value: '1.0.0',
      },
    });

    await prisma.setting.create({
      data: {
        key: 'last_notion_sync',
        value: JSON.stringify({
          newTags: 0,
          updatedTags: 0,
          totalSynced: 0,
          lastSyncAt: new Date().toISOString(),
        }),
      },
    });

    console.log('✅ Created system settings');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo accounts:');
    console.log('👤 Admin: admin@company.com / password123');
    console.log('👤 User: user@company.com / password123');
    console.log('👤 User: sato@company.com / password123');
    console.log('👤 User: suzuki@company.com / password123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });