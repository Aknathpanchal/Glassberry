import { useState } from 'react';

const SearchAndFilter = ({ tasks, setTasks }) => {
    const [filters, setFilters] = useState({ name: '', location: '', minPrice: '', maxPrice: '', type: '' });
    const [types] = useState(['Residential', 'Commercial']); // Fixed property types
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const escapeRegExp = (str) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError(null);

        const hasFilters = Object.values(filters).some((filter) => filter !== '');
    
        if (!hasFilters) {
            setLoading(false); // Stop loading if no filters are applied
            return;
        }

        // Build the query string based on non-empty filter fields
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                queryParams.append(key, key === 'name' || key === 'location' ? escapeRegExp(value) : value);
            }
        }

        fetch(`https://backend-navy-one-38.vercel.app/shree/task?${queryParams.toString()}`) // Ensure this matches your backend endpoint
            .then(response => response.json())
            .then(data => {
                setTasks(data);
            })
            .catch(error => {
                setError('Error fetching tasks.');
                console.error('Error fetching tasks:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="p-2 mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-6">
                <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Search by name"
                    className="flex-1 p-2 w-[150px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Search by location"
                    className="flex-1 p-2 w-[150px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min Price"
                    className="w-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max Price"
                    className="w-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-[120px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Types</option>
                    {types.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="w-full sm:w-auto p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {loading ? 'Loading...' : 'Apply'}
                </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default SearchAndFilter;
