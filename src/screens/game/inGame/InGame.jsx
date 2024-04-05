import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./style.module.css";
import MiniUser from "../../../components/miniUser/MiniUser";
import BackHeader from '../../../components/backHeader/BackHeader';
import Button from "../../../components/button/Button";
import PlayerAttributes from '../../../components/modal/playerAttributes/PlayerAttributes';
import toast from 'react-hot-toast';

export default function InGame() {

	const [roomData, setRoomData] = useState("");
	const [players, setPlayers] = useState([]);
	const [myUid, setMyUid] = useState("");
	const [myData, setMyData] = useState(null);
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [playerUid, setPlayerUid] = useState("");

	const { roomID } = useParams();

	useEffect(() => {
		onAuthStateChanged((auth), user => {
			setMyUid(user.uid);
		});
	}, []);

	useEffect(() => {
		const playerDocRef = collection(db, `room/${roomID}/jogadores`);
		const refreshPlayerData = onSnapshot(playerDocRef, () => {
			getPlayers();
		});
		return () => {
			refreshPlayerData();
		};
	}, [myUid]);

	useEffect(() => {
		if (myUid !== "") {
			const getMyData = async () => {
				try {
					const data = await getDoc(doc(db, `room/${roomID}/jogadores/${myUid}`));
					setMyData(data.data());
				} catch (error) {
					console.log(`Não possível obter seus dados de usuário: ${error}`);
				}
			}
			getMyData();
		}
	}, [myUid]);

	useEffect(() => {
		if (roomID !== null || roomID !== undefined || roomID !== "") {
			const getRoomData = async () => {
				try {
					const roomDocData = await getDoc(doc(db, `room/${roomID}`));
					setRoomData(roomDocData.data());
				} catch (error) {
					console.log(`Erro ao buscar dados da sala: ${error}`);
				}
			}
			getRoomData();
			getPlayers();
		}
	}, [roomID]);


	async function getPlayers() {
		try {
			const playerQuerySnapshot = await getDocs(collection(db, `room/${roomID}/jogadores`));
			const data = playerQuerySnapshot.docs.map((doc) => doc.data());
			setPlayers(data);
		} catch (error) {
			console.log(`Erro ao buscar usuários: ${error}`);
		}
	}

	function openPlayerAttributes(uid) {
		if (myData.admin_sala || myData.uid == uid) {
			setModalIsVisible(true);
			setPlayerUid(uid);
		} else {
			toast.error("Apenas o administrador da sala pode alterar os dados dos outros usuários")
		}
	}


	return (
		<>
			<PlayerAttributes
				modalIsVisible={modalIsVisible}
				setModalIsVisible={setModalIsVisible}
				playerUid={playerUid}
				roomID={roomID}
			/>
			<div className={styles.container}>
				<BackHeader to={"/profile"} backgroundColor={"#0D1117"} title={roomData.nome} />
				<div className={styles.interface}>
					{players.map((player) => (
						<MiniUser
							onClick={() => openPlayerAttributes(player.uid)}
							key={player.uid}
							placeColor={"#44445B"}
							type={3}
							showLeaderPlace={false}
							showStrength={true}
							defeats={false}
							level={player.nivel}
							itens={player.equipamento}
							userPic={player.picURL}
							name={player.nome}
						/>
					))}
				</div>
			</div>
		</>
	);
}