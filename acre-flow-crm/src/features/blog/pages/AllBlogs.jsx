import { useState, useEffect, useContext } from "react";
// import api100acress from "../../admin/config/api100acressClient";
import {
  ArrowDown,
  ArrowUp,
  Edit,
  Eye,
  Plus,
  Trash2,
  Search,
  Calendar,
  User,
  FileText,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  Users,
  Eye as EyeIcon,
  ThumbsUp,
  Share2,
  MessageCircle,
} from "lucide-react";
import {
  Modal,
  Switch,
  Badge,
  Progress,
  Card,
  Row,
  Col,
  Statistic,
  message,
  Tooltip,
} from "antd";
import { Link, useNavigate } from "react-router-dom";

export default function AllBlogs() {
  const token = localStorage.getItem("myToken");
  const history = useNavigate();
  
  // Get user info from localStorage (blog system)
  const blogName = localStorage.getItem('blogName') || 'Blog Manager';
  const blogEmail = localStorage.getItem('blogEmail') || 'blog@example.com';
  const blogRole = localStorage.getItem('blogRole') || 'blog';
  const isAdmin = blogRole === 'admin';
  
  const currentUserName = blogName;
  const currentUserEmail = blogEmail;
  const currentUserId = ''; // Not used in blog system

  const [blogs, setBlogs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(
    "Do you want to delete this Blog?"
  );
  const [isPublishedLoading, setIsPublishedLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [blogToDelete, setBlogToDelete] = useState(null);
  
  // State for showing limited blogs
  const [showAllBlogs, setShowAllBlogs] = useState(false);
  const INITIAL_BLOG_LIMIT = 50;

  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    totalComments: 0,
    monthlyGrowth: 0,
    topPerformingBlog: null,
  });

  // Handle delete blog modal
  const showModal = () => {
    setOpenModal(true);
  };

  // Ownership guard (UI also filtered but keep defensive checks)
  const isOwnedByMe = (blog) => {
    if (!blog) return false;
    const authorName = (blog?.author || "").toString().trim();
    const authorEmail = (blog?.authorEmail || "")
      .toString()
      .trim()
      .toLowerCase();
    const authorId = (
      blog?.authorId ||
      blog?.userId ||
      blog?.postedBy ||
      ""
    ).toString();
    const nameMatch =
      currentUserName &&
      authorName &&
      authorName.toLowerCase() === currentUserName.toLowerCase();
    const emailMatch =
      currentUserEmail && authorEmail && authorEmail === currentUserEmail;
    const idMatch = currentUserId && authorId && authorId === currentUserId;
    return isAdmin || nameMatch || emailMatch || idMatch;
  };

  const handleOk = async (id) => {
    setModalText("Deleting blog...");
    setConfirmLoading(true);
    const isDeleted = await handleDeleteUser(id);
    if (isDeleted.success) {
      setModalText("Blog deleted successfully.");
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      setConfirmLoading(false);
      setOpenModal(false);
      message.success("Blog deleted successfully.");
    } else {
      setModalText("Error deleting blog.");
      setConfirmLoading(false);
      setOpenModal(false);
      message.error("Failed to delete blog. Please try again.");
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    setBlogToDelete(null);
    setModalText("Do you want to delete this Blog?");
  };

  // Filter and sort blogs
  const filteredAndSortedBlogs = blogs
    ?.filter(
      (blog) =>
        blog?.blog_Title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        blog?.author?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const titleA = a.blog_Title || "";
        const titleB = b.blog_Title || "";
        return sortDirection === "asc"
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      }
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try multiple approaches to fetch all blogs
        console.log("=== BLOG MANAGEMENT FETCH DEBUG ===");

        // First try with high limit and page 1
        let res;
        try {
          res = await api100acress.get(`blog/view?limit=10000&page=1`);
        } catch (error) {
          console.log("First attempt failed, trying without page parameter");
          res = await api100acres.get(`blog/view?limit=10000`);
        }

        let list = Array.isArray(res?.data?.data) ? res.data.data : [];

        console.log("Total blogs fetched from API:", list.length);
        console.log("API Response pagination info:", {
          totalPages: res.data.totalPages,
          currentPage: res.data.currentPage,
          totalBlogs: res.data.totalBlogs,
          hasMore: res.data.hasMore,
        });

        // If we didn't get all blogs, try to fetch more pages
        if (res.data.totalPages && res.data.totalPages > 1) {
          console.log("Multiple pages detected, fetching all pages...");
          const allBlogs = [...list];

          for (let page = 2; page <= res.data.totalPages; page++) {
            try {
              console.log(`Fetching page ${page}...`);
              const pageRes = await api.get(
                `blog/view?limit=10000&page=${page}`
              );
              const pageBlogs = pageRes.data.data || [];
              allBlogs.push(...pageBlogs);
              console.log(`Page ${page} fetched: ${pageBlogs.length} blogs`);
            } catch (pageError) {
              console.error(`Error fetching page ${page}:`, pageError);
            }
          }

          console.log("Total blogs after fetching all pages:", allBlogs.length);
          list = allBlogs;
        }

        // Log all Khushi Singh blogs specifically
        const khushiBlogs = list.filter(
          (blog) =>
            blog.author?.toLowerCase().includes("khushi") ||
            blog.authorEmail?.toLowerCase().includes("khushi")
        );
        console.log("Khushi Singh blogs found in API:", khushiBlogs.length);
        console.log(
          "Khushi blogs details:",
          khushiBlogs.map((b) => ({
            title: b.blog_Title,
            author: b.author,
            authorEmail: b.authorEmail,
            createdAt: b.createdAt,
            isPublished: b.isPublished,
          }))
        );

        // Show all blogs (this is "All Blogs" page)
        console.log("Total blogs fetched from API:", list.length);
        console.log(
          "All blog titles:",
          list.map((b) => b.blog_Title)
        );

        setBlogs(list);

        // Calculate analytics on all blogs
        calculateAnalytics(list);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        console.error("Error details:", error.response?.data);
      }
    };
    fetchData();
  }, [currentUserName, currentUserEmail, currentUserId, isAdmin]);

  const calculateAnalytics = (blogData) => {
    const totalViews = blogData.reduce(
      (sum, blog) => sum + (blog.views || 0),
      0
    );
    const totalLikes = blogData.reduce(
      (sum, blog) => sum + (blog.likes || 0),
      0
    );
    const totalShares = blogData.reduce(
      (sum, blog) => sum + (blog.shares || 0),
      0
    );
    const totalComments = blogData.reduce(
      (sum, blog) => sum + (blog.comments || 0),
      0
    );

    const topPerformingBlog = blogData.reduce((top, blog) => {
      const blogScore =
        (blog.views || 0) + (blog.likes || 0) * 2 + (blog.shares || 0) * 3;
      const topScore =
        (top?.views || 0) + (top?.likes || 0) * 2 + (top?.shares || 0) * 3;
      return blogScore > topScore ? blog : top;
    }, null);

    setAnalytics({
      totalViews,
      totalLikes,
      totalShares,
      totalComments,
      monthlyGrowth: 12.5, // Mock data
      topPerformingBlog,
    });
  };

  // Toggle sort direction
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleIsPublished = async (checked, id) => {
    setIsPublishedLoading(true);

    try {
      const res = await api.put(`blog/update/${id}`, {
        isPublished: checked,
      });
      if (res.status >= 200 && res.status < 300) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === id ? { ...blog, isPublished: checked } : blog
          )
        );
      } else {
        console.error(
          "Something went wrong while updating the blog status",
          res.data
        );
      }
    } catch (error) {
      console.error("Error updating blog published status:", error);
    } finally {
      setIsPublishedLoading(false);
    }
  };

  function BlogPreview(description, maxLength = 80) {
    const getBlogPreview = (desc, maxLen) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = desc;
      let text = tempDiv.textContent;
      return text.length > maxLen ? text.substring(0, maxLen) + "..." : text;
    };

    const previewText = getBlogPreview(description, maxLength);
    return <p>{previewText}</p>;
  }

  const handleDeleteUser = async (id) => {
    try {
      const response = await api.delete(`blog/delete/${id}`);
      if (response.status >= 200 && response.status < 300) {
        return { success: true, error: false };
      } else {
        return { success: false, error: true };
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      return { success: false, error: true };
    }
  };

  const handleDeleteButtonClick = (id) => {
    // Always block deletion: require contacting admin
    message.warning("For delete, contact admin");
    return;
  };

  // Slugify function matching backend model's pre-save hook
  function cleanString(str) {
    return (str || '')
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')  // Remove special chars except spaces and hyphens
      .replace(/\s+/g, '-')           // Replace spaces with hyphens
      .replace(/-+/g, '-')            // Collapse multiple hyphens
      .replace(/^-+|-+$/g, '');       // Trim leading/trailing hyphens
  }
  // Prefer slug-based blog link with fallback to legacy title/id route
  const blogLink = (blog) => {
    if (blog?.slug) return `/blog/${blog.slug}`;
    return `/blog/${cleanString(blog?.blog_Title)}/${blog?._id}`;
  };

  const handleBlogView = (blog) => {
    history(blogLink(blog));
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8 w-full">
        <div className="w-full max-w-none">
         
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
            <Card className="bg-white border border-gray-100 shadow-sm" bodyStyle={{ padding: '12px' }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-semibold text-gray-800">
                  Monthly Growth
                </h3>
                <TrendingUp size={14} className="text-green-500" />
              </div>
              <Progress
                percent={analytics.monthlyGrowth}
                strokeColor="#10B981"
                showInfo={false}
                size="small"
                strokeWidth={4}
              />
              <p className="text-xs text-gray-600 mt-1">
                +{analytics.monthlyGrowth}% from last month
              </p>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm" bodyStyle={{ padding: '12px' }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-semibold text-gray-800">
                  Published Blogs
                </h3>
                <FileText size={14} className="text-blue-500" />
              </div>
              <div className="text-xl font-bold text-blue-600">
                {(blogs || []).filter((blog) => blog?.isPublished).length}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Out of {blogs.length} total blogs
              </p>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm" bodyStyle={{ padding: '12px' }}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-semibold text-gray-800">
                  Top Performing
                </h3>
                <BarChart3 size={14} className="text-purple-500" />
              </div>
              <div className="text-sm font-semibold text-gray-800 truncate">
                {analytics.topPerformingBlog?.blog_Title || "No data"}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {analytics.topPerformingBlog
                  ? `${analytics.topPerformingBlog.views || 0} views`
                  : "No performance data"}
              </p>
            </Card>
          </div>
          {openModal && (
            <Modal
              title={
                <div className="text-xl font-semibold text-gray-800">
                  Confirm Deletion
                </div>
              }
              open={openModal}
              onOk={() => handleOk(blogToDelete)}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{
                danger: true,
                className: "bg-red-600 hover:bg-red-700 border-red-600",
              }}
              className="modern-modal"
            >
              <div className="py-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 size={24} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-800">
                      {modalText}
                    </p>
                    <p className="text-sm text-gray-500">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </Modal>
          )}

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {filteredAndSortedBlogs?.length > 0 ? (
              (showAllBlogs ? filteredAndSortedBlogs : filteredAndSortedBlogs?.slice(0, INITIAL_BLOG_LIMIT))?.map((blog, index) => (
                <div
                  key={blog._id}
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                >
                  {/* Blog Image */}
                  <div className="relative h-20 overflow-hidden">
                    <img
                      src={blog?.blog_Image?.url || "/api/placeholder/400/200"}
                      alt={blog?.blog_Title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-1 right-1">
                      <Badge
                        status={blog?.isPublished ? "success" : "default"}
                        text={blog?.isPublished ? "Published" : "Draft"}
                        className="bg-white/90 backdrop-blur-sm rounded-full px-1 py-0.5 text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-2">
                    {/* Title */}
                    <h3 className="text-xs font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {blog?.blog_Title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <div className="flex items-center space-x-1">
                        <User size={8} />
                        <span className="truncate max-w-12 text-xs">
                          {blog?.author}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={8} />
                        <span className="text-xs">
                          {new Date(blog?.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "2-digit" }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center space-x-0.5">
                          <EyeIcon size={8} />
                          <span className="text-xs">{blog?.views || 0}</span>
                        </div>
                        <div className="flex items-center space-x-0.5">
                          <ThumbsUp size={8} />
                          <span className="text-xs">{blog?.likes || 0}</span>
                        </div>
                      </div>
                      <div
                        className={`w-1 h-1 rounded-full ${
                          blog?.isPublished ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2 px-1">
                      <div className="flex items-center space-x-1">
                        {/* View Blog */}
                        <button
                          onClick={() =>
                            window.open(
                              `/blog/${blog?.slug || blog?._id}`,
                              "_blank"
                            )
                          }
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200 group"
                          title="View Blog"
                        >
                          <Eye
                            size={14}
                            className="text-blue-600 group-hover:text-blue-700"
                          />
                        </button>

                        {/* Edit Blog */}
                        <button
                          onClick={() => {
                            if (!isOwnedByMe(blog)) {
                              message.warning("For edit, contact admin");
                              return;
                            }
                            history(`/seo/blogs/edit/${blog._id}`);
                          }}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 transition-all duration-200 group"
                          title="Edit Blog"
                        >
                          <Edit
                            size={14}
                            className="text-indigo-600 group-hover:text-indigo-700"
                          />
                        </button>

                        {/* Delete Blog */}
                        <button
                          onClick={() => {
                            if (!isOwnedByMe(blog)) {
                              message.warning("For delete, contact admin");
                              return;
                            }
                            setBlogToDelete(blog);
                            showModal();
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 group"
                          title="Delete Blog"
                        >
                          <Trash2
                            size={14}
                            className="text-red-600 group-hover:text-red-700"
                          />
                        </button>
                      </div>

                      {/* Publish Toggle */}
                      <div className="flex-shrink-0">
                        <button
                          className={`relative inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                            isOwnedByMe(blog)
                              ? blog?.isPublished
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (!isOwnedByMe(blog)) {
                              message.warning("For publish/unpublish, contact admin");
                              return;
                            }
                            handleIsPublished(!blog?.isPublished, blog._id);
                          }}
                          title={blog?.isPublished ? "Click to Unpublish" : "Click to Publish"}
                          disabled={!isOwnedByMe(blog)}
                        >
                          <div className="flex items-center space-x-1.5">
                            {/* Toggle Indicator */}
                            <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                              blog?.isPublished ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                            
                            {/* Status Text */}
                            <span>
                              {blog?.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText size={48} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    No blogs found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? "No blogs match your search criteria."
                      : "Start by creating your first blog post."}
                  </p>
                  <Link to="/seo/blogs/write">
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                      <Plus size={20} className="inline mr-2" />
                      Create Your First Blog
                    </button>
                  </Link>
                </div>
              </div>
            )}
            
            {/* View All Button */}
            {!showAllBlogs && filteredAndSortedBlogs?.length > INITIAL_BLOG_LIMIT && (
              <div className="col-span-full mt-8">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAllBlogs(true)}
                    className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
                  >
                    <Eye size={20} className="group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-lg">View All Blogs ({filteredAndSortedBlogs?.length})</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Simple BlogPaginationControls component for backward compatibility
export const BlogPaginationControls = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200"
        }`}
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ArrowUp size={16} className="rotate-90" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center space-x-1">
        <span className="px-4 py-2 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <button
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-200"
        }`}
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowDown size={16} className="rotate-90" />
      </button>
    </div>
  );
};

// Simple PaginationControls component for backward compatibility
export const PaginationControls = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <span className="px-4 py-2 text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};
