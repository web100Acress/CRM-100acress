import React, { useContext, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { FaFileExport, FaSearch, FaEye } from "react-icons/fa";
import api100acress from "../../admin/config/api100acressClient";
import JobApplications from "./JobApplications";

const JobPosting = () => {
  const [jobList, setJobList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetData();
  };

  const [job, setJob] = useState({
    jobLocation: "",
    jobTitle: "",
    responsibility: "",
    experience: "",
    skill: "",
    jobProfile: "",
  });

  const fetchJobOpenings = async () => {
    try {
      const res = await api100acress.get("/career/opening/ViewAll");
      const list = res?.data?.data || [];
      setJobList(list);
      loadApplicantsSummary(list);
    } catch (error) {
      console.error(error || error.message);
    }
  };

  useEffect(() => {
    fetchJobOpenings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const resetData = () => {
    setJob({
      jobLocation: "",
      jobTitle: "",
      responsibility: "",
      experience: "",
      skill: "",
      jobProfile: "",
    });
  };

  const submitJobPostingData = async (e) => {
    e.preventDefault();
    try {
      const res = await api100acress.post("/career/opening/Insert", job);
      alert("Data Posted");
      resetData();
      setIsModalOpen(false);
      fetchJobOpenings();
    } catch (error) {
      console.log(error || error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await api100acress.delete(`/career/opening/delete/${id}`);
      if (res.status >= 200 && res.status < 300) {
        fetchJobOpenings();
      } else {
        console.error("Failed to delete user. Server returned an error.");
      }
    } catch (error) {
      console.log(error || error.message);
    }
  };

  const handleDeleteButtonClick = (id) => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this job posting?"
    );
    if (confirmDeletion) {
      handleDeleteUser(id);
    }
  };

  const filteredJobs = jobList.filter((job) =>
    Object.values(job).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportToCsv = () => {
    const headers = Object.keys(jobList[0] || {}).join(",");
    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers +
      "\n" +
      jobList.map((item) => Object.values(item).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "job_postings.csv");
    document.body.appendChild(link);
    link.click();
  };

  const truncate = (str = "", n = 40) =>
    typeof str === "string" && str.length > n
      ? `${str.slice(0, n)}…`
      : str || "";

  const [applicantsSummary, setApplicantsSummary] = useState({});
  const loadApplicantsSummary = async (list) => {
    try {
      const requests = (list || []).map((item) =>
        api100acress
          .get(`/career/opening/${item._id}/applications`)
          .then((res) => ({ id: item._id, apps: res?.data?.data || [] }))
          .catch(() => ({ id: item._id, apps: [] }))
      );
      const results = await Promise.all(requests);
      const map = {};
      results.forEach(({ id, apps }) => {
        map[id] = {
          count: Array.isArray(apps) ? apps.length : 0,
          latestName:
            Array.isArray(apps) && apps.length > 0 ? apps[0].name || "" : "",
        };
      });
      setApplicantsSummary(map);
    } catch (e) {
      console.error(e);
    }
  };

  const [applicantsOpen, setApplicantsOpen] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState(null);

  const closeApplicants = () => {
    setApplicantsOpen(false);
    setSelectedOpening(null);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex-1 p-3 sm:p-6 md:p-8 lg:p-10 ml-0 md:ml-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-64">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 text-sm border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 mb-2 tracking-tight">
              JOB POSTING
            </h1>
            <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* <button
              onClick={exportToCsv}
              className="flex-1 sm:flex-none bg-gray-800 text-white font-semibold py-2 px-3 sm:px-4 rounded-md hover:bg-gray-700 transition duration-300 flex items-center justify-center space-x-2 text-xs sm:text-sm"
            >
              <FaFileExport />
              <span className="hidden sm:inline">Export</span>
            </button> */}
            <button
              onClick={openModal}
              className="flex-1 sm:flex-none bg-blue-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-md hover:bg-blue-500 transition duration-300 text-xs sm:text-sm"
            >
              Add Job
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Job Posting</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-800 transition duration-300"
                >
                  <RxCross2 size={24} />
                </button>
              </div>
              <form onSubmit={submitJobPostingData} className="space-y-4">
                <input
                  className="w-full rounded-md border-2 border-gray-300 p-2 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-300"
                  type="text"
                  placeholder="Job Location"
                  name="jobLocation"
                  value={job.jobLocation}
                  onChange={handleChange}
                />
                <input
                  className="w-full rounded-md border-2 border-gray-300 p-2 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-300"
                  type="text"
                  placeholder="Job Title"
                  name="jobTitle"
                  value={job.jobTitle}
                  onChange={handleChange}
                />
                <textarea
                  className="w-full rounded-md border-2 border-gray-300 p-2 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-300"
                  placeholder="Responsibilities (comma-separated)"
                  name="responsibility"
                  value={job.responsibility}
                  onChange={handleChange}
                  rows="3"
                />
                <input
                  className="w-full rounded-md border-2 border-gray-300 p-2 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-300"
                  type="text"
                  placeholder="Experience"
                  name="experience"
                  value={job.experience}
                  onChange={handleChange}
                />
                <input
                  className="w-full rounded-md border-2 border-gray-300 p-2 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-300"
                  type="text"
                  placeholder="Skills (comma-separated)"
                  name="skill"
                  value={job.skill}
                  onChange={handleChange}
                />
                <textarea
                  className="w-full rounded-md border-2 border-gray-300 p-2 text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-300"
                  placeholder="Job Brief"
                  name="jobProfile"
                  value={job.jobProfile}
                  onChange={handleChange}
                  rows="5"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-500 transition duration-300"
                >
                  Submit Job
                </button>
              </form>
            </div>
          </div>
        )}

        {applicantsOpen && selectedOpening && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                  Applicants - {truncate(selectedOpening.jobTitle, 40)}
                </h2>
                <button
                  onClick={closeApplicants}
                  className="text-gray-500 hover:text-gray-800 transition duration-300 p-1 hover:bg-gray-100 rounded-full"
                >
                  <RxCross2 size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <JobApplications id={selectedOpening._id} inModal={true} />
              </div>
            </div>
          </div>
        )}

        {/* Details Modal for Mobile */}
        {viewingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Job Details</h2>
                <button
                  onClick={() => setViewingJob(null)}
                  className="text-gray-500 hover:text-gray-800 transition duration-300 p-1 hover:bg-gray-100 rounded-full"
                >
                  <RxCross2 size={24} />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Job Title</p>
                  <p className="text-sm sm:text-base text-gray-900">{viewingJob.jobTitle || "—"}</p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Location</p>
                  <p className="text-sm sm:text-base text-gray-900">{viewingJob.jobLocation || "—"}</p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Experience</p>
                  <p className="text-sm sm:text-base text-gray-900">{viewingJob.experience || "—"}</p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Skills</p>
                  <p className="text-sm sm:text-base text-gray-900">{viewingJob.skill || "—"}</p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Responsibilities</p>
                  <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap">{viewingJob.responsibility || "—"}</p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Job Brief</p>
                  <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap">{viewingJob.jobProfile || "—"}</p>
                </div>
              </div>

              <div className="flex gap-2 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <Link to={`/hr/job-applications/${viewingJob._id}`} className="flex-1">
                  {/* <button className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 text-sm">
                    View Applications
                  </button> */}
                </Link>
                <button
                  onClick={() => {
                    setSelectedOpening(viewingJob);
                    setApplicantsOpen(true);
                    setViewingJob(null);
                  }}
                  className="flex-1 bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300 text-sm"
                >
                  Applications ({applicantsSummary[viewingJob._id]?.count || 0})
                </button>
                <button
                  onClick={() => {
                    handleDeleteButtonClick(viewingJob._id);
                    setViewingJob(null);
                  }}
                  className="flex-1 bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-3">S No.</th>
                  <th scope="col" className="px-6 py-3">Job Title</th>
                  <th scope="col" className="px-6 py-3">Experience</th>
                  <th scope="col" className="px-6 py-3">Location</th>
                  <th scope="col" className="px-6 py-3">Skills</th>
                  <th scope="col" className="px-6 py-3">Job Brief</th>
                  <th scope="col" className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((item, index) => (
                    <tr
                      key={item._id}
                      className="bg-white border-b border-gray-200 hover:bg-gray-50 transition duration-300"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4" title={item.jobTitle}>
                        {truncate(item.jobTitle, 50)}
                      </td>
                      <td className="px-6 py-4" title={item.experience}>
                        {truncate(item.experience, 30)}
                      </td>
                      <td className="px-6 py-4" title={item.jobLocation}>
                        {truncate(item.jobLocation, 30)}
                      </td>
                      <td className="px-6 py-4" title={item.skill}>
                        {truncate(item.skill, 40)}
                      </td>
                      <td className="px-6 py-4" title={item.jobProfile}>
                        {truncate(item.jobProfile, 60)}
                      </td>
                      <td className="px-6 py-4 space-x-2 whitespace-nowrap text-center">
                        <Link to={`/hr/job-applications/${item._id}`}>
                          {/* <button className="bg-green-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-600 transition duration-300 text-xs">
                            View Applications
                          </button> */}
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedOpening(item);
                            setApplicantsOpen(true);
                          }}
                          className="bg-gray-700 text-white font-semibold py-1 px-3 rounded-md hover:bg-gray-800 transition duration-300 text-xs"
                        >
                          Applications ({applicantsSummary[item._id]?.count || 0})
                        </button>
                        <button
                          onClick={() => handleDeleteButtonClick(item._id)}
                          className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-600 transition duration-300 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No job postings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-3">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((item, index) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md p-4 space-y-3 hover:shadow-lg transition duration-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-semibold">Job #{index + 1}</p>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                      {item.jobTitle || "—"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setViewingJob(item)}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs whitespace-nowrap flex-shrink-0"
                  >
                    <FaEye size={14} />
                    <span className="hidden xs:inline">Details</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Location:</span>
                    <span className="text-gray-900 text-right">{truncate(item.jobLocation, 20)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Experience:</span>
                    <span className="text-gray-900 text-right">{truncate(item.experience, 15)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Skills:</span>
                    <span className="text-gray-900 text-right">{truncate(item.skill, 20)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/hr/job-applications/${item._id}`} className="flex-1">
                    <button className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-300 text-xs sm:text-sm">
                      View Apps
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedOpening(item);
                      setApplicantsOpen(true);
                    }}
                    className="flex-1 bg-gray-700 text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition duration-300 text-xs sm:text-sm"
                  >
                    Apps ({applicantsSummary[item._id]?.count || 0})
                  </button>
                  <button
                    onClick={() => handleDeleteButtonClick(item._id)}
                    className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition duration-300 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No job postings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPosting;