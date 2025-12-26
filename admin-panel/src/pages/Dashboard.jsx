import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext, DarkModeContext } from "../App";
import {
    Trash2, Users, ShoppingCart, Activity, Shield,
    Stethoscope, Plus, Save, X, BriefcaseMedical, LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { darkMode } = useContext(DarkModeContext);

    // Tabs state
    const [activeTab, setActiveTab] = useState("overview");

    // Data state
    const [stats, setStats] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state for creating new entries
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(""); // "doctor" | "service"
    const [formData, setFormData] = useState({});

    const token = localStorage.getItem("token");
    const API_URL = "http://localhost:4000/api/admin";

    // Styles matching "Liquid Glass" theme
    const glassCard = "bg-white/10 dark:bg-[#0A2A43]/40 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl";
    const glassInput = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-400 text-gray-800 dark:text-white placeholder-gray-500 transition-all";
    const glassButton = "px-4 py-2 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all shadow-lg backdrop-blur-md";

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab === "users") fetchUsers();
        if (activeTab === "staff") fetchDoctors();
        if (activeTab === "services") fetchServices();
    }, [activeTab]);

    // --- API Calls ---
    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_URL}/stats`, { headers: { Authorization: `Bearer ${token}` } });
            setStats(res.data);
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
            setUsersList(res.data);
        } catch (err) { showNotification("Failed to fetch users", "error"); }
    };

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${API_URL}/doctors`, { headers: { Authorization: `Bearer ${token}` } });
            setDoctorsList(res.data);
        } catch (err) { showNotification("Failed to fetch staff", "error"); }
    };

    const fetchServices = async () => {
        try {
            const res = await axios.get(`${API_URL}/services`, { headers: { Authorization: `Bearer ${token}` } });
            setServicesList(res.data);
        } catch (err) { showNotification("Failed to fetch services", "error"); }
    };

    // --- Handlers ---
    const handleDeleteUser = async (id, userRole) => {
        if (userRole === "superadmin") return showNotification("Cannot delete Super Admin!", "error");
        if (!window.confirm("Delete user?")) return;
        try {
            await axios.delete(`${API_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            showNotification("User deleted", "success");
            fetchUsers();
            fetchStats();
        } catch (err) { showNotification("Failed to delete", "error"); }
    };

    const handleDeleteDoctor = async (id) => {
        if (!window.confirm("Delete staff member?")) return;
        try {
            await axios.delete(`${API_URL}/doctors/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            showNotification("Staff member removed", "success");
            fetchDoctors();
        } catch (err) { showNotification("Failed to delete", "error"); }
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm("Delete service?")) return;
        try {
            await axios.delete(`${API_URL}/services/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            showNotification("Service removed", "success");
            fetchServices();
        } catch (err) { showNotification("Failed to delete", "error"); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const endpoint = modalType === "doctor" ? "/doctors" : "/services";
            await axios.post(`${API_URL}${endpoint}`, formData, { headers: { Authorization: `Bearer ${token}` } });
            showNotification(`${modalType === "doctor" ? "Staff" : "Service"} added successfully`, "success");
            setShowModal(false);
            setFormData({});
            modalType === "doctor" ? fetchDoctors() : fetchServices();
        } catch (err) { showNotification("Failed to create", "error"); }
    };

    // --- Render Helpers ---
    if (loading && !stats) return <div className="min-h-screen flex items-center justify-center text-white">Loading Admin Panel...</div>;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white transition-colors duration-500">
            {/* Sidebar */}
            <aside className={`w-full md:w-72 ${glassCard} m-0 md:m-4 flex flex-col backdrop-blur-2xl`}>
                <div className="p-8 border-b border-white/10">
                    <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-blue-400" />
                        MediNova
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium tracking-wide">
                        Administrator Access
                    </p>
                </div>

                <nav className="flex-1 p-4 space-y-3">
                    <SidebarItem icon={<LayoutDashboard />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                    <SidebarItem icon={<Users />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
                    <SidebarItem icon={<Stethoscope />} label="Manage Staff" active={activeTab === "staff"} onClick={() => setActiveTab("staff")} />
                    <SidebarItem icon={<BriefcaseMedical />} label="Services" active={activeTab === "services"} onClick={() => setActiveTab("services")} />
                    <SidebarItem icon={<ShoppingCart />} label="Live Carts" active={activeTab === "carts"} onClick={() => setActiveTab("carts")} />
                </nav>

                <div className="p-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                            {user?.fullName?.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-200">{user?.fullName}</p>
                            <p className="text-xs text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-wider">{user?.role}</p>
                        </div>
                        <button onClick={logout} className="text-red-400 hover:text-white transition-colors"><X size={16} /></button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {/* OVERVIEW */}
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard icon={<Users />} title="Total Users" value={stats?.totalUsers} color="from-blue-500 to-blue-600" />
                                <StatCard icon={<Shield />} title="Admin Staff" value={stats?.roles?.admin + (stats?.roles?.superadmin || 0)} color="from-purple-500 to-purple-600" />
                                <StatCard icon={<ShoppingCart />} title="Active Carts" value={stats?.activeCarts || 0} color="from-emerald-500 to-emerald-600" />
                            </div>

                            {/* Quick Status */}
                            <div className={`${glassCard} p-8`}>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">System Health</h3>
                                <div className="flex items-center gap-4 text-green-500 dark:text-green-400 bg-green-500/10 px-4 py-3 rounded-xl border border-green-500/20">
                                    <Activity className="w-6 h-6 animate-pulse" />
                                    <span className="font-semibold">All Systems Operational</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* USERS */}
                    {activeTab === "users" && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className={`${glassCard} overflow-hidden flex flex-col`}
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h3>
                                <span className="text-sm text-gray-500">Total: {usersList.length}</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Name</th>
                                            <th className="px-6 py-4">Email</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                                        {usersList.map((u) => (
                                            <tr key={u._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{u.fullName}</td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <RoleBadge role={u.role} />
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {u.role !== 'superadmin' && (
                                                        <button
                                                            onClick={() => handleDeleteUser(u._id, u.role)}
                                                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* STAFF */}
                    {activeTab === "staff" && (
                        <motion.div key="staff" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Medical Staff</h2>
                                <button onClick={() => { setModalType("doctor"); setShowModal(true); }} className={glassButton}>
                                    <Plus className="w-5 h-5 inline mr-2" /> Add Staff
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {doctorsList.map((doc) => (
                                    <div key={doc._id} className={`${glassCard} p-6 relative group overflow-hidden`}>
                                        <div className="flex items-start justify-between">
                                            <img src={doc.image || "https://via.placeholder.com/150"} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                                            <button onClick={() => handleDeleteDoctor(doc._id)} className="text-gray-400 hover:text-red-500 transition-colors p-2"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                        <h3 className="text-xl font-bold mt-4 text-gray-800 dark:text-white">{doc.name}</h3>
                                        <p className="text-blue-500 text-sm font-medium uppercase tracking-wide mb-2">{doc.role}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm italic">{doc.specialty}</p>
                                        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-400">
                                            exp: {doc.experience}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* SERVICES */}
                    {activeTab === "services" && (
                        <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Services</h2>
                                <button onClick={() => { setModalType("service"); setShowModal(true); }} className={glassButton}>
                                    <Plus className="w-5 h-5 inline mr-2" /> Add Service
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {servicesList.map((svc) => (
                                    <div key={svc._id} className={`${glassCard} p-0 overflow-hidden group`}>
                                        <div className="h-40 overflow-hidden relative">
                                            <img src={svc.image} alt={svc.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <button
                                                onClick={() => handleDeleteService(svc._id)}
                                                className="absolute top-2 right-2 p-2 bg-black/40 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{svc.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">{svc.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* CREATE MODAL */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`${glassCard} w-full max-w-lg p-8`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white">
                                    Add New {modalType === 'doctor' ? 'Staff Member' : 'Service'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X /></button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-4">
                                {modalType === 'doctor' ? (
                                    <>
                                        <input className={glassInput} placeholder="Full Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        <input className={glassInput} placeholder="Role (e.g., Chief Surgeon)" required onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                        <input className={glassInput} placeholder="Specialty" required onChange={e => setFormData({ ...formData, specialty: e.target.value })} />
                                        <input className={glassInput} placeholder="Experience (e.g., 10 years)" onChange={e => setFormData({ ...formData, experience: e.target.value })} />
                                        <input className={glassInput} placeholder="Image URL" required onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                        <select className={glassInput} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                            <option value="doctor" className="text-black">Doctor</option>
                                            <option value="nurse" className="text-black">Nurse</option>
                                            <option value="staff" className="text-black">Other Staff</option>
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <input className={glassInput} placeholder="Service Title" required onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                        <textarea className={`${glassInput} h-32`} placeholder="Description" required onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                        <input className={glassInput} placeholder="Image URL" required onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                    </>
                                )}
                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10">Cancel</button>
                                    <button type="submit" className={glassButton}>
                                        <Save className="w-4 h-4 inline mr-2" /> Save Entry
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${active
            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/20"
            : "text-gray-500 dark:text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
    >
        {React.cloneElement(icon, { className: `w-5 h-5 transition-transform group-hover:scale-110 ${active ? "text-white" : ""}` })}
        <span className="font-medium">{label}</span>
    </button>
);

const StatCard = ({ icon, title, value, color }) => (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${color} shadow-xl text-white relative overflow-hidden group`}>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                {React.cloneElement(icon, { className: "w-8 h-8" })}
            </div>
            <div>
                <p className="text-blue-100 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold">{value}</h3>
            </div>
        </div>
    </div>
);

const RoleBadge = ({ role }) => {
    const styles = {
        superadmin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        admin: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        doctor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        user: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[role] || styles.user}`}>
            {role}
        </span>
    );
};

export default AdminDashboard;
