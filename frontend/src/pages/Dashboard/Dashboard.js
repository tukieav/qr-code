// src/pages/Dashboard/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import DashboardStats from '../../components/dashboard/DashboardStats';
import RecentFeedback from '../../components/dashboard/RecentFeedback';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalSurveys: 0,
        totalQRCodes: 0,
        totalFeedback: 0,
        averageRating: 0
    });
    const [recentFeedback, setRecentFeedback] = useState([]);
    const [dailyTrend, setDailyTrend] = useState([]);
    const [ratingDistribution, setRatingDistribution] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch surveys count
                const surveysResponse = await api.get('/surveys');
                const surveysCount = surveysResponse.data.count;

                // Fetch QR codes count
                const qrCodesResponse = await api.get('/qrcodes');
                const qrCodesCount = qrCodesResponse.data.count;

                // Fetch recent feedback
                const feedbackResponse = await api.get('/feedback?limit=5');
                const recentFeedback = feedbackResponse.data.data;

                // Fetch feedback statistics
                const statsResponse = await api.get('/feedback/stats?timeframe=month');
                const feedbackStats = statsResponse.data.data;

                setStats({
                    totalSurveys: surveysCount,
                    totalQRCodes: qrCodesCount,
                    totalFeedback: feedbackStats.overall.count || 0,
                    averageRating: feedbackStats.overall.averageRating ?
                        feedbackStats.overall.averageRating.toFixed(1) : 0
                });

                setRecentFeedback(recentFeedback);
                setDailyTrend(feedbackStats.dailyTrend || []);
                setRatingDistribution(feedbackStats.ratingDistribution || {});

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Prepare data for daily trend chart
    const trendData = {
        labels: dailyTrend.map(item => item._id),
        datasets: [
            {
                label: 'Feedback Count',
                data: dailyTrend.map(item => item.count),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
            {
                label: 'Average Rating',
                data: dailyTrend.map(item => item.averageRating),
                fill: false,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                yAxisID: 'y1',
            }
        ],
    };

    // Prepare data for rating distribution chart
    const distributionData = {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [
            {
                label: 'Rating Distribution',
                data: [
                    ratingDistribution['1'] || 0,
                    ratingDistribution['2'] || 0,
                    ratingDistribution['3'] || 0,
                    ratingDistribution['4'] || 0,
                    ratingDistribution['5'] || 0
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar title="Dashboard" />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Stats overview */}
                    <DashboardStats stats={stats} />

                    {/* Charts section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Daily trend chart */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback Trend (Last 30 Days)</h2>
                            <div className="h-64">
                                <Line
                                    data={trendData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: 'Feedback Count'
                                                }
                                            },
                                            y1: {
                                                beginAtZero: true,
                                                position: 'right',
                                                min: 0,
                                                max: 5,
                                                title: {
                                                    display: true,
                                                    text: 'Average Rating'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Rating distribution chart */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Rating Distribution</h2>
                            <div className="h-64">
                                <Bar
                                    data={distributionData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recent feedback section */}
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Feedback</h2>
                        <RecentFeedback feedback={recentFeedback} />

                        <div className="mt-4">
                            <button
                                onClick={() => navigate('/feedback')}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                View all feedback →
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;