'use client';

import { useQuery } from '@tanstack/react-query';
import AdminRoute from '@/app/components/admin/AdminRoute';
import{
  MdPeople, 
  MdLocalShipping, 
  MdPayment, 
  MdTrendingUp,
  MdPersonAdd,
  MdCheckCircle,
  MdHourglassEmpty
} from 'react-icons/md';
import Link from 'next/link';
import { getAdminStats } from '@/features/admin/api/adminApi';

export default function AdminDashboardPage() {

  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
  });

    // Main Overview Cards
  const mainStats = [
    { 
      title: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: MdPeople, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Total Parcels', 
      value: stats?.totalParcels || 0, icon: MdLocalShipping,
      color: 'text-purple-500', 
      bg: 'bg-purple-50' 
    },
    { 
      title: 'Total Revenue',
       value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`, 
       icon: MdPayment, 
       color: 'text-green-500',
        bg: 'bg-green-50' 
      },
  ];

  // Quick Action Cards
  const quickActions = [
    { 
      title: 'Pending Applications', 
      value: stats?.pendingRiders || 0, 
      icon: MdPersonAdd, 
      link: '/admin/pending-riders',
      color: 'text-amber-600', bg: 'bg-amber-50', iconBg: 'bg-amber-100' 
    },
    { 
      title: 'Active Riders', 
      value: stats?.activeRiders || 0, 
      icon: MdCheckCircle, 
      link: '/admin/active-riders',
      color: 'text-[#4d8d41]', bg: 'bg-[#edf7ea]', iconBg: 'bg-[#dce8d8]' 
    },
    { 
      title: 'Pending Parcels', 
      value: stats?.pendingParcels || 0, 
      icon: MdHourglassEmpty, 
      link: '/admin/parcels', 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      iconBg: 'bg-blue-100' 
    },
  ];
  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-[#f7fbf5]">
      
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            
              <div className='flex flex-col gap-2'>
                <div className=' flex justify-center items-center bg-[#d9efbd] mx-auto px-6 py-0.5 rounded-full'>
                <p className="text-sm tracking-[0.2em]  font-bold text-[#1f2a1d] mb-2">Admin Dashboard</p>
              </div>
              <p className=" text-xl text-center tracking-wider font- text-[#596257] mb-8">Overview of your SwiftShip delivery system</p>
              </div>
            
            

            {/* Main Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {mainStats.map((stat) => (
                <div key={stat.title} className="bg-white rounded-xl p-6 border border-[#dce8d8] shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#596257] mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-[#1f2a1d]">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                      <stat.icon className={`size-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Access Cards */}
            <h2 className="text-xl font-bold text-[#1f2a1d] mb-4">Quick Access</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {quickActions.map((item) => (
                <Link
                  key={item.title} 
                  href={item.link}
                  className={`${item.bgColor} rounded-xl p-6 border border-[#dce8d8] hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`${item.iconBg} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <item.icon className={`size-6 ${item.textColor}`} />
                    </div>
                    <div>
                      <p className="text-sm text-[#596257]">{item.title}</p>
                      <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}