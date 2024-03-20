import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './screens/login/Login';
import Register from './screens/register/Register';
import Profile from './screens/profile/Profile';
import Leaderboard from './screens/leaderboard/Leaderboard';
import Settings from './screens/settings/Settings';
import UserPic from './screens/settings/userPic/UserPic';
import Users from './screens/users/Users';

import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import InGame from './screens/game/inGame/InGame';
import CreateRoom from './screens/game/createRoom/CreateRoom';

export default function App() {

	const [myUid, setMyUid] = useState("");
	const [username, setUsername] = useState("");

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user.uid) {
				setMyUid(user.uid);
			}
		});
	}, [myUid]);

	useEffect(() => {
		if (myUid !== "") {
			const userData = async () => {
				const userDocData = await getDoc(doc(db, `user/${myUid}`));
				setUsername(userDocData.data().nome);
				console.log(username);
			}	
			userData();
		}
	}, []);

	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/profile/" element={<Profile />} />
					<Route path="/profile/settings/userPic" element={<UserPic />} />
					<Route path="/profile/:id" element={<Profile />} />
					<Route path="/leaderboard" element={<Leaderboard />} />
					<Route path="/users" element={<Users />} />
					<Route path="/game/create" element={<CreateRoom />} />
					<Route path="/game/create" element={<InGame />} />

					{/* <Route path="/profile/settings" element={<Settings />} />
					<Route path="/profile/settings/userPic" element={<userPic />} /> */}
				</Routes>
			</Router>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
		</>
	);
}