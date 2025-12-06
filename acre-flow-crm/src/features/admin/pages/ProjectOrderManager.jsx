import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Helmet } from "react-helmet";
import api100acress from "../config/api100acressClient";
import AdminSidebar from "../components/AdminSidebar";
import { MdMenu } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProjectOrderManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedBuilder, setSelectedBuilder] = useState("");
  const [isRandomOrder, setIsRandomOrder] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [previewProject, setPreviewProject] = useState(null);
  const [showRawDetails, setShowRawDetails] = useState(false);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [showRelated, setShowRelated] = useState(false);
  const [relatedOrderIds, setRelatedOrderIds] = useState([]);
  const [relatedSynced, setRelatedSynced] = useState(true);
  const [relatedSaving, setRelatedSaving] = useState(false);
  const [relatedSelected, setRelatedSelected] = useState(null);
  const [relatedTargetPos, setRelatedTargetPos] = useState("");
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedBuilder, setRelatedBuilder] = useState("");
  const [targetPosition, setTargetPosition] = useState("");
  const [isSynced, setIsSynced] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasSyncedRef = useRef(false);
  const previewRef = useRef(null);
  const relatedRef = useRef(null);
  const propSyncTimerRef = useRef(null);
  const relatedSyncTimerRef = useRef(null);

  const [manageMode, setManageMode] = useState('projects');
  const [propItems, setPropItems] = useState([]);
  const [propLoading, setPropLoading] = useState(false);
  const [propSynced, setPropSynced] = useState(true);
  const [propOrderIds, setPropOrderIds] = useState([]);

  const buildersData = {
    'signature-global': { name: 'Signature Global', projects: [], query: 'Signature Global' },
    'm3m-india': { name: 'M3M India', projects: [], query: 'M3M India' },
    'dlf-homes': { name: 'DLF Homes', projects: [], query: 'DLF Homes' },
    'experion-developers': { name: 'Experion Developers', projects: [], query: 'Experion Developers' },
    'elan-group': { name: 'Elan Group', projects: [], query: 'Elan Group' },
    'bptp-limited': { name: 'BPTP LTD', projects: [], query: 'BPTP LTD' },
    'adani-realty': { name: 'Adani Realty', projects: [], query: 'Adani Realty' },
    'smartworld-developers': { name: 'Smartworld', projects: [], query: 'Smartworld' },
    'trevoc-group': { name: 'Trevoc Group', projects: [], query: 'Trevoc Group' },
    'indiabulls-real-estate': { name: 'Indiabulls', projects: [], query: 'Indiabulls' },
    'central-park': { name: 'Central Park', projects: [], query: 'Central Park' },
    'emaar-india': { name: 'Emaar India', projects: [], query: 'Emaar India' },
    'godrej-properties': { name: 'Godrej Properties', projects: [], query: 'Godrej Properties' },
    'whiteland': { name: 'Whiteland Corporation', projects: [], query: 'Whiteland Corporation' },
    'aipl': { name: 'AIPL', projects: [], query: 'AIPL' },
    'birla-estate': { name: 'Birla Estates', projects: [], query: 'Birla Estates' },
    'sobha-developers': { name: 'Sobha', projects: [], query: 'Sobha' },
    'trump-towers': { name: 'Trump Towers', projects: [], query: 'Trump Towers' },
    'puri-developers': { name: 'Puri Constructions', projects: [], query: 'Puri Constructions' },
    'aarize-developers': { name: 'Aarize Group', projects: [], query: 'Aarize Group' }
  };

  const selectedBuilderData = buildersData[selectedBuilder];
  const selectedBuilderProjects = selectedBuilderData?.projects || [];

  const handleBuilderChange = (e) => {
    setSelectedBuilder(e.target.value);
  };

  const handleOrderTypeChange = (e) => {
    const isRandom = e.target.value === 'random';
    setIsRandomOrder(isRandom);
  };

  const handleDragEnd = (result) => {
    if (!result.destination || !selectedBuilder) return;
    console.log('Project reordered');
  };

  const handleSaveOrder = async () => {
    if (!selectedBuilder) return;
    console.log('Order saved');
  };

  const handleResetToRandom = async () => {
    if (!selectedBuilder) return;
    console.log('Reset to random');
  };

  const handleLoadProjects = () => {
    if (!selectedBuilder) return;
    console.log('Projects loaded');
  };

  const handleMoveProject = async () => {
    if (!selectedProject || !targetPosition || !selectedBuilder) {
      toast.error('Please select a project and enter a valid position');
      return;
    }

    const targetIndex = parseInt(targetPosition) - 1;
    if (targetIndex < 0 || targetIndex >= selectedBuilderProjects.length) {
      alert('Invalid position. Please enter a number between 1 and ' + selectedBuilderProjects.length);
      return;
    }

    setSelectedProject(null);
    setTargetPosition("");
    toast.success('Project moved successfully');
  };

  const openRelatedByBuilder = async (project) => {
    if (!project) return;
    const labelRaw = project.builderName || project.builder || project.builder_name || "";
    const label = (typeof labelRaw === 'string' ? labelRaw.trim() : labelRaw) || "";
    if (!label) return;

    setPreviewProject(null);
    setRelatedBuilder(label);
    setShowRelated(true);

    setTimeout(() => {
      try {
        if (relatedRef?.current) {
          relatedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (_) {}
    }, 0);

    setRelatedLoading(true);
    try {
      setRelatedProjects([]);
      setRelatedOrderIds([]);
      setRelatedSynced(true);
    } catch (e) {
      console.error('Error:', e);
    } finally {
      setRelatedLoading(false);
    }
  };

  const moveRelatedProperty = (index, dir) => {
    setRelatedProjects(prev => {
      const arr = [...prev];
      const j = index + dir;
      if (j < 0 || j >= arr.length) return arr;
      const tmp = arr[index];
      arr[index] = arr[j];
      arr[j] = tmp;
      setRelatedOrderIds(arr.map(p => p._id || p.id));
      setRelatedSynced(false);
      return arr;
    });
  };

  const handleSaveRelatedPropertyOrder = async () => {
    setRelatedSynced(true);
    toast.success('Related properties order saved');
  };

  const moveProperty = (index, dir) => {
    setPropItems(prev => {
      const arr = [...prev];
      const j = index + dir;
      if (j < 0 || j >= arr.length) return arr;
      const tmp = arr[index];
      arr[index] = arr[j];
      arr[j] = tmp;
      setPropOrderIds(arr.map(p => p._id || p.id));
      setPropSynced(false);
      return arr;
    });
  };

  const handleSavePropertyOrder = async () => {
    setPropSynced(true);
    toast.success('Properties order saved');
  };

  useEffect(() => {
    if (selectedBuilder) {
      setIsRandomOrder(true);
    }
  }, [selectedBuilder]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 min-h-screen flex font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <Helmet>
          <title>Project Order Manager - Admin Dashboard</title>
        </Helmet>

        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <MdMenu size={24} />
          </button>
        </div>

        {/* Main Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Project Order Manager
          </h1>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Builder Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Builder
              </label>
              <select
                value={selectedBuilder}
                onChange={handleBuilderChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Choose a builder...</option>
                {Object.entries(buildersData).map(([key, builder]) => (
                  <option key={key} value={key}>
                    {builder.name} ({builder.projects?.length || 0} projects)
                  </option>
                ))}
              </select>
            </div>

            {/* Order Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Type
              </label>
              <select
                value={isRandomOrder ? 'random' : 'manual'}
                onChange={handleOrderTypeChange}
                disabled={!selectedBuilder}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="random">Random Order</option>
                <option value="manual">Manual Order</option>
              </select>
            </div>
          </div>

          {/* Management Mode Toggle */}
          <div className="mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setManageMode('projects')}
                className={`px-4 py-2 text-sm font-medium border ${
                  manageMode === 'projects'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                }`}
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => setManageMode('properties')}
                className={`px-4 py-2 text-sm font-medium border -ml-px ${
                  manageMode === 'properties'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                }`}
              >
                Properties
              </button>
            </div>
          </div>

          {/* Status Display */}
          {selectedBuilder && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Current Status: {selectedBuilderData?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isRandomOrder ? 'Using random order' : 'Using manual order'}
              </p>
              <p className={`text-sm ${isSynced ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {isSynced ? "✅ Synced with server" : "🔄 Syncing with server..."}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {selectedBuilder && (
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={handleSaveOrder}
                disabled={isLoading || !selectedBuilder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? 'Saving...' : 'Save Order'}
              </button>

              <button
                onClick={handleResetToRandom}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Reset to Random
              </button>

              <button
                onClick={handleLoadProjects}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Load Projects
              </button>
            </div>
          )}
        </div>

        {/* Properties Management (Properties mode) */}
        {selectedBuilder && manageMode === 'properties' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {selectedBuilderData?.name} Properties
              </h2>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${propSynced ? 'text-green-600' : 'text-yellow-600'}`}>
                  {propSynced ? '✅ Synced' : '🔄 Unsaved changes'}
                </span>
                <button
                  onClick={handleSavePropertyOrder}
                  disabled={propLoading || propItems.length === 0 || propSynced}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  {propLoading ? 'Saving...' : 'Save Property Order'}
                </button>
              </div>
            </div>

            {propLoading ? (
              <div className="text-center py-8 text-gray-600">Loading properties…</div>
            ) : propItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No properties found for this builder.</div>
            ) : (
              <div className="space-y-2">
                {propItems.map((p, idx) => (
                  <div
                    key={p._id || p.id || idx}
                    className="flex items-center justify-between p-3 border rounded-md bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-100">
                          {p.projectName || p.name || p.project_title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {(p.city || p.location_city) ?? ''}
                          {(p.state || p.location_state) ? `, ${p.state || p.location_state}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveProperty(idx, -1)}
                        disabled={idx === 0}
                        className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 disabled:opacity-50 transition-all"
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveProperty(idx, 1)}
                        disabled={idx === propItems.length - 1}
                        className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 disabled:opacity-50 transition-all"
                        title="Move down"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project List (Projects mode) */}
        {selectedBuilder && manageMode === 'projects' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {selectedBuilderData?.name} Projects
            </h2>

            {/* Quick Move Section */}
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">Quick Move Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Project
                  </label>
                  <select
                    value={selectedProject ? selectedProject._id || selectedProject.id : ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) {
                        setSelectedProject(null);
                        return;
                      }
                      const proj = selectedBuilderProjects.find(p => String(p._id || p.id) === String(val));
                      setSelectedProject(proj || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select project…</option>
                    {selectedBuilderProjects.map((project, index) => (
                      <option key={project._id || project.id} value={String(project._id || project.id)}>
                        {index + 1}. {project.projectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Move to Position
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedBuilderProjects.length}
                    value={targetPosition}
                    onChange={(e) => setTargetPosition(e.target.value)}
                    placeholder={`1-${selectedBuilderProjects.length}`}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleMoveProject}
                    disabled={!selectedProject || !targetPosition}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Move Project
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      setTargetPosition("");
                    }}
                    className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    title="Clear"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            {isLoadingProjects ? (
              <div className="text-center py-8 text-gray-600">Loading projects...</div>
            ) : selectedBuilderProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedBuilderProjects.map((project, index) => (
                  <div
                    key={project._id || project.id}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {index + 1}. {project.projectName}
                      </h3>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-600 dark:text-blue-300">
                        Position {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {project.city}, {project.state}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {project.type}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No projects found for this builder.
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">How it works:</h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>
              <strong>Random Order:</strong> New builders automatically get random project ordering.
              This provides variety and prevents bias in project display.
            </p>
            <p>
              <strong>Manual Order:</strong> You can create a custom order for projects.
              This order will be saved and used consistently.
            </p>
            <p>
              <strong>Switching:</strong> You can switch between random and manual ordering at any time.
              Manual orders are preserved when switching back and forth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOrderManager;