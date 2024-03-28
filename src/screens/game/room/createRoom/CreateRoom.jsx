import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { db, auth } from "../../../../config/firebaseConfig";
import { Firestore, addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./style.module.css";
import BackHeader from '../../../../components/backHaeder/BackHeader';
import Button from '../../../../components/button/Button';

export default function CreateRoom() {
    const [myUid, setMyUid] = useState("");
    const [roomName, setRoomName] = useState("");
    const [waitingMatchIsVisible, setWaitingMatchIsVisible] = useState(false);
    const [userData, setUserData] = useState("");

    useEffect(() => {
        onAuthStateChanged((auth), user => {
            setMyUid(user.uid);
        })
    }, []);

    useEffect(() => {
        if (myUid !== "") {
            const userDocRef = async () => {
                const data = await getDoc(doc(db, `user/${myUid}`));
                setUserData(data.data());
            }
            userDocRef();
        }
    }, [myUid]);

    async function createRoom() {
        if (!roomName) {
            toast.error("A sala não possui nome");
        } else {
            const collectionRef = collection(db, "room");

            const roomData = {
                roomID: "",
                nome: roomName,
                uid_criador: myUid,
                dt_criacao: new Date(),
                num_jogadores: 1,
                roomPic: userData.picURL ? userData.picURL : require('../../../../assets/img/userPic.png')
            }

            try {
                const room = await addDoc(collectionRef, roomData);
                const roomDocRef = doc(db, `room/${room.id}`);
                await updateDoc(roomDocRef, { roomID: room.id });

                try {
                    const parentDocRef = doc(db, `room/${room.id}/jogadores`, myUid);

                    const playerData = {
                        uid: myUid,
                        nome: userData.nome,
                        picURL: userData.picURL,
                        nivel: 1,
                        equipamento: 0,
                        modificador: 0
                    }

                    await setDoc(parentDocRef, playerData);
                    
                    toast.success("Sala criada com sucesso");
                    setWaitingMatchIsVisible(!waitingMatchIsVisible);
                } catch (error) {
                    console.log(`Erro ao criar sala: ${error}`);
                }
            } catch (error) {
                toast.error("Não foi possível criar sala");
                console.log(error);
            }
        }
    }

    return (
        <div className={styles.container}>
            <BackHeader title={"CRIAR SALA"} backgroundColor={"#0D1117"} />
            {!waitingMatchIsVisible &&
                <div className={styles.createRoom}>
                    <p>Nome da sala: </p>
                    <input maxLength={16} placeholder='Sala do magos' onChange={(e) => setRoomName(e.target.value)} />
                    <Button text={"Criar sala"} onClick={() => createRoom()} />
                </div>
            }
            {waitingMatchIsVisible &&
                <div className={styles.waitingMatch}>
                    <h1 className={styles.roomName}>{roomName}</h1>
                    <p>Aguardando jogadores...</p>
                    <div>

                    </div>
                </div>
            }
        </div>

    );
}