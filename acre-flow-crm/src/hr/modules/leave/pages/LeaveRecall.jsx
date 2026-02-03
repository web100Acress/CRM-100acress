import React from 'react';
import { HiOutlineBookOpen } from 'react-icons/hi';

const LeaveRecall = () => {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-800">Dashboard / Leave Recall</div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="text-center">
              <HiOutlineBookOpen className="w-10 h-10 mx-auto text-slate-900" />
              <h1 className="text-2xl font-bold text-slate-900 mt-3">Leave Recall</h1>
            </div>

            <div className="mt-8 rounded-xl bg-[#e9f2ff] p-8">
              <p className="text-sm text-slate-700">Dear User,</p>
              <p className="mt-4 text-xl sm:text-2xl font-semibold text-slate-800 leading-snug">
                This is to inform you that you have been RECALLED from your CASUAL Leave by your line manager
                named Biruktawit mesfin for an urgent meeting and task to be completed in the office before
                2nd June, 2022.
              </p>
            </div>

            <div className="mt-8">
              <label className="block text-sm font-semibold text-slate-700 mb-2">If No, state reason why ?</label>
              <input
                placeholder="State your reason..."
                className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm"
              />
            </div>

            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <button type="button" className="w-full rounded-lg bg-green-700 text-white py-3 font-semibold">
                Approve
              </button>
              <button type="button" className="w-full rounded-lg border-2 border-red-600 text-red-600 py-3 font-semibold">
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRecall;
