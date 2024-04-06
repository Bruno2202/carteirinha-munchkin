import React, { useEffect, useState } from 'react';

import styles from "./style.module.css";
import MiniUser from "../../miniUser/MiniUser";
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../config/firebaseConfig';

export default function ShowBattlePlayers({ modalIsVisible, setModalIsVisible, roomID }) {

    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const querySnapshot = await getDocs(
                    query(
                        collection(db, `room/${roomID}/jogadores`),
                        where("batalhando", "==", false)
                    )
                );
                const data = querySnapshot.docs.map((doc) => doc.data());
                setData(data);
            } catch (error) {
                console.log(`Erro ao obter jogadores disponíveis: ${error}`);
            }
        }
        getData();
    }, [modalIsVisible]);

    async function selectPlayer(playerUid) {
        const playerDocRef = doc(db, `room/${roomID}/jogadores/${playerUid}`);
        await updateDoc(playerDocRef, { batalhando: true });
        setModalIsVisible(!modalIsVisible);
    }

    return (
        <>
            {modalIsVisible && (
                <div className={styles.modalOverlay} >
                    <div className={styles.players}>
                        <svg onClick={() => setModalIsVisible(!modalIsVisible)} className={styles.close} xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="#FFFFFF">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                        </svg>
                        {data.map((doc) => (
                            <MiniUser
                                key={doc.uid}
                                name={doc.nome}
                                userPic={doc.picURL}
                                showStrength={true}
                                level={doc.nivel}
                                items={doc.equipamento}
                                type={3}
                                placeColor={"#282A3A"}
                                onClick={() => selectPlayer(doc.uid)}
                            />)
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
