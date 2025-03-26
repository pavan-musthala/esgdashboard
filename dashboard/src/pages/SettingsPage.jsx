import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/common/Header";
import ConnectedAccounts from "../components/settings/ConnectedAccounts";
import DangerZone from "../components/settings/DangerZone";
import Notifications from "../components/settings/Notifications";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";

const SettingsPage = () => {
	const navigate = useNavigate();

	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gradient-to-br from-black via-purple-950/30 to-black'>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8 space-y-6'>
				<div className="bg-black/50 rounded-xl border border-purple-900/20 p-6">
					<Profile />
				</div>
				<div className="bg-black/50 rounded-xl border border-purple-900/20 p-6">
					<Notifications />
				</div>
				<div className="bg-black/50 rounded-xl border border-purple-900/20 p-6">
					<Security />
				</div>
				<div className="bg-black/50 rounded-xl border border-purple-900/20 p-6">
					<ConnectedAccounts />
				</div>
				<div className="bg-black/50 rounded-xl border border-purple-900/20 p-6">
					<DangerZone />
				</div>
			</main>
		</div>
	);
};

export default SettingsPage;
