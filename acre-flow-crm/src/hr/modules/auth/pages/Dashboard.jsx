import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../../../components/common/Loader';

const Dashboard = () => {
  const userName = localStorage.getItem('hrName') || localStorage.getItem('userName') || 'HR User';
  const [loading, setLoading] = useState(true);
  const tiles = useMemo(
    () => [
      { label: 'Messages', value: 4, color: 'bg-yellow-400', text: 'text-slate-900', link: '/hr/messages' },
      { label: 'Jobs', value: 1, color: 'bg-indigo-700', text: 'text-white', link: '/hr/recruitment/jobs' },
      { label: 'Candidates', value: 30, color: 'bg-green-600', text: 'text-white', link: '/hr/recruitment/candidates' },
      { label: 'Resumes', value: 2, color: 'bg-slate-100', text: 'text-slate-900', link: '/hr/recruitment/resumes' },
      { label: 'Employees', value: 20, color: 'bg-yellow-400', text: 'text-slate-900', link: '/hr/employees' },
      { label: 'Leaves', value: 8, color: 'bg-indigo-700', text: 'text-white', link: '/hr/leave' },
      { label: 'Payrolls', value: 7, color: 'bg-green-600', text: 'text-white', link: '/hr/payroll' },
    ],
    []
  );

  const appliedJobs = useMemo(
    () => [
      { id: '1', title: 'Sales Executive', time: '2min ago' },
      { id: '2', title: 'User Experience Designer', time: '10min ago' },
      { id: '3', title: 'Product Manager', time: '5min ago' },
    ],
    []
  );

  const employees = useMemo(
    () => [
      { id: '1', name: 'Aman', role: 'Product Manager' },
      { id: '2', name: 'Gella', role: 'Sales Executive' },
      { id: '3', name: 'Biruk', role: 'UI/UX Designer' },
    ],
    []
  );

  const candidates = useMemo(
    () => [
      { id: '1', name: 'Feven Tesfaye', appliedFor: 'UI/UX Designer' },
      { id: '2', name: 'Yanet Mekuriya', appliedFor: 'Backend Engineer' },
      { id: '3', name: 'Aman Beyene', appliedFor: 'Product Manager' },
    ],
    []
  );

  const payrolls = useMemo(
    () => [
      { id: '1', name: 'Aman', amount: '30,000 Birr', status: 'Paid' },
      { id: '2', name: 'Gella', amount: '50,000 Birr', status: 'Processing' },
      { id: '3', name: 'Biruk', amount: '40,000 Birr', status: 'Processing' },
    ],
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loader size="lg" text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-5">
      <div className="text-sm font-semibold text-slate-800">Dashboard</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {tiles.map((t) => (
          <Link
            key={t.label}
            to={t.link}
            className={`${t.color} ${t.text} rounded-xl px-4 py-4 flex items-center justify-between border border-white/30`}
          >
            <div>
              <p className="text-2xl font-bold">{t.value}</p>
              <p className="text-xs font-semibold mt-1">{t.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Applied Jobs</h2>
            <span className="text-xs text-slate-500">...</span>
          </div>
          <div className="mt-4 space-y-3">
            {appliedJobs.map((j) => (
              <div key={j.id} className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{j.title}</p>
                <p className="text-xs text-slate-500">{j.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Employees</h2>
            <span className="text-xs text-slate-500">...</span>
          </div>
          <div className="mt-4 space-y-3">
            {employees.map((e) => (
              <div key={e.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{e.name}</p>
                  <p className="text-xs text-slate-500">{e.role}</p>
                </div>
                <Link to={`/hr/employees/${e.id}`} className="text-xs font-semibold text-indigo-900">
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">April Payrolls</h2>
            <span className="text-xs text-slate-500">...</span>
          </div>
          <div className="mt-4 space-y-3">
            {payrolls.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.amount}</p>
                </div>
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${p.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Candidates</h2>
            <span className="text-xs text-slate-500">...</span>
          </div>
          <div className="mt-4 space-y-3">
            {candidates.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-500">Applied for: {c.appliedFor}</p>
                </div>
                <span className="text-xs font-semibold text-indigo-900">View</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Notes</h2>
            <span className="text-xs text-slate-500">...</span>
          </div>
          <div className="mt-4">
            <textarea className="w-full min-h-40 rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" placeholder="Write something..." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
