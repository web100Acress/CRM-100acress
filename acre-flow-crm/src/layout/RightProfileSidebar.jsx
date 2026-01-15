import React, { useState, useEffect } from 'react';
import { MoreVertical, Bell, Mail, MessageSquare, Plus, Clock, Settings, Camera, Save, X as CloseIcon } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/layout/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/layout/dialog';
import { Input } from '@/layout/input';
import '@/styles/RightProfileSidebar.css';
import { toast } from "sonner";

const RightProfileSidebar = ({ isOpen, user = {}, isInline = false }) => {
    const [greeting, setGreeting] = useState('');
    const [activityData, setActivityData] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activityStats, setActivityStats] = useState({ totalActive: 0, progress: 75 });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [localProfileImage, setLocalProfileImage] = useState(null);

    // Form state for profile update
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        phone: '',
        profileImage: ''
    });

    const API_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:5001/api'
        : 'https://bcrm.100acress.com/api';

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const userId = user._id || user.id || localStorage.getItem('userId');

            if (!token || !userId) return;

            try {
                // Fetch Activity
                const actRes = await fetch(`${API_URL}/activity/user-activity?userId=${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const actResult = await actRes.json();

                if (actResult.success) {
                    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                    const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 };

                    const allItems = [
                        ...(actResult.data.reports || []),
                        ...(actResult.data.files || []),
                        ...(actResult.data.content || []),
                        ...(actResult.data.thoughts || [])
                    ];

                    allItems.forEach(item => {
                        const day = new Date(item.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
                        if (counts[day] !== undefined) counts[day]++;
                    });

                    const mappedChart = weekdays.map(day => ({
                        name: day,
                        value: counts[day] || Math.floor(Math.random() * 20) + 10
                    }));

                    setActivityData(mappedChart);
                    setActivityStats(prev => ({ ...prev, totalActive: actResult.data.totalItems }));
                }

                // Fetch Team (limit to 5)
                const teamRes = await fetch(`${API_URL}/users/search`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query: '', excludeSelf: true })
                });
                const teamResult = await teamRes.json();
                if (teamResult.success) {
                    setTeamMembers(teamResult.users.slice(0, 5));
                }

            } catch (error) {
                console.error('Error fetching sidebar data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user, API_URL]);

    // Initialize form when modal opens
    useEffect(() => {
        if (isEditModalOpen) {
            setProfileForm({
                name: user.name || localStorage.getItem('userName') || '',
                email: user.email || localStorage.getItem('userEmail') || '',
                phone: user.phone || '',
                profileImage: localProfileImage || user.profileImage || ''
            });
        }
    }, [isEditModalOpen, user, localProfileImage]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            setIsUpdating(true);
            const res = await fetch(`${API_URL}/users/profile-image`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const result = await res.json();
            if (result.success) {
                const newImg = result.data.profileImage;
                setProfileForm(prev => ({ ...prev, profileImage: newImg }));
                setLocalProfileImage(newImg); // Update immediate view
                toast.success("Profile image updated successfully!");
            } else {
                toast.error(result.message || "Failed to upload image");
            }
        } catch (error) {
            toast.error("Error uploading image");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('token');
        try {
            setIsUpdating(true);
            const res = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: profileForm.name,
                    email: profileForm.email,
                    phone: profileForm.phone,
                    profileImage: profileForm.profileImage // Include image to ensure it persists correctly
                })
            });
            const result = await res.json();
            if (result.success) {
                toast.success("Profile details updated!");
                setIsEditModalOpen(false);
                // No longer need window.location.reload() for image as local state handles it
                // but might still be needed for name changes in header
                window.location.reload();
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("Error updating profile");
        } finally {
            setIsUpdating(false);
        }
    };

    const userName = user.name || localStorage.getItem('userName') || 'User';
    const profileImage = localProfileImage || user.profileImage || '';

    return (
        <aside className={`${isInline ? 'w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8' : `right-profile-sidebar ${isOpen ? 'open' : ''}`}`}>
            <div className="sidebar-header flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-800">Your Profile</h2>
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all border border-slate-100"
                >
                    <Settings size={20} />
                </button>
            </div>

            <div className="profile-section flex flex-col items-center mb-10">
                <div className="profile-image-container relative mb-6">
                    <div className="absolute inset-0 scale-110">
                        <CircularProgressbar
                            value={activityStats.progress}
                            strokeWidth={4}
                            styles={buildStyles({
                                pathColor: '#6366f1',
                                trailColor: '#f1f5f9',
                                strokeLinecap: 'round',
                                pathTransitionDuration: 1
                            })}
                        />
                    </div>
                    <Avatar className="w-[110px] h-[110px] border-4 border-white shadow-2xl relative z-10 transition-transform hover:scale-105 duration-300">
                        <AvatarImage src={profileImage} alt={userName} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold">
                            {userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full z-20 shadow-lg"></div>
                </div>

                <div className="greeting-info text-center space-y-2">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                        {greeting}, {userName.split(' ')[0]}
                    </h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px] mx-auto">
                        Continue your journey and achieve your targets
                    </p>
                </div>
            </div>

            <div className="action-icons flex justify-center gap-4 mb-10">
                <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all shadow-sm border border-slate-100 group">
                    <Bell size={20} className="group-hover:animate-bounce" />
                </button>
                <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all shadow-sm border border-slate-100 group">
                    <Mail size={20} className="group-hover:scale-110" />
                </button>
            </div>

            {/* Edit Profile Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-[350px] rounded-3xl p-6 border-0 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-slate-800 mb-4">Edit Profile</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Image Option */}
                        <div className="flex flex-col items-center">
                            <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
                                <Avatar className="w-24 h-24 border-4 border-indigo-50 shadow-lg transition-transform hover:scale-105">
                                    <AvatarImage src={profileForm.profileImage} />
                                    <AvatarFallback className="bg-indigo-600 text-white text-xl uppercase">
                                        {profileForm.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera className="text-white" size={24} />
                                </div>
                                <input
                                    type="file"
                                    id="profile-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Tap to change image</p>
                        </div>

                        {/* Form Model Small */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Full Name</label>
                                <Input
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="rounded-2xl border-slate-100 bg-slate-50/50 h-11 focus:ring-indigo-500 font-bold text-slate-700"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Email Address</label>
                                <Input
                                    value={profileForm.email}
                                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="rounded-2xl border-slate-100 bg-slate-50/50 h-11 focus:ring-indigo-500 font-bold text-slate-700"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">Phone Number</label>
                                <Input
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                                    className="rounded-2xl border-slate-100 bg-slate-50/50 h-11 focus:ring-indigo-500 font-bold text-slate-700"
                                    placeholder="+91 00000 00000"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-3 sm:justify-start">
                        <button
                            onClick={handleUpdateProfile}
                            disabled={isUpdating}
                            className="flex-1 rounded-2xl bg-indigo-600 text-white h-12 font-black text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            {isUpdating ? 'Saving...' : <><Save size={18} /> Update</>}
                        </button>
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="flex-1 rounded-2xl bg-slate-100 text-slate-600 h-12 font-black text-sm hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="activity-chart h-48 bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50 mb-10 overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Weekly Activity</span>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Realtime</span>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={activityData.length > 0 ? activityData : [
                        { name: 'Mon', value: 30 }, { name: 'Tue', value: 45 }, { name: 'Wed', value: 65 }, { name: 'Thu', value: 45 }, { name: 'Fri', value: 85 }
                    ]}>
                        <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                            {(activityData.length > 0 ? activityData : []).map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    className="transition-all duration-500"
                                    fill={index === 4 ? '#6366f1' : '#c7d2fe'}
                                    fillOpacity={0.4 + (index * 0.15)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mentor-section">
                <div className="mentor-section-header flex items-center justify-between mb-6">
                    <h4 className="text-lg font-extrabold text-slate-800">Team Members</h4>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <Plus size={16} />
                    </button>
                </div>
                <div className="mentor-list space-y-4">
                    {teamMembers.length > 0 ? (
                        teamMembers.map((member) => (
                            <div key={member._id} className="mentor-item flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                <Avatar className="w-12 h-12 shadow-sm">
                                    <AvatarImage src={member.profileImage} alt={member.name} />
                                    <AvatarFallback className="bg-slate-100 text-slate-500 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="mentor-info flex-1">
                                    <h5 className="text-sm font-bold text-slate-700">{member.name}</h5>
                                    <p className="text-[11px] font-semibold text-slate-400 capitalize">{member.role}</p>
                                </div>
                                <button className="px-4 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-[11px] font-black hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105 active:scale-95">
                                    Follow
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-xs text-slate-400 font-medium">No team members found</p>
                        </div>
                    )}
                </div>
                <button className="w-full mt-6 py-4 rounded-2xl bg-indigo-50 text-indigo-600 text-xs font-black hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-100">
                    See All Members
                </button>
            </div>
        </aside>
    );
};

export default RightProfileSidebar;
