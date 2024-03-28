import toast, { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from './screens/login/Login';
import Register from './screens/register/Register';
import Profile from './screens/profile/Profile';
import Leaderboard from './screens/leaderboard/Leaderboard';
import Settings from './screens/settings/Settings';
import UserPic from './screens/settings/userPic/UserPic';
import Users from './screens/users/Users';
import InGame from './screens/game/inGame/InGame';
import Room from './screens/game/room/Room';
import CreateRoom from './screens/game/room/createRoom/CreateRoom';
import JoinRoom from './screens/game/room/joinRoom/JoinRoom';

export default function App() {
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
					<Route path="/room" element={<Room />} />
					<Route path="/room/:roomID" element={<JoinRoom />} />
					<Route path="/room/create" element={<CreateRoom />} />
					<Route path="/room/join" element={<JoinRoom />} />
					<Route path="/game" element={<InGame />} />
				</Routes>
			</Router>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
		</>
	);
}