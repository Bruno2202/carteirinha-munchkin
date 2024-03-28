import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./style.module.css";
import BackHeader from '../../../../components/backHaeder/BackHeader';
import MiniRoom from '../../../../components/miniRoom/MiniRoom';

export default function JoinRoom() {
    const [data, setData] = useState([]);
    const [inRoom, setInRoom] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [roomData, setRoomData] = useState(null);
    const [myUid, setMyUid] = useState("");

    useEffect(() => {
        onAuthStateChanged((auth), user => {
            setMyUid(user.uid);
        })
    }, []);

    useEffect(() => {
        if (myUid !== "") {
            searchRooms();
        }
    }, [myUid]);

    useEffect(() => {
        if (roomId !== "") {
            const getRoomData = async () => {
                const data = await getDoc(doc(db, `room/${roomId}`));
                setRoomData(data.data());
            }
            getRoomData();
        }
    }, [roomId]);

    async function searchRooms() {
        const querySnapshot = await getDocs(collection(db, "room"));
        const roomData = querySnapshot.docs.map(doc => doc.data());
        setData(roomData);
    }

    async function setRoom(id) {
        const roomDocRef = doc(db, `room/${id}`);
        const userDocRef = doc(db, `user/${myUid}`);

        const roomQuerySnapshot = await getDoc(roomDocRef);
        const userQuerySnapshot = await getDoc(userDocRef);

        await updateDoc(roomDocRef, { num_jogadores: roomQuerySnapshot.data().num_jogadores + 1 });
        await updateDoc(userDocRef, { jogando: true });

        setRoomId(id);
        setInRoom(!inRoom);
    }

    function resetRoomData() {
        setRoomId("");
        setRoomData(null);
        setInRoom(!inRoom);
    }

    return (
        <div className={styles.container}>
            {!inRoom ? (
                <>
                    <BackHeader title={"ENTRAR EM SALA"} backgroundColor={"#0D1117"} />
                    <div className={styles.rooms}>
                        {data.map((room) => (
                            <Link to={`/room/${room.roomID}`} key={room.roomID} onClick={() => setRoom(room.roomID)}>
                                <MiniRoom
                                    roomName={room.nome}
                                    roomPic={room.roomPic}
                                />
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <BackHeader backgroundColor={"#0D1117"} to={"/room/join"} title={roomData && roomData.nome} onClick={() => resetRoomData()} />
                    <div className={styles.room}>

                    </div>
                </>
            )}
        </div>
    );
}
