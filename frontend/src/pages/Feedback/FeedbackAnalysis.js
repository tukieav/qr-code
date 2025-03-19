// src/pages/Feedback/FeedbackAnalysis.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import FeedbackList from '../../components/feedback/FeedbackList';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const FeedbackAnalysis = () => {
    const [feedback, setFeedback] = useState([]);
    const [stats, setStats] = useState({
        overall: { count: 0, averageRating: 0 },
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        dailyTrend: []
    });
    const [filters, setFilters] = useState({
        timeframe: 'month',
        startDate: '',
        endDate: '',
        minRating: '',
        maxRating: '',
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch feedback data with filters
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);

                // Build query params
                const queryParams = new URLSearchParams();
                queryParams.append('page', filters.page);
                queryParams.append('limit', filters.limit);

                if (filters.startDate && filters.endDate) {
                    queryParams.append('startDate', filters.startDate);
                    queryParams.append('endDate', filters.endDate);
                }

                if (filters.minRating && filters.maxRating) {
                    queryParams.append('minRating', filters.minRating);
                    queryParams.append('maxRating', filters.maxRating);
                }

                // Fetch feedback list
                const feedbackResponse = await api.get(`/feedback?${queryParams}`);

                setFeedback(feedbackResponse.data.data);
                setPagination({
                    page: feedbackResponse.data.pagination.page,
                    limit: feedbackResponse.data.pagination.limit,
                    totalPages: feedbackResponse.data.pagination.totalPages,
                    total: feedbackResponse.data.total
                });

                // Fetch feedback statistics
                const statsParams = new URLSearchParams();
                statsParams.append('timeframe', filters.timeframe);

                if (filters.startDate && filters.endDate && filters.timeframe === 'custom') {
                    statsParams.append('startDate', filters.startDate);
                    statsParams.append('endDate', filters.endDate);
                }

                const statsResponse = await api.get(`/feedback/stats?${statsParams}`);

                setStats(statsResponse.data.data);

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching feedback data');
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [filters]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters({
            ...filters,
            [name]: value,
            // Reset page when changing filters
            page: name !== 'page' ? 1 : value
        });
    };

    // Handle timeframe selection
    const handleTimeframeChange = (timeframe) => {
        // Reset custom dates if not selecting custom
        if (timeframe !== 'custom') {
            setFilters({
                ...filters,
                timeframe,
                startDate: '',
                endDate: '',
                page: 1
            });
        } else {
            setFilters({
                ...filters,
                timeframe,
                page: 1
            });
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;

        setFilters({
            ...filters,
            page: newPage
        });
    };

    // Prepare data for rating distribution chart
    const distributionData = {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [
            {
                label: 'Rating Distribution',
                data: [
                    stats.ratingDistribution['1'] || 0,
                    stats.ratingDistribution['2'] || 0,
                    stats.ratingDistribution['3'] || 0,
                    stats.ratingDistribution['4'] || 0,
                    stats.ratingDistribution['5'] || 0
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Prepare data for feedback trend chart
    const trendData = {
        labels: stats.dailyTrend.map(item => item._id),
        datasets: [
            {
                label: 'Feedback Count',
                data: stats.dailyTrend.map(item => item.count),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
            {
                label: 'Average Rating',
                data: stats.dailyTrend.map(item => item.averageRating),
                fill: false,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                yAxisID: 'y1',
            }
        ],
    };

    if (loading && feedback.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading feedback data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar title="Feedback Analysis" />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">Feedback Analysis</h1>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Feedback Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-medium text-gray-800 mb-2">Total Feedback</h2>
                            <p className="text-3xl font-bold">{stats.overall.count}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-medium text-gray-800 mb-2">Average Rating</h2>
                            <div className="flex items-center">
                                <p className="text-3xl font-bold mr-2">
                                    {stats.overall.averageRating ? stats.overall.averageRating.toFixed(1) : 0}
                                </p>
                                <div className="text-yellow-400 text-xl">★</div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-medium text-gray-800 mb-2">Feedback Rate</h2>
                            <p className="text-3xl font-bold">
                                {stats.dailyTrend.length > 0
                                    ? `${(stats.overall.count / stats.dailyTrend.length).toFixed(1)}/day`
                                    : '0/day'}
                            </p>
                        </div>
                    </div>

                    {/* Time Range Filter */}
                    <div className="bg-white p-6 rounded-lg shadow mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter by Time Range</h2>

                        <div className="flex flex-wrap gap-3 mb-4">
                            <button
                                onClick={() => handleTimeframeChange('today')}
                                className={`px-4 py-2 rounded-md ${
                                    filters.timeframe === 'today'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Today
                            </button>

                            <button
                                onClick={() => handleTimeframeChange('week')}
                                className={`px-4 py-2 rounded-md ${
                                    filters.timeframe === 'week'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Last 7 Days
                            </button>

                            <button
                                onClick={() => handleTimeframeChange('month')}
                                className={`px-4 py-2 rounded-md ${
                                    filters.timeframe === 'month'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Last 30 Days
                            </button>

                            <button
                                onClick={() => handleTimeframeChange('all')}
                                className={`px-4 py-2 rounded-md ${
                                    filters.timeframe === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                All Time
                            </button>

                            <button
                                onClick={() => handleTimeframeChange('custom')}
                                className={`px-4 py-2 rounded-md ${
                                    filters.timeframe === 'custom'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                Custom Range
                            </button>
                        </div>

                        {/* Custom date range inputs */}
                        {filters.timeframe === 'custom' && (
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            // Apply filter only if both dates are selected
                                            if (filters.startDate && filters.endDate) {
                                                setFilters({
                                                    ...filters,
                                                    page: 1
                                                });
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        disabled={!filters.startDate || !filters.endDate}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Rating filter */}
                        <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Filter by Rating</h3>

                            <div className="flex flex-wrap gap-4">
                                <div>
                                    <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 mb-1">
                                        Min Rating
                                    </label>
                                    <select
                                        id="minRating"
                                        name="minRating"
                                        value={filters.minRating}
                                        onChange={handleFilterChange}
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Any</option>
                                        <option value="1">1 ★</option>
                                        <option value="2">2 ★</option>
                                        <option value="3">3 ★</option>
                                        <option value="4">4 ★</option>
                                        <option value="5">5 ★</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="maxRating" className="block text-sm font-medium text-gray-700 mb-1">
                                        Max Rating
                                    </label>
                                    <select
                                        id="maxRating"
                                        name="maxRating"
                                        value={filters.maxRating}
                                        onChange={handleFilterChange}
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Any</option>
                                        <option value="1">1 ★</option>
                                        <option value="2">2 ★</option>
                                        <option value="3">3 ★</option>
                                        <option value="4">4 ★</option>
                                        <option value="5">5 ★</option>
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            setFilters({
                                                ...filters,
                                                page: 1
                                            });
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Trend chart */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback Trend</h2>
                            <div className="h-64">
                                {stats.dailyTrend.length > 0 ? (
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
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <p className="text-gray-500">No data available for selected time range</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Distribution chart */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Rating Distribution</h2>
                            <div className="h-64">
                                {stats.overall.count > 0 ? (
                                    <Pie
                                        data={distributionData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <p className="text-gray-500">No ratings available for selected time range</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Feedback list */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback List</h2>

                        {feedback.length > 0 ? (
                            <>
                                <FeedbackList feedback={feedback} />

                                {/* Pagination */}
                                <div className="mt-6 flex justify-between items-center">
                                    <div className="text-gray-600">
                                        Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page === 1}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>

                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page === pagination.totalPages}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No feedback available for the selected filters.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FeedbackAnalysis;