import React, { useMemo, useState } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';

const EmployeeProfile = () => {
  const tabs = useMemo(
    () => [
      'Personal Details',
      'Contact Details',
      'Next of kin Details',
      'Education Qualifications',
      'Guarantor Details',
      'Family Details',
      'Job Details',
      'Financial Details',
    ],
    []
  );

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [jobDocMode, setJobDocMode] = useState('upload');

  const Field = ({ label, value, placeholder, right }) => (
    <div className={right ? 'sm:col-span-1' : ''}>
      <label className="block text-xs font-semibold text-slate-700 mb-2">{label}</label>
      <input
        defaultValue={value}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm"
      />
    </div>
  );

  const SectionCard = ({ title, children, actionLabel }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <div className="mt-5">{children}</div>
      {actionLabel && (
        <div className="mt-6">
          <button type="button" className="px-10 py-3 rounded-lg bg-green-700 text-white font-semibold">
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );

  const renderRightPane = () => {
    if (activeTab === 'Personal Details') {
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1" />
            <button type="button" className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900">
              <HiOutlinePencil className="w-7 h-7" />
              <span className="text-xs font-semibold">Edit</span>
            </button>
          </div>

          <div className="mt-3 flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-yellow-400 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/70 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
                  B
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">Employee Name</p>
            <h2 className="text-2xl font-bold text-slate-900">Biruk Dawit</h2>

            <p className="mt-4 text-xs text-slate-500">Department</p>
            <h3 className="text-xl font-bold text-slate-900">Design &amp; Marketing</h3>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <p className="text-xs text-slate-500">Job Title</p>
                <p className="text-lg font-bold text-slate-900">UI / UX Designer</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Job Category</p>
                <p className="text-lg font-bold text-slate-900">Full time</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Contact Details') {
      return (
        <SectionCard title="Contact Details" actionLabel="Update">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Email" value="aman@xceltech.com" />
            <Field label="Phone No" value="0912344456" />
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Address</label>
              <textarea className="w-full min-h-28 rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" defaultValue="djibouti Street, Addis ababa" />
            </div>
          </div>
        </SectionCard>
      );
    }

    if (activeTab === 'Next of kin Details') {
      return (
        <SectionCard title="Next of kin Details" actionLabel="Update">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Full Name" value="Abel Doe" />
            <Field label="Relationship" value="Brother" />
            <Field label="Phone No" value="090 300 540 9" />
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Address</label>
              <textarea className="w-full min-h-28 rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" defaultValue="djibouti Street, Addis ababa" />
            </div>
          </div>
        </SectionCard>
      );
    }

    if (activeTab === 'Education Qualifications') {
      return (
        <SectionCard title="Academic Records / Academic Details" actionLabel="Update">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Name of Institution" value="Jimma university" />
            <Field label="Department" value="Computer Dept" />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Course</label>
              <select className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm">
                <option>Computer Science</option>
                <option>Information Systems</option>
              </select>
            </div>
            <Field label="Location" value="Jimma, Ethiopia" />
            <Field label="Start Date" value="01/01/1998" />
            <Field label="End Date" value="01/01/2019" />
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                className="w-full min-h-28 rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm"
                defaultValue={'• Gathering and evaluating product requirements, in collaboration with product managers and the developers\n• Illustrating design ideas using storyboards, process flows, and sitemaps\n• Designing graphic user interface pages and elements, like menus, tabs, and widgets\n• Designing wireframes, mockups, storyboards, and fully interactive prototype design'}
              />
            </div>
          </div>
        </SectionCard>
      );
    }

    if (activeTab === 'Guarantor Details') {
      return (
        <SectionCard title="View Guarantor Details" actionLabel="Update">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Guarantor’s Name</label>
              <input className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" defaultValue="Natnaeo Melaku" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Job title / Occupation</label>
              <input className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" defaultValue="Teacher" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Phone No</label>
              <input className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" defaultValue="0912344456" />
            </div>
          </div>
        </SectionCard>
      );
    }

    if (activeTab === 'Family Details') {
      return (
        <SectionCard title="View Family Details" actionLabel="Update">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Full Name</label>
              <input className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" defaultValue="Abel Doe" />
            </div>
            <Field label="Relationship" value="Brother" />
            <Field label="Phone No" value="090 300 540 9" />
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Address</label>
              <textarea className="w-full min-h-28 rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" defaultValue="djibouti Street, Addis ababa" />
            </div>
          </div>
        </SectionCard>
      );
    }

    if (activeTab === 'Financial Details') {
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-900">Financial Details</h2>
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Bank Name</label>
              <input className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" defaultValue="CBE" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Account No</label>
                <input className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" defaultValue="100022342434423" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Account Name</label>
                <input className="w-full rounded-lg border border-slate-200 bg-[#e9f2ff] px-4 py-3 text-sm" defaultValue="ABEBE KEBEDE" />
              </div>
            </div>
            <div className="pt-4">
              <button type="button" className="px-12 py-3 rounded-lg bg-green-700 text-white font-semibold">
                Update Account Details
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Job Details') {
      const UploadRow = ({ label }) => (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-700 mb-2">{label}</p>
            <div className="h-12 rounded-lg border border-slate-200 bg-[#e9f2ff]" />
          </div>
          <button type="button" className="w-44 h-12 rounded-lg bg-yellow-400 text-slate-900 font-semibold">
            Upload
          </button>
        </div>
      );

      const DocTile = ({ name }) => (
        <div className="bg-[#e9f2ff] rounded-xl border border-slate-200 p-5">
          <div className="w-14 h-16 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold">PDF</div>
          <p className="mt-3 text-xs text-slate-700">{name}</p>
        </div>
      );

      return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Job Details / {jobDocMode === 'upload' ? 'Upload Documents' : 'View Documents'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setJobDocMode('upload')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  jobDocMode === 'upload' ? 'bg-indigo-900 text-white' : 'bg-[#e9f2ff] text-slate-800'
                }`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setJobDocMode('view')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  jobDocMode === 'view' ? 'bg-indigo-900 text-white' : 'bg-[#e9f2ff] text-slate-800'
                }`}
              >
                View
              </button>
            </div>
          </div>

          {jobDocMode === 'upload' ? (
            <div className="mt-6 space-y-6">
              <UploadRow label="Upload Offer Letter" />
              <UploadRow label="Upload Birth Certificate" />
              <UploadRow label="Upload Guarantor’s Form" />
              <UploadRow label="Upload Degree Certificate" />
              <div className="pt-6 flex items-center justify-center">
                <button type="button" className="px-12 py-3 rounded-lg bg-indigo-900 text-white font-semibold">
                  Upload Documents
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <DocTile name="Signed Offer Letter.pdf" />
                <DocTile name="Birth Certificate.pdf" />
                <DocTile name="Guarantor’s Form.pdf" />
                <DocTile name="Degree Certificate.pdf" />
                <DocTile name="AB-bebe CV.pdf" />
              </div>
              <div className="pt-8 flex items-center justify-center">
                <button type="button" className="px-12 py-3 rounded-lg bg-green-700 text-white font-semibold">
                  Download ALL (Zip)
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-900">{activeTab}</h2>
        <p className="text-sm text-slate-600 mt-2">Section UI will be added here.</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-800">
        Employee Mgmt / Employee Profile / JohnDoe
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="space-y-3">
            {tabs.map((t) => {
              const active = t === activeTab;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTab(t)}
                  className={`w-full text-center px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    active ? 'bg-yellow-400 text-slate-900' : 'bg-[#e9f2ff] text-slate-800 hover:bg-[#dcecff]'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">{renderRightPane()}</div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
