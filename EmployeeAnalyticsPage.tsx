import { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  DollarSign,
  Award,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { useBusiness } from '../context/BusinessContext';
import { MetricCard } from '../components/common/MetricCard';

export function EmployeeAnalyticsPage() {
  const { formatCurrency } = useBusiness();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.getEmployeeAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const { kpis, departmentBreakdown, employees } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workforce & Talent Productivity Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Headcount distribution, monthly payroll, revenue per employee, and team roster
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Headcount"
          value={kpis.totalHeadcount}
          subtext="Full-time staff"
          icon={<Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        />
        <MetricCard
          title="Monthly Payroll"
          value={formatCurrency(kpis.totalMonthlyPayroll)}
          subtext="Salaries & benefits"
          icon={<DollarSign className="w-4 h-4 text-rose-500 dark:text-rose-400" />}
        />
        <MetricCard
          title="Revenue Per Head"
          value={formatCurrency(kpis.revenuePerEmployee)}
          subtext="Monthly productivity"
          icon={<Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
        />
        <MetricCard
          title="Avg Performance"
          value={`${kpis.avgPerformanceScore} / 10`}
          subtext="Based on quarterly OKRs"
          icon={<Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
        />
      </div>

      {/* Department Breakdown */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Department Headcount & Cost Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentBreakdown.map((dept: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white mb-1">
                <span>{dept.department}</span>
                <span className="text-blue-600 dark:text-blue-400">{dept.count} Members</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Total Monthly Payroll: <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(dept.totalSalary)}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Avg Compensation: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(dept.avgSalary)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee List */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Personnel Roster & Scorecards</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Monthly Salary</th>
                <th className="py-2.5 px-3">Hire Date</th>
                <th className="py-2.5 px-3">Performance</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {employees.map((emp: any) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{emp.name}</td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{emp.role}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded">
                      {emp.department}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{formatCurrency(emp.salary)}</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{emp.hireDate}</td>
                  <td className="py-3 px-3">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      ★ {emp.performanceScore}/10
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{emp.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
