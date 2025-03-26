import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, BarChart2, TreePine, Settings, Globe2 } from 'lucide-react';

const Sidebar = () => {
	const navItems = [
		{ name: 'Overview', icon: LayoutDashboard, path: '/', color: 'text-blue-500' },
		{ name: 'Top Companies', icon: Building2, path: '/top-companies', color: 'text-green-500' },
		{ name: 'Environmental Impact', icon: TreePine, path: '/environmental-impact', color: 'text-emerald-500' },
		{ name: 'Get Insights', icon: BarChart2, path: '/analytics', color: 'text-purple-500' },
		{ name: 'Map Companies', icon: Globe2, path: '/maps', color: 'text-orange-500' },
		{ name: 'Settings', icon: Settings, path: '/settings', color: 'text-gray-400' },
	];

	return (
		<div className="bg-black text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
			<div className="flex flex-col items-center space-y-2 mb-8">
				<div className="w-20 h-20 rounded-full bg-gradient-to-br from-black via-purple-950/30 to-black flex items-center justify-center">
					<span className="text-3xl font-bold">ESG</span>
				</div>
				<h1 className="text-2xl font-bold text-center">ESG Analytics</h1>
			</div>
			<nav className="space-y-2">
				{navItems.map((item) => (
					<NavLink
						key={item.name}
						to={item.path}
						className={({ isActive }) =>
							`flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ${
								isActive 
									? `bg-black/50 border border-${item.color.replace('text-', '')} text-white` 
									: 'text-gray-400 hover:bg-black hover:text-white'
							}`
						}
					>
						<item.icon className={`h-6 w-6 ${item.color}`} />
						<span className="font-medium">{item.name}</span>
					</NavLink>
				))}
			</nav>
		</div>
	);
};

export default Sidebar;
