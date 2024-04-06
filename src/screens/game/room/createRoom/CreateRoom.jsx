import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { db, auth } from "../../../../config/firebaseConfig";
import { addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./style.module.css";
import BackHeader from '../../../../components/backHeader/BackHeader';
import Button from '../../../../components/button/Button';
import Input from "../../../../components/input/Input";

export default function CreateRoom() {
    const [myUid, setMyUid] = useState("");
    const [roomName, setRoomName] = useState("");
    const [userData, setUserData] = useState("");

    const navigate = useNavigate();

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


    function validateRoom() {
        if (!roomName) {
            toast.error("A sala não possui nome");
        } else if (userData.sala !== "") {
            if (userData.admin_sala) {
                toast.error("Você já possui uma sala");
            } else {
                toast.error("Você já está em uma sala");
            }
        } else {
            promiseCreateRoom();
        }
    }

    function promiseCreateRoom() {
        toast.promise(
            createRoom(),
            {
                loading: 'Criando sala...',
                success: <b>Sala criada com sucesso!</b>,
                error: <b>Não foi possível criar sala</b>,
            }
        );
    }

    async function createRoom() {
        const collectionRef = collection(db, "room");

        const roomData = {
            roomID: "",
            nome: roomName,
            uid_criador: myUid,
            dt_criacao: new Date(),
            dt_inicio: null,
            dt_fim: null,
            num_jogadores: 1,
            roomPic: userData.picURL ? userData.picURL : require('../../../../assets/img/userPic.png'),
            jogando: false,
            uid_batalha: "",
            uid_ganhador: ""
        }

        try {
            const room = await addDoc(collectionRef, roomData);

            const roomDocRef = doc(db, `room/${room.id}`);
            const userDocRef = doc(db, `user/${myUid}`);

            await updateDoc(roomDocRef, { roomID: room.id });
            await updateDoc(userDocRef, { sala: room.id });
            await updateDoc(userDocRef, { admin_sala: true });

            try {
                const parentDocRef = doc(db, `room/${room.id}/jogadores`, myUid);

                const playerData = {
                    uid: myUid,
                    nome: userData.nome,
                    picURL: userData.picURL,
                    nivel: 1,
                    equipamento: 0,
                    modificador: 0,
                    admin_sala: true,
                    batalhando: false
                }

                await setDoc(parentDocRef, playerData);

                navigate("/room/join");
            } catch (error) {
                console.log(`Erro ao criar sala: ${error}`);
            }
        } catch (error) {
            console.log(`Erro ao criar sala: ${error}`);
        }
    }

    return (
        <div className={styles.container}>
            <BackHeader title={"CRIAR SALA"} backgroundColor={"#0D1117"} />
            <div className={styles.createRoom}>
                <Input style={2} maxLength={24} placeholder={`Sala dos magos`} setValue={setRoomName} onChange={(e) => setRoomName(e.target.value)} />
                <Button text={"Criar sala"} onClick={() => validateRoom()} />
            </div>
        </div>
    );
}