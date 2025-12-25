import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api100acress from "../config/api100acressClient";
import AdminSidebar from "../components/AdminSidebar";
import { message, Spin, Empty, Card, Badge, Tooltip, Select, Input } from "antd";
import { MdArticle, MdSearch, MdAddCircle, MdEdit, MdDelete, MdVisibility, MdFilterList, MdRefresh, MdTrendingUp } from "react-icons/md";
import { LogOut, ChevronDown, User, Settings as SettingsIcon, Calendar, UserCheck, Clock, BarChart } from "lucide-react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const Blog = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewAll, setViewAll] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [authorFilter, setAuthorFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authorStats, setAuthorStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Token is injected by api client interceptors; no local handling needed here

  // Build per-author daily posting streak (consecutive days up to today)
  const buildAuthorStats = (rows) => {
    try {
      const stats = {};
      const byAuthor = {};
      (rows || []).forEach((r) => {
        const a = (r.author || '').toString().trim();
        if (!a) return;
        if (!byAuthor[a]) byAuthor[a] = new Set();
        const dt = r.createdAt || r.published_Date || r.updatedAt;
        if (!dt) return;
        const d = new Date(dt);
        if (isNaN(d.getTime())) return;
        const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
        byAuthor[a].add(key);
      });

      const today = new Date();
      const toKey = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().slice(0, 10);

      Object.keys(byAuthor).forEach((a) => {
        let streak = 0;
        const dates = byAuthor[a];
        const cur = new Date(today);
        // Count backward consecutive days present in dates
        while (streak < 30) { // cap at 30
          const key = toKey(cur);
          if (dates.has(key)) {
            streak += 1;
            cur.setDate(cur.getDate() - 1);
          } else {
            break;
          }
        }
        stats[a] = { streakDays: streak };
      });
      return stats;
    } catch (_) {
      return {};
    }
  };

  // Function to fetch all blog data
  const fetchBlogData = async (search = "") => {
    setLoading(true);
    try {
      // Use the new admin endpoint to get ALL blogs (published + drafts)
      const res = await api100acress.get(`blog/admin/view?page=1&limit=1000`);
      
      console.log("Admin API Response:", res.data);
      const payload = res.data;
      const allBlogsRaw = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
      
      let allBlogs = allBlogsRaw;
      
      if (search) {
        // Filter the data based on search term
        const filtered = allBlogs.filter(item =>
          (item.blog_Title && item.blog_Title.toLowerCase().includes(search.toLowerCase())) ||
          (item.blog_Category && item.blog_Category.toLowerCase().includes(search.toLowerCase())) ||
          (item.author && item.author.toLowerCase().includes(search.toLowerCase()))
        );
        
        console.log("Filtered results:", filtered.length);
        setViewAll(filtered);
      } else {
        // Display all blogs
        setViewAll(allBlogs);
      }

      // Build unique authors list from ALL data (not just filtered)
      const uniqueAuthors = Array.from(new Set((allBlogsRaw || []).map(r => (r.author || '').toString().trim()).filter(Boolean))).sort((a,b)=>a.localeCompare(b));
      setAuthors(["ALL", ...uniqueAuthors]);
      
      // Build unique categories list
      const uniqueCategories = Array.from(new Set((allBlogsRaw || []).map(r => (r.blog_Category || '').toString().trim()).filter(Boolean))).sort((a,b)=>a.localeCompare(b));
      setCategories(["ALL", ...uniqueCategories]);
      
      // Build author streak stats
      setAuthorStats(buildAuthorStats(allBlogsRaw));
    } catch (error) {
      console.error("Error fetching blog data:", error);
      messageApi.open({
        type: 'error',
        content: 'Failed to load blog posts. Please try again.',
        duration: 3,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBlogData(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    fetchBlogData();
  }, []);

  useEffect(() => {
    const userName = localStorage.getItem('userName') || localStorage.getItem('adminName') || 'Admin';
    const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('adminEmail') || 'admin@example.com';
    const userRole = localStorage.getItem('userRole') || localStorage.getItem('adminRole') || 'admin';
    setUserInfo({ name: userName, email: userEmail, role: userRole });
  }, []);

  const getUserInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('sourceSystem');
    localStorage.removeItem('originalRole');
    localStorage.removeItem('myToken');
    localStorage.removeItem('isDeveloperLoggedIn');
    localStorage.removeItem('isHrFinanceLoggedIn');
    localStorage.removeItem('isSalesHeadLoggedIn');
    localStorage.removeItem('isHRLoggedIn');
    localStorage.removeItem('isBlogLoggedIn');
    localStorage.removeItem('isItLoggedIn');
    window.location.href = '/login';
  };

  // Apply filters on top of current viewAll (which may already be search-filtered)
  const filteredBlogs = useMemo(() => {
    return viewAll.filter((row) => {
      // Author filter
      if (authorFilter !== 'ALL') {
        const a = (row.author || '').toString().trim();
        if (a.toLowerCase() !== authorFilter.toLowerCase()) return false;
      }
      
      // Category filter
      if (categoryFilter !== 'ALL') {
        const c = (row.blog_Category || '').toString().trim();
        if (c.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      }
      
      // Status filter
      if (statusFilter !== 'ALL') {
        const isPublished = row.isPublished || row.status === 'published';
        if (statusFilter === 'published' && !isPublished) return false;
        if (statusFilter === 'draft' && isPublished) return false;
      }
      
      return true;
    });
  }, [viewAll, authorFilter, categoryFilter, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = viewAll.length;
    const published = viewAll.filter(blog => blog.isPublished || blog.status === 'published').length;
    const drafts = total - published;
    const totalAuthors = authors.length - 1; // Exclude "ALL"
    
    return { total, published, drafts, totalAuthors };
  }, [viewAll, authors]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBlogData(searchTerm);
  };

  const handleDeleteUser = async (id) => {
    messageApi.open({
      key: "deletingBlog",
      type: 'loading',
      content: 'Deleting blog post...',
    });

    try {
      const response = await api100acress.delete(`blog/delete/${id}`);
      if (response.status >= 200 && response.status < 300) {
        messageApi.destroy('deletingBlog');
        messageApi.open({
          type: 'success',
          content: 'Blog post deleted successfully!',
          duration: 2,
        });
        fetchBlogData(); // Re-fetch data to update the list
      } else {
        messageApi.destroy('deletingBlog');
        messageApi.open({
          type: 'error',
          content: 'Failed to delete blog post. Server returned an error.',
          duration: 2,
        });
        console.error("Failed to delete blog post. Server returned an error.");
      }
    } catch (error) {
      messageApi.destroy('deletingBlog');
      messageApi.open({
        type: 'error',
        content: 'An error occurred while deleting blog post.',
        duration: 2,
      });
      console.error("An error occurred while deleting blog post:", error.message);
    }
  };

  const handleDeleteButtonClick = (id) => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this blog post?"
    );
    if (confirmDeletion) {
      handleDeleteUser(id);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-gray-100 h-screen flex overflow-x-hidden">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(prev => !prev)} />
      <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300 min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                <span className="lg:hidden">Blog</span>
                <span className="hidden lg:inline">Blog Management</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  type="button"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs sm:text-sm">{getUserInitials(userInfo?.name)}</span>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{userInfo?.name}</p>
                    <p className="text-xs text-gray-600 truncate max-w-[120px]">{userInfo?.email}</p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-gray-50 transition-colors" type="button">
                      <User size={16} className="text-gray-600" />
                      <span className="text-xs sm:text-sm text-gray-700">Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-gray-50 transition-colors" type="button">
                      <SettingsIcon size={16} className="text-gray-600" />
                      <span className="text-xs sm:text-sm text-gray-700">Settings</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                      type="button"
                    >
                      <LogOut size={16} />
                      <span className="text-xs sm:text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
            <div className="max-w-full mx-auto">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Posts</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                    </div>
                    <div className="bg-blue-200 p-3 rounded-full">
                      <MdArticle className="text-blue-600 text-xl" />
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Published</p>
                      <p className="text-2xl font-bold text-green-900">{stats.published}</p>
                    </div>
                    <div className="bg-green-200 p-3 rounded-full">
                      <MdVisibility className="text-green-600 text-xl" />
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Drafts</p>
                      <p className="text-2xl font-bold text-orange-900">{stats.drafts}</p>
                    </div>
                    <div className="bg-orange-200 p-3 rounded-full">
                      <MdEdit className="text-orange-600 text-xl" />
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Authors</p>
                      <p className="text-2xl font-bold text-purple-900">{stats.totalAuthors}</p>
                    </div>
                    <div className="bg-purple-200 p-3 rounded-full">
                      <UserCheck className="text-purple-600 text-xl" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Header and Controls */}
              <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <MdRefresh className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    <span className="text-sm font-medium">Refresh</span>
                  </button>
                  
                  <Link
                    to="/admin/blog/create"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <MdAddCircle className="mr-2" />
                    <span className="text-sm font-medium">Create Post</span>
                  </Link>
                </div>
              </div>

              {/* Enhanced Search and Filter Controls */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <MdFilterList className="text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
                  {(authorFilter !== 'ALL' || categoryFilter !== 'ALL' || statusFilter !== 'ALL' || searchTerm) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setAuthorFilter('ALL');
                        setCategoryFilter('ALL');
                        setStatusFilter('ALL');
                      }}
                      className="ml-auto text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative">
                      <Input
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        prefix={<MdSearch className="text-gray-400" />}
                        className="w-full"
                        allowClear
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Author</label>
                    <Select
                      value={authorFilter}
                      onChange={setAuthorFilter}
                      className="w-full"
                      placeholder="All Authors"
                      allowClear
                    >
                      {authors.map((a) => (
                        <Select.Option key={a} value={a}>
                          {a === 'ALL' ? 'All Authors' : a}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                    <Select
                      value={categoryFilter}
                      onChange={setCategoryFilter}
                      className="w-full"
                      placeholder="All Categories"
                      allowClear
                    >
                      {categories.map((c) => (
                        <Select.Option key={c} value={c}>
                          {c === 'ALL' ? 'All Categories' : c}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <Select
                      value={statusFilter}
                      onChange={setStatusFilter}
                      className="w-full"
                      placeholder="All Status"
                      allowClear
                    >
                      <Select.Option value="ALL">All Status</Select.Option>
                      <Select.Option value="published">Published</Select.Option>
                      <Select.Option value="draft">Draft</Select.Option>
                    </Select>
                  </div>
                </div>
                
                {filteredBlogs.length !== viewAll.length && (
                  <div className="mt-3 text-xs text-gray-600">
                    Showing {filteredBlogs.length} of {viewAll.length} posts
                  </div>
                )}
              </div>

              {/* Blog Posts Table */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                {loading ? (
                  <div className="p-8 text-center">
                    <Spin size="large" />
                    <p className="mt-4 text-gray-500">Loading blog posts...</p>
                  </div>
                ) : filteredBlogs.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div className="text-center">
                        <MdArticle className="text-4xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium mb-2">No blog posts found</p>
                        <p className="text-gray-400 text-sm">
                          {searchTerm || authorFilter !== 'ALL' || categoryFilter !== 'ALL' || statusFilter !== 'ALL'
                            ? 'Try adjusting your filters or search terms'
                            : 'Start by creating your first blog post'}
                        </p>
                        {!searchTerm && authorFilter === 'ALL' && categoryFilter === 'ALL' && statusFilter === 'ALL' && (
                          <Link
                            to="/admin/blog/create"
                            className="inline-flex items-center px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <MdAddCircle className="mr-2" />
                            Create Your First Post
                          </Link>
                        )}
                      </div>
                    }
                  />
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="sm:hidden p-4 space-y-4">
                      {filteredBlogs.map((item, index) => {
                        const serialNumber = index + 1;
                        const id = item._id;
                        const postedOn = (() => {
                          const dt = item.createdAt || item.published_Date || item.updatedAt;
                          return dt ? new Date(dt).toLocaleDateString() : 'N/A';
                        })();
                        const status = item.status || 'published';
                        const statusColor = status === 'published' ? 'green' : 'orange';
                        const streakDays = authorStats[item.author]?.streakDays || 0;
                        const streakColor = streakDays >= 7 ? 'green' : streakDays >= 3 ? 'orange' : 'red';

                        return (
                          <div key={id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">{item.blog_Title}</h3>
                                <p className="text-sm text-gray-600">{item.blog_Category}</p>
                              </div>
                              <span className="text-xs text-gray-500">#{serialNumber}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                              <div><span className="font-medium">Author:</span> {item.author}</div>
                              <div><span className="font-medium">Date:</span> {postedOn}</div>
                              <div><span className="font-medium">Status:</span> <span className={`text-${statusColor}-600`}>{status}</span></div>
                              <div><span className="font-medium">Streak:</span> <span className={`text-${streakColor}-600`}>{streakDays} days</span></div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Tippy content={<span>View post</span>} animation="scale" theme="light-border">
                                <Link
                                  to={`/blog/${item.slug || id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <MdVisibility size={18} />
                                </Link>
                              </Tippy>
                              <Tippy content={<span>Edit post</span>} animation="scale" theme="light-border">
                                <Link
                                  to={`/admin/blog/edit/${id}`}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <MdEdit size={18} />
                                </Link>
                              </Tippy>
                              <Tippy content={<span>Delete post</span>} animation="scale" theme="light-border">
                                <button
                                  onClick={() => handleDeleteButtonClick(id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <MdDelete size={18} />
                                </button>
                              </Tippy>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SNo.</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Posted On</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Consistency</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBlogs.map((item, index) => {
                            const serialNumber = index + 1;
                            const id = item._id;
                            const postedOn = (() => {
                              const dt = item.createdAt || item.published_Date || item.updatedAt;
                              return dt ? new Date(dt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
                            })();
                            const aName = (item.author || '').toString().trim();
                            const streak = authorStats[aName]?.streakDays || 0;
                            const isConsistent = streak >= 3;
                            return (
                              <tr key={id} className="group even:bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{serialNumber}</td>
                                <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">{item.blog_Title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full shadow-sm">{item.blog_Category}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{postedOn}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${isConsistent ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                    {isConsistent ? `Consistent (${streak} days)` : `${streak} days`}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${item.isPublished ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                    {item.isPublished ? 'Published' : 'Draft'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                  <Tippy content={<span>View blog post</span>} animation="scale" theme="light-border">
                                    <Link to={`/blog/${item.slug || id}`}>
                                      <button className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 group">
                                        <MdVisibility className="text-lg group-hover:animate-bounce" /> View
                                      </button>
                                    </Link>
                                  </Tippy>
                                  <Tippy content={<span>Edit blog post</span>} animation="scale" theme="light-border">
                                    <Link to={`/admin/blog/edit/${id}`}>
                                      <button className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 group">
                                        <MdEdit className="text-lg group-hover:animate-bounce" /> Edit
                                      </button>
                                    </Link>
                                  </Tippy>
                                  <Tippy content={<span>Delete blog post</span>} animation="scale" theme="light-border">
                                    <button
                                      onClick={() => handleDeleteButtonClick(id)}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 group"
                                    >
                                      <MdDelete className="text-lg group-hover:animate-pulse" /> Delete
                                    </button>
                                  </Tippy>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Blog;
