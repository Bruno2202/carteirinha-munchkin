import React, { cloneElement, useEffect, useState } from 'react'
import { Link, useNavigate, } from 'react-router-dom';

import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./style.module.css";
import BackHeader from '../../../../components/backHeader/BackHeader';
import MiniRoom from '../../../../components/miniRoom/MiniRoom';
import MiniUser from '../../../../components/miniUser/MiniUser';
import toast from 'react-hot-toast';
import Button from '../../../../components/button/Button';

export default function JoinRoom() {
    const [data, setData] = useState([]);
    const [inRoom, setInRoom] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [roomData, setRoomData] = useState(null);
    const [myUid, setMyUid] = useState("");
    const [players, setPlayers] = useState([]);
    const [userData, setUserData] = useState(null);
    const [roomAdmin, setRoomAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged((auth), user => {
            setMyUid(user.uid);
        })
    }, []);

    useEffect(() => {
        if (myUid !== "") {
            searchRooms();
            const userDocRef = async () => {
                const data = await getDoc(doc(db, `user/${myUid}`));
                setUserData(data.data());
            }
            userDocRef();
        }
    }, [myUid]);

    useEffect(() => {
        if (roomId !== "") {
            getRoomData();
        }
    }, [roomId]);

    useEffect(() => {
        if (roomData && roomData.jogando) {
            navigate(`/game/${roomId}`);
            if (!roomAdmin) {
                toast.success("Jogo iniciado!")
            }
        }
    }, [roomData]);

    useEffect(() => {
        const updateRoom = async () => {
            if (inRoom) {
                showPlayers();

                const roomsCollectionRef = doc(db, `room/${roomId}`);
                const updateRoomData = onSnapshot(roomsCollectionRef, () => {
                    getRoomData();
                });

                const playersCollectionRef = collection(db, `room/${roomId}/jogadores`);
                const updatePlayersOnRoom = onSnapshot(playersCollectionRef, () => {
                    showPlayers();
                });
                return () => {
                    updatePlayersOnRoom();
                    updateRoomData();
                };
            } else {
                searchRooms();

                const roomsCollectionRef = collection(db, `room`);
                const updateRoomsAvailable = onSnapshot(roomsCollectionRef, () => {
                    searchRooms();
                });
                return () => {
                    updateRoomsAvailable();
                };
            }
        }
        updateRoom();
    }, [inRoom]);


    async function getRoomData() {
        const data = await getDoc(doc(db, `room/${roomId}`));
        setRoomData(data.data());
    }

    async function searchRooms() {
        const querySnapshot = await getDocs(collection(db, "room"));
        const roomData = querySnapshot.docs.map(doc => doc.data());
        if (roomData.length < 1) {
            setData([]);
        } else {
            setData(roomData);
        }
    }

    async function joinRoom(roomID, playing) {
        if (userData.admin_sala && roomID == userData.sala) {
            setRoomAdmin(true);
        }
        if (userData.admin_sala && roomID !== userData.sala) {
            toast.error("Você já possui uma sala");
        } else if (userData.jogando == true) {
            toast.error("Você está em uma partida");
        } else if (playing) {
            if (userData.sala == roomID) {
                navigate(`/game/${roomID}`, { roomID: roomID });
            } else {
                toast.error("A partida já foi iniciada");
            }
        } else {
            navigate(`/room/${roomID}`);

            const roomDocRef = doc(db, `room/${roomID}`);
            const userDocRef = doc(db, `user/${myUid}`);

            const roomQuerySnapshot = await getDoc(roomDocRef);
            const userDataNow = await getDoc(userDocRef);

            if (userDataNow.data().sala !== roomID) {
                await updateDoc(roomDocRef, { num_jogadores: roomQuerySnapshot.data().num_jogadores + 1 });
                await updateDoc(userDocRef, { sala: roomID });


                const playersDocRef = doc(db, `room/${roomID}/jogadores`, myUid);
                const playerData = {
                    uid: myUid,
                    nome: userData.nome,
                    picURL: userData.picURL,
                    nivel: 1,
                    equipamento: 0,
                    modificador: 0,
                    admin_sala: false
                }
                await setDoc(playersDocRef, playerData);
            }


            setRoomId(roomID);
            setInRoom(!inRoom);
        }
    }

    async function showPlayers() {
        const querySnapshot = await getDocs(collection(db, `room/${roomId}/jogadores`));
        const playerData = querySnapshot.docs.map((doc) => doc.data());
        setPlayers(playerData);
    }

    async function deleteRoom(roomID) {
        try {
            const roomDocRef = doc(db, `room/${roomID}`);
            const roomData = await getDoc(roomDocRef)

            const playersQuerySnapshot = await getDocs(collection(db, `room/${roomID}/jogadores`));
            const players = playersQuerySnapshot.docs.map((doc) => doc.data().uid);

            players.forEach(async (uid) => {
                if (uid == roomData.data().uid_criador) {
                    const adminDocRef = doc(db, `user/${uid}`);
                    await updateDoc(adminDocRef, { admin_sala: false });
                }
                const playerDocRef = doc(db, `user/${uid}`);
                await updateDoc(playerDocRef, { sala: "" });
                deleteDoc(doc(db, `room/${roomID}/jogadores/${uid}`));
            })

            await deleteDoc(roomDocRef);
            toast.success("Sala excluida com sucesso!");
            navigate("/profile");
        } catch (error) {
            toast.error("Erro ao excluir sala");
            console.log(`Não foi possível excluir sala: ${error}`);
        }
    }

    async function exitRoom(roomID) {
        try {
            const playerDocRef = doc(db, `user/${myUid}`);
            const roomDocRef = doc(db, `room/${roomID}`);
            const roomDocData = await getDoc(roomDocRef);

            await updateDoc(playerDocRef, { sala: "" });
            await updateDoc(roomDocRef, { num_jogadores: roomDocData.data().num_jogadores - 1 })
            deleteDoc(doc(db, `room/${roomID}/jogadores/${myUid}`));
            resetRoomData();

            toast("Você saiu da sala");
            navigate("/room/join");
        } catch (error) {
            toast.error("Não foi possível sair da sala");
            console.log(`Erro ao sair da sala: ${error}`);
        }
    }

    function resetRoomData() {
        setRoomId("");
        setRoomData(null);
        setInRoom(!inRoom);
    }

    function promiseStartGame(roomID) {
        toast.promise(
            startGame(roomID),
            {
                loading: 'Inciando jogo...',
                success: <b>Jogo iniciado!</b>,
                error: <b>Não foi possível iniciar jogo</b>,
            }
        );
    }

    async function startGame(roomID) {
        try {
            const roomDocRef = doc(db, `room/${roomID}`);
            // await updateDoc(roomDocRef, { dt_fim: new Date });
            await updateDoc(roomDocRef, { jogando: true });

            const updatePlayersStatus = async () => {
                const playersQuerySnapshoit = await getDocs(collection(db, `room/${roomID}/jogadores`));
                var players = playersQuerySnapshoit.docs.map((doc) => doc.data().uid);
                players.map(async (uid) => {
                    const playerDocRef = doc(db, `user/${uid}`);
                    // await updateDoc(playerDocRef, { jogando: true });
                });
                navigate(`/game/${roomID}`);
            }
            updatePlayersStatus();
        } catch (error) {
            console.log(`Erro ao iniciar jogo: ${error}`);
        }
    }

    return (
        <div className={styles.container}>
            {!inRoom ? (
                <>
                    <BackHeader to={"/room"} title={"ENTRAR EM SALA"} backgroundColor={"#0D1117"} />
                    <div className={styles.rooms}>
                        {data.length < 1 ? (
                            <p className={styles.text}>Não há salas disponíveis no momento</p>
                        ) : (
                            data.map((room) => (
                                <div key={room.roomID} onClick={() => joinRoom(room.roomID, room.jogando)}>
                                    <MiniRoom
                                        roomName={room.nome}
                                        roomPic={room.roomPic}
                                    />
                                </div>
                            )
                            ))}
                    </div>
                </>
            ) : (
                <>
                    <BackHeader backgroundColor={"#0D1117"} to={"/room/join"} title={roomData && roomData.nome} onClick={() => resetRoomData()}>
                        {!roomAdmin && (
                            <div onClick={() => exitRoom(roomId)}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28" fill='#B2283A'>
                                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                                </svg>
                            </div>
                        )}
                    </BackHeader>
                    <div className={styles.room}>
                        {roomAdmin && (
                            <div className={styles.options}>
                                <Button text={"Excluir sala"} backgroundColor={"#B2283A"} color={"#FFFFFF"} onClick={() => deleteRoom(roomId)} />
                                <Button text={"Iniciar partida"} backgroundColor={"#55DB5E"} color={"#FFFFFF"} onClick={() => promiseStartGame(roomId)} />
                            </div>
                        )}
                        <p className={styles.text}>Aguardando jogadores...</p>
                        {players.map((player) => (
                            <MiniUser
                                key={player.uid}
                                name={player.nome}
                                userPic={player.picURL}
                                type={1}
                                showLeaderPlace={false}
                                showLeaderVictories={false}
                                placeColor={"#44445B"}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
