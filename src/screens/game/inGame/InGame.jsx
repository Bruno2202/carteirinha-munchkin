import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./style.module.css";
import MiniUser from "../../../components/miniUser/MiniUser";
import BackHeader from '../../../components/backHeader/BackHeader';
import PlayerAttributes from '../../../components/modal/playerAttributes/PlayerAttributes';
import toast from 'react-hot-toast';

export default function InGame() {
	const [roomData, setRoomData] = useState("");
	const [players, setPlayers] = useState([]);
	const [myUid, setMyUid] = useState("");
	const [myData, setMyData] = useState(null);
	const [modalIsVisible, setModalIsVisible] = useState(false);
	const [playerUid, setPlayerUid] = useState("");
	const [finish, setFinish] = useState(false);

	const { roomID } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		onAuthStateChanged((auth), user => {
			setMyUid(user.uid);
		});
	}, []);

	useEffect(() => {
		const playersCollection = collection(db, `room/${roomID}/jogadores`);
		const refreshPlayerData = onSnapshot(playersCollection, () => {
			getPlayers();
		});
		return () => {
			refreshPlayerData();
		};
	}, [myUid]);


	useEffect(() => {
		const roomDocRef = doc(db, `room/${roomID}`);
		const refreshRoomData = onSnapshot(roomDocRef, (docSnapshot) => {
			if (docSnapshot.exists()) {
				getRoomData();
			} else {
				navigate("/profile");
			}
		});

		return () => refreshRoomData();
	}, [roomID]);


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
			getRoomData();
			getPlayers();
		}
	}, [roomID]);

	async function getRoomData() {
		try {
			const roomDocData = await getDoc(doc(db, `room/${roomID}`));
			setRoomData(roomDocData.data());
		} catch (error) {
			console.log(`Erro ao buscar dados da sala: ${error}`);
		}
	}

	async function getPlayers() {
		try {
			const playerQuerySnapshot = await getDocs(collection(db, `room/${roomID}/jogadores`));
			const data = playerQuerySnapshot.docs.map((doc) => (doc.data()));
			var winnerFound = false
			data.map((player) => {
				if (player.nivel == 10) {
					setFinish(!finish);
					winnerFound = true;
				}
			});
			if (!winnerFound) {
				setFinish(false);
			}
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

	function promiseEndGame() {
		toast.promise(
			endGame(),
			{
				loading: 'Encerrando partida...',
				success: <b>Partida finalizada!</b>,
				error: (error) => <b>{error.message}</b>,
			}
		);
	}

	async function endGame() {
		if (finish) {
			setFinish(false);
			if (roomData.uid_batalha !== "") {
				setFinish(true);
				throw new Error("Há jogadores batalhando");
			} else if (myData.admin_sala) {
				var winnerCount = 0, winnerUid = "";
				players.map((player) => {
					if (player.nivel == 10) {
						winnerCount++;
						winnerUid = player.uid;
					};
				});
				if (winnerCount > 1) {
					setFinish(true);
					throw new Error("Há mais de um jogadores com nível 10");
				} else {
					try {
						const matchesCollection = collection(db, "match_history");
						const roomDocRef = doc(db, `room/${roomID}`);

						await Promise.all([
							updateDoc(roomDocRef, { jogando: false, dt_fim: new Date, uid_ganhador: winnerUid }),
						]);

						const roomSnapshot = await getDoc(roomDocRef);

						if (roomSnapshot.exists()) {
							await setDoc(doc(matchesCollection, roomSnapshot.id), roomSnapshot.data());

							await Promise.all(players.map(async (player) => {
								const playersCollection = collection(db, `match_history/${roomID}/jogadores`);
								setDoc(doc(playersCollection, player.uid), player);

								const playerProfileDocRef = doc(db, `user/${player.uid}`);
								const playerSnapshot = await getDoc(playerProfileDocRef);

								var victories = playerSnapshot.data().vitorias;
								var defeats = playerSnapshot.data().derrotas;

								if (player.uid == winnerUid) {
									await updateDoc(playerProfileDocRef, { vitorias: victories + 1 })
									victories = victories + 1
								} else {
									await updateDoc(playerProfileDocRef, { derrotas: defeats + 1 });
									defeats = defeats + 1
								}
								if (player.admin_sala) {
									await updateDoc(playerProfileDocRef, { admin_sala: false });
								}
								await updateDoc(playerProfileDocRef, { jogando: false });
								await updateDoc(playerProfileDocRef, { sala: "" });
								await updateDoc(playerProfileDocRef, { rating: parseInt((victories * 100) / (victories + defeats)) });

								await deleteDoc(doc(db, `room/${roomID}/jogadores/${player.uid}`));
							}));

							await deleteDoc(roomDocRef);
							navigate("/profile");
						} else {
							setFinish(true);
							console.log("A sala não foi encontrada");
						}
					} catch (error) {
						setFinish(true);
						console.log(`Erro ao finalizar a partida: ${error}`);
						throw new Error("Não foi possível finalizar a partida");
					}
				}
			} else {
				setFinish(true);
				throw new Error("Apenas o administrador da sala pode finalizar a partida");
			}
		} else {
			throw new Error("Nenhum jogador alcançou o nível 10");
		}
	}

	return (
		<>
			<PlayerAttributes
				modalIsVisible={modalIsVisible}
				setModalIsVisible={setModalIsVisible}
				playerUid={playerUid}
				roomID={roomID}
				battleUid={roomData.uid_batalha}
			/>
			<div className={styles.container}>
				<BackHeader to={"/profile"} backgroundColor={"#0D1117"} title={roomData.nome}>
					<svg onClick={() => promiseEndGame()} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={finish ? "#55DB5E" : '#475C47'}>
						<path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
					</svg>
				</BackHeader>
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
							items={player.equipamento}
							userPic={player.picURL}
							name={player.nome}
						/>
					))}
				</div>
			</div>
		</>
	);
}