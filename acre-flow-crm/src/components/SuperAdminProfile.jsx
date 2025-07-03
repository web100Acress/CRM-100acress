import React from 'react';
import OverviewChart from './OverviewChart';
import CustomerPieChart from './CustomerPieChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User, Mail, Phone, Shield, UserPlus, Building2, Users, Ticket, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminProfile = () => {
  const navigate = useNavigate();

  const superAdminData = {
    name: localStorage.getItem('userName') || 'Super Administrator',
    email: localStorage.getItem('userEmail') || 'superadmin@100acres.com',
    phone: '+91 9876543210',
    role: 'Super Admin',
    company: '100acres.com',
    joinDate: '2024-01-01',
    permissions: [
      'Full System Access',
      'Create Head Admins',
      'Manage All Users',
      'View All Reports',
      'System Configuration',
      'Access All Data'
    ]
  };

  const statsData = [
    { title: 'Total Users', value: '0', icon: Users, color: 'text-blue-600', cardBg: 'bg-gradient-to-r from-green-400 to-emerald-500' },
    { title: 'Active Leads', value: '0', icon: Building2, color: 'text-green-600', cardBg: 'bg-green-50' },
    { title: 'Open Tickets', value: '0', icon: Ticket, color: 'text-orange-600', cardBg: 'bg-orange-50' },
    { title: 'System Health', value: '0.0%', icon: Shield, color: 'text-emerald-600', cardBg: 'bg-emerald-50' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900">100acres.com</h1> */}
              <p className="text-lg text-gray-600 font-medium">Super Admin Control Panel</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700">
                  <User className="h-5 w-5 text-white" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{superAdminData.name}</h3>
                      <Badge className="bg-green-100 text-green-800 text-xs">{superAdminData.role}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><Building2 className="h-3 w-3" />{superAdminData.company}</div>
                    <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{superAdminData.email}</div>
                    <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{superAdminData.phone}</div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700">
                  <Shield className="h-5 w-5 text-white" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <h4 className="font-semibold text-sm mb-2">System Permissions</h4>
                <div className="space-y-1">
                  {superAdminData.permissions.map((permission, i) => (
                    <div key={i} className="flex items-center gap-2     text-xs p-2 bg-green-50 rounded">
                      <Shield className="h-3 w-3 text-green-600" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="flex flex-wrap gap-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="flex-1 min-w-[200px] max-w-[300px] border shadow-md rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-3 ${stat.cardBg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      {/* <div className="flex gap-4 mt-6 w-full">
        <div className="flex-[2] bg-white rounded-xl shadow-md p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">Overview</h3>
              <p className="text-sm text-gray-400">Monthly Earning</p>
            </div>
            <select className="bg-gray-100 px-3 py-1 rounded text-sm">
              <option>Quarterly</option>
              <option>Monthly</option>
            </select>
          </div>
          <OverviewChart />
        </div> */}

        {/* <div className="flex-[1] bg-white rounded-xl shadow-md p-5 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold">Customers</h3>
          <p className="text-sm text-gray-400 mb-4">Customers that buy products</p>
          <CustomerPieChart />
          <p className="text-center mt-2 text-sm text-gray-600">
            <span className="font-bold text-lg text-black">65%</span> Total New Customers
          </p>
        </div>
      </div> */}

      {/* Product Table */}
      {/* <div className="bg-white rounded-xl shadow-md p-6 mt-6 w-full">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">Product Sell</h2>
          <div className="flex gap-4">
            <input type="text" placeholder="Search" className="px-3 py-2 bg-gray-100 border rounded-md text-sm" />
            <button className="px-4 py-2 bg-gray-100 border rounded-md text-sm">Last 30 Days</button>
          </div>
        </div>
        <div className="grid grid-cols-4 text-sm text-gray-400 border-b pb-2 mb-2">
          <div className="col-span-2">Product Name</div>
          <div>Stock</div>
          <div className="flex justify-between"><span>Price</span><span>Total Sales</span></div>
        </div>
        {[
          {
            name: "Abstract 3D",
            desc: "Lorem ipsum dolor sit amet.",
            image: "/images/product1.png",
            stock: "32 in stock",
            price: "$45.99",
            sales: 20
          },
          {
            name: "Sarphens Illustration",
            desc: "Lorem ipsum dolor sit amet.",
            image: "/images/product2.png",
            stock: "32 in stock",
            price: "$45.99",
            sales: 20
          }
        ].map((item, i) => (
          <div key={i} className="grid grid-cols-4 items-center py-3 border-b">
            <div className="col-span-2 flex items-center gap-4">
              <img src={item.image} alt="" className="w-12 h-12 rounded-md object-cover" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
            <div className="text-sm">{item.stock}</div>
            <div className="flex justify-between text-sm">
              <span>{item.price}</span>
              <span className="text-gray-400">{item.sales}</span>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default SuperAdminProfile;
