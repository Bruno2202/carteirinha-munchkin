import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../config/firebaseConfig';

import styles from "./style.module.css";
import ChangeAttributes from './changeAttributes/ChangeAttributes';
import Button from '../../button/Button';

export default function PlayerAttributes({ modalIsVisible, setModalIsVisible, playerUid, roomID, battleUid }) {

    const [playerData, setPlayerData] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (playerUid !== "") {
            getPlayerData();

            const playerCollection = collection(db, `room/${roomID}/jogadores`);
            const refreshPlayerData = onSnapshot(playerCollection, () => {
                getPlayerData();
            });
    
            return () => {
                refreshPlayerData();
            };
        }

    }, [playerUid]);

    const getPlayerData = async () => {
        try {
            const playerDocRef = doc(db, `room/${roomID}/jogadores/${playerUid}`);
            const docData = await getDoc(playerDocRef);
            setPlayerData(docData.data());
        } catch (error) {
            console.log(`Erro ao obter dados do jogador: ${error}`);
        }
    }

    function closeModal() {
        setModalIsVisible(!modalIsVisible);
    }

    async function modifyLevel(modifier) {
        const playerDocRef = doc(db, `room/${roomID}/jogadores/${playerUid}`);
        if (modifier == 1 && playerData.nivel < 10) {
            await updateDoc(playerDocRef, { nivel: playerData.nivel + modifier });
            getPlayerData();
        }
        if (modifier == -1 && playerData.nivel > 1) {
            await updateDoc(playerDocRef, { nivel: playerData.nivel + modifier });
            getPlayerData();
        }
    }

    async function modifyItem(modifier) {
        const playerDocRef = doc(db, `room/${roomID}/jogadores/${playerUid}`);
        await updateDoc(playerDocRef, { equipamento: playerData.equipamento + modifier });
        getPlayerData();
    }

    function promiseStartBattle() {
        toast.promise(
            startBattle(),
            {
                loading: 'Iniciando batalha...',
                success: <b>A batalha começou!</b>,
                error: (error) => <b>{error.message}</b>
            }
        );
    }

    async function startBattle() {
        const playersQuerySnapshot = await getDocs(
            query(
                collection(db, `room/${roomID}/jogadores`),
                where("batalhando", "==", true)
            )
        );
        const data = playersQuerySnapshot.docs.map((doc) => doc.data());
        // console.log(data.length >= 1, playerData.uid !== battleUid, playerData.batalhando)
        if (data.length >= 1 && playerData.batalhando == false) {
            // Tem um jogador batalhando
            throw new Error("Um jogador já está batalhando");
        } else if (data.length >= 1 && playerData.uid !== battleUid) {
            if (playerData.batalhando) {
                throw new Error("Você está batalhando junto com um jogador");
            } else {
                throw new Error("Um jogador já está batalhando");
            }
        } else if (data.length >= 1 && playerData.uid !== battleUid && playerData.batalhando) {
            // Tem um jogador batalhando e você está ajudando ele
            throw new Error("Você está batalhando junto com um jogador");
        } else if (data.length >= 1 && playerData.batalhando == true) {
            // Tem um jogador batalhando, porém a sala é dele
            navigate(`/game/${roomID}/battle/${playerUid}`, { playerUid: playerUid });
        } else {
            try {
                const playerDocref = doc(db, `room/${roomID}/jogadores/${playerUid}`);
                const roomDocRef = doc(db, `room/${roomID}`)
                if (playerData.batalhando == false) {
                    const monsterCollection = collection(db, `room/${roomID}/jogadores/${playerUid}/monstro`);
                    const monsterData = {
                        id: "",
                        nivel: 0,
                        modificador: 0,
                    }
                    const monster = await addDoc(monsterCollection, monsterData);
                    await updateDoc(doc(monsterCollection, monster.id), { id: monster.id });
                    await updateDoc(playerDocref, { batalhando: true });
                    await updateDoc(roomDocRef, { uid_batalha: playerUid });
                }

                navigate(`/game/${roomID}/battle/${playerUid}`, { playerUid: playerUid });
            } catch (error) {
                console.log(`Erro ao iniciar sala: ${error}`);
                throw new Error("Não foi possível iniciar batalha");
            }
        }
    }

    return (
        <>
            {modalIsVisible && (
                <div className={styles.modalOverlay} >
                    <div className={styles.playerAttributes}>
                        <div className={styles.close} onClick={() => closeModal()} >
                            <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill={"#FFFFFF"}>
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                            </svg>
                        </div>
                        <h1 className={styles.name}>{playerData.nome}</h1>
                        <div className={styles.strength}>
                            <h1 className={styles.attributesText}>{playerData.nivel || playerData.equipamento ?
                                playerData.nivel + playerData.equipamento : 0
                            }</h1>
                            <p className={styles.text}>FORÇA</p>
                        </div>
                        <div className={styles.modifiableAttributes} >
                            <ChangeAttributes value={playerData.nivel} text={"NÍVEL"} add={() => modifyLevel(1)} dec={() => modifyLevel(-1)} />
                            <ChangeAttributes value={playerData.equipamento} text={"ITENS"} add={() => modifyItem(1)} dec={() => modifyItem(-1)} />
                        </div>
                        <div className={styles.startBattle}>
                            {playerUid && (
                                <Button
                                    backgroundColor={"#282A3A"}
                                    text={
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#C69749'>
                                            <path d="M762-96 645-212l-88 88-28-28q-23-23-23-57t23-57l169-169q23-23 57-23t57 23l28 28-88 88 116 117q12 12 12 28t-12 28l-50 50q-12 12-28 12t-28-12Zm118-628L426-270l5 4q23 23 23 57t-23 57l-28 28-88-88L198-96q-12 12-28 12t-28-12l-50-50q-12-12-12-28t12-28l116-117-88-88 28-28q23-23 57-23t57 23l4 5 454-454h160v160ZM334-583l24-23 23-24-23 24-24 23Zm-56 57L80-724v-160h160l198 198-57 56-174-174h-47v47l174 174-56 57Zm92 199 430-430v-47h-47L323-374l47 47Zm0 0-24-23-23-24 23 24 24 23Z" />
                                        </svg>
                                    }
                                    width={"50%"}
                                    height={"auto"}
                                    borderRadius={"50px"}
                                    onClick={() => promiseStartBattle()}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}