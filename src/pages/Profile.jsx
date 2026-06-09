import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import {
  getCurrentUser,
  getCurrentUserPosts,
  updateCurrentUser,
} from "../services/userService";
import { deletePost } from "../services/postService";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const triggerDeleteConfirmation = (postId) => {
    setPostIdToDelete(postId);
  };

  const handleDelete = async () => {
    if (!postIdToDelete) return;
    
    try {
      setIsDeleting(true);
      await deletePost(postIdToDelete);
      setPosts(posts.filter((post) => post.postId !== postIdToDelete));
      setPostIdToDelete(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const userResponse = await getCurrentUser();
      const postsResponse = await getCurrentUserPosts();

      setUser(userResponse.data);
      setNewUsername(userResponse.data.username);
      setPosts(postsResponse.data.posts || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!newUsername.trim()) return;
    try {
      const response = await updateCurrentUser({
        username: newUsername,
      });

      setUser(response.data);
      setNewUsername(response.data.username);
      setIsEditing(false);
      
      setProfileSuccessMsg("Profile saved successfully");
      setTimeout(() => setProfileSuccessMsg(""), 4000);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-bold text-emerald-800 animate-pulse">
          Loading Profile Details...
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-[#f2f9f4] via-[#e8f5ed] to-[#dcf0e4] min-h-screen pb-24">
      <Navbar />

      {/* Main Structural Wrapper Container */}
      <div className="max-w-5xl mx-auto p-6 flex flex-col items-center justify-center space-y-8">
        
        {/* SECTION 1: Top User Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-emerald-900/5 w-full text-center flex flex-col items-center justify-center relative">
          
          {profileSuccessMsg && (
            <div className="absolute top-4 bg-emerald-50 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl border border-emerald-100 shadow-xs animate-fade-in">
              ✨ {profileSuccessMsg}
            </div>
          )}

          <div className="w-16 h-16 bg-[#5ea134] text-white flex items-center justify-center rounded-2xl text-2xl font-black mb-4 shadow-md shadow-[#5ea134]/20 uppercase">
            {user.username ? user.username.substring(0, 2) : "AU"}
          </div>

          <div className="space-y-2 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#5ea134]/10 text-[#4c8529] px-2.5 py-1 rounded-md">
                Author Profile
              </span>
              <p className="text-sm text-gray-500 font-medium">{user.email}</p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1 min-h-11">
              {isEditing ? (
                <div className="flex items-center gap-2 animate-fade-in">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="border border-emerald-900/20 bg-[#f2f9f4] px-3 py-1.5 rounded-xl text-sm font-bold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#5ea134]"
                  />
                  <button
                    onClick={handleUpdateProfile}
                    className="bg-[#5ea134] hover:bg-[#4c8529] text-white px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setNewUsername(user.username);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    @{user.username}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-[#e4f2e9] border border-emerald-900/5 rounded-lg transition-all cursor-pointer"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 bg-[#f2f9f4]/60 p-2.5 px-5 rounded-xl border border-emerald-900/5 mt-4">
            <div className="text-center">
              <span className="block text-lg font-black text-gray-900">
                {posts.length}
              </span>
              <span className="text-[10px] font-black text-emerald-800/60 uppercase tracking-widest">
                Total Publications
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Dynamic Full-Width Posts Panel (2-Column Grid Layout) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-emerald-900/5 w-full">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              My Publications
            </h2>
            <span className="text-sm font-black bg-[#5ea134]/10 text-[#4c8529] px-3 py-0.5 rounded-full">
              {posts.length} Cards
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 text-sm font-semibold text-gray-400 italic">
              No written documents recorded under this user profile.
            </div>
          ) : (
            /* ✨ THE GRID TRANSFORMATION: 
              - grid-cols-1: Single column layout on mobile screens
              - md:grid-cols-2: Snaps into a perfectly symmetric 2-column layout on desktops
              - gap-6: Generates crisp, identical gutters between columns and rows
            */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-1">
              {[...posts].reverse().map((post) => (
                <div
                  key={post.postId}
                  className="p-5 rounded-2xl bg-gray-50/50 border border-gray-200/60 hover:border-emerald-900/10 transition-all flex flex-col justify-between gap-4 group/item w-full min-h-45 shadow-xs hover:shadow-md"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                        {post.categoryName}
                      </span>
                      
                      {/* Control Panel Tray */}
                      {postIdToDelete !== post.postId && (
                        <div className="flex items-center gap-1 opacity-80 group-hover/item:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(post.postId)}
                            title="Edit Post"
                            className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-transparent transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                          </button>

                          <button
                            onClick={() => triggerDeleteConfirmation(post.postId)}
                            title="Delete Post"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent transition-all cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    <h3 
                      onClick={() => navigate(`/posts/${post.postId}`)}
                      className="font-black text-base text-gray-900 line-clamp-2 pt-1 group-hover/item:text-[#5ea134] transition-colors cursor-pointer leading-snug"
                    >
                      {post.title}
                    </h3>
                  </div>

                  {/* Inline micro confirmations area */}
                  {postIdToDelete === post.postId ? (
                    <div className="p-2 bg-red-50/60 border border-red-100 rounded-xl flex items-center justify-between gap-2 animate-fade-in w-full mt-auto">
                      <span className="text-[10px] text-red-700 font-bold tracking-tight">
                        Remove post?
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          disabled={isDeleting}
                          onClick={() => setPostIdToDelete(null)}
                          className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 rounded-md cursor-pointer transition-colors"
                        >
                          No
                        </button>
                        <button
                          disabled={isDeleting}
                          onClick={handleDelete}
                          className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer transition-all flex items-center justify-center min-w-10"
                        >
                          {isDeleting ? (
                            <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            "Yes"
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(`/posts/${post.postId}`)}
                      className="text-xs font-bold text-emerald-800/70 group-hover/item:text-[#4c8529] transition-colors mt-2 flex items-center gap-1 cursor-pointer align-bottom"
                    >
                      Read full story 
                      <svg className="w-3 h-3 group-hover/item:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;