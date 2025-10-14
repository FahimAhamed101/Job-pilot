

import { Link } from 'react-router-dom';
import image1 from '../../assets/image/e22e8a1e2c5bb7a5825cd3213cb9cf6ab04731bb.png'
import React from 'react';

const CardHome = () => {
    const jobApplications = [
        { user: 'Eleanor Pena', jobTitle: 'Eleanor Pena', status: 'Accepted', date: 'Jul 28, 2025', email: 'kenzi.lawson@example.com' },
        { user: 'Kathryn Murphy', jobTitle: 'Kathryn Murphy', status: 'Rejected', date: 'Aug 15, 2025', email: 'tanya.hill@example.com' },
        { user: 'Darrell Steward', jobTitle: 'Darrell Steward', status: 'Pending', date: 'Sep 01, 2025', email: 'debra.holt@example.com' },
        { user: 'Leslie Alexander', jobTitle: 'Leslie Alexander', status: 'Accepted', date: 'Sep 01, 2025', email: 'curtis.weaver@example.com' },
        { user: 'Bessie Cooper', jobTitle: 'Bessie Cooper', status: 'Rejected', date: 'Sep 09, 2025', email: 'dolores.rgbd@example.com' },
    ];

    const statusStyles = {
        Accepted: { dot: 'bg-green-700', bg: 'bg-green-100', text: 'text-green-900' },
        Rejected: { dot: 'bg-red-700', bg: 'bg-red-100', text: 'text-red-900' },
        Pending: { dot: 'bg-yellow-600', bg: 'bg-yellow-100', text: 'text-yellow-900' },
    };

    return (
        <div className="w-full container mx-auto flex space-x-6">
            {/* Recent Job Applications Panel */}
            <div className="p-4 rounded-lg shadow-md w-1/2">
                <div className='mt-5'>
                    <h2 className="text-2xl font-semibold mb-2">Recent Job Applications</h2>
                    <p className="text-lg text-gray-600 mb-4">A list of the most recent job applications.</p>
                    <table className="w-full">
                        <thead className='bg-[#E6F6F0]'>
                            <tr className="text-left text-gray-600">
                                <th className="pb-2 px-2 font-bold">User</th>
                                <th className="pb-2 font-bold">Job Title</th>
                                <th className="pb-2 font-bold">Status</th>
                                <th className="pb-2 font-bold">Applied on</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobApplications.map((app, index) => (
                                <tr key={index} className="border-t">
                                    <td className="py-2 flex items-center">
                                        <img src={`https://i.pravatar.cc/40?img=${index + 1}`} alt={app.user} className="w-8 h-8 rounded-full mr-2" />
                                        {app.user}
                                    </td>
                                    <td className="py-2">
                                        <div className="flex items-center gap-2">
                                            <img src={image1} className="w-[30px] h-[30px] rounded-full" alt="job icon" />
                                            <span>{app.jobTitle}</span>
                                        </div>
                                    </td>
                                    <td className="py-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full ${statusStyles[app.status].bg}`}>
                                            <span className={`w-2 h-2 rounded-full ${statusStyles[app.status].dot} mr-2`}></span>
                                            <span className={statusStyles[app.status].text}>{app.status}</span>
                                        </span>
                                    </td>
                                    <td className="py-2">{app.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Link to="/applied" className="flex justify-end">
                        <div className='flex justify-end'>
                            <button className="mt-4 bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white px-4 py-2 rounded hover:bg-green-600">View All</button>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Latest User Panel */}
            <div className=" p-4 rounded-lg shadow-md w-1/2">
                <div className='mt-6'>
                    <h2 className="text-2xl font-semibold mb-2">Latest User</h2>
                    <p className="text-lg text-gray-600 mb-4">A list of the most recently registered users.</p>
                    <table className="w-full">
                        <thead className='bg-[#E6F6F0] p-5'>
                            <tr className="text-left text-gray-600">
                                <th className="pb-2 px-2 font-bold">Name</th>
                                <th className="pb-2 font-bold">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobApplications.map((app, index) => (
                                <tr key={index} className="border-t">
                                    <td className="py-2 flex items-center">
                                        <img src={`https://i.pravatar.cc/40?img=${index + 1}`} alt={app.user} className="w-8 h-8 rounded-full mr-2" />
                                        {app.user}
                                    </td>
                                    <td className="py-2">{app.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Link to="/users" className="flex justify-end">
                        <div className='flex justify-end'>
                            <button className="mt-4 bg-gradient-to-r from-[#059E68] to-[#C9F31D] text-white px-4 py-2 rounded hover:bg-green-600">View All</button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CardHome;