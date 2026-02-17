import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';

const dummyScoreHistory = [
    { uniqueIndex: 0, date: 'Start', score: 50 },
    { uniqueIndex: 1, date: 'Now', score: 50 }
];

const activityData = [
    { day: 'M', problems: 2 }, { day: 'T', problems: 5 },
    { day: 'W', problems: 1 }, { day: 'T', problems: 6 },
    { day: 'F', problems: 8 }, { day: 'S', problems: 3 },
    { day: 'S', problems: 4 },
];

export default function DashboardCharts() {
    const [scoreHistory, setScoreHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [growth, setGrowth] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            // Using absolute path for client-side fetch, assuming API is on port 3000
            const res = await fetch("/api/kv/history");
            const data = await res.json();

            if (data && Array.isArray(data) && data.length > 0) {
                // Map data to include a unique index for Recharts to track separate points
                const formattedData = data.map((item, index) => ({
                    ...item,
                    uniqueIndex: index,
                    date: item.date
                }));

                setScoreHistory(formattedData);

                if (data.length > 1) {
                    const first = data[0].score || 1;
                    const last = data[data.length - 1].score;
                    const growthPercent = Math.round(((last - first) / first) * 100);
                    setGrowth(growthPercent);
                }
            } else {
                setScoreHistory(dummyScoreHistory);
            }
        } catch (error) {
            setScoreHistory(dummyScoreHistory);
        } finally {
            setLoading(false);
        }
    };

    // ✅ FIXED HELPER: Explicitly handles 'any' type to prevent TypeScript label errors
    const formatXAxis = (index: any): string => {
        const idx = Number(index);
        if (scoreHistory[idx]) return scoreHistory[idx].date;
        return "";
    };

    if (!mounted) return <div className="h-64 bg-transparent" />;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">

            {/* Chart 1: Resume Progress */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Score Trajectory</h3>
                        <p className="text-xs text-slate-500 font-medium">{loading ? "Syncing..." : "Analysis History"}</p>
                    </div>
                    {!loading && (
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border 
                            ${growth >= 0 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            <TrendingUp size={14} className={growth < 0 ? "rotate-180" : ""} />
                            {growth >= 0 ? `+${growth}%` : `${growth}%`}
                        </div>
                    )}
                </div>

                <div className="w-full h-64 relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                            <Loader2 className="animate-spin text-slate-300" size={32} />
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={scoreHistory}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                                <XAxis
                                    dataKey="uniqueIndex"
                                    tickFormatter={(val) => formatXAxis(val)}
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />

                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />

                                <Tooltip
                                    // ✅ FIX: Arrow function ensures 'label' is passed correctly to the formatter
                                    labelFormatter={(label) => formatXAxis(label)}
                                    contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />

                                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={4} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Chart 2: Activity */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Coding Streak</h3>
                        <p className="text-xs text-slate-500 font-medium">Daily Problems</p>
                    </div>
                    <div className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">Active</div>
                </div>

                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff' }} />
                            <Bar dataKey="problems" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}