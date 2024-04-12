import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { db } from '../../../../config/firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';

import styles from "./style.module.css";
import BackHeader from '../../../../components/backHeader/BackHeader';
import BattleCard from '../../../../components/card/battleCard/BattleCard';
import Button from '../../../../components/button/Button';
import ShowBattlePlayers from '../../../../components/modal/showBattlePlayers/ShowBattlePlayers';

export default function Battle() {
    const [playerData, setPlayerData] = useState([]);
    const [monsterData, setMonsterData] = useState([]);
    const [playerStrength, setPlayerStrength] = useState(0);
    const [monsterStrength, setMonsterStrength] = useState(0);
    const [playerColor, setPlayerColor] = useState("#44445B");
    const [monsterColor, setMonsterColor] = useState("#44445B");
    const [modalIsVisible, setModalIsVisible] = useState(false);

    const { roomID, playerUid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getPlayerData();
        getMonsterData();
    }, []);

    useEffect(() => {
        const monsterCollection = collection(db, `room/${roomID}/jogadores/${playerUid}/monstro`);
        const refreshMonsterData = onSnapshot(monsterCollection, () => {
            getMonsterData();
        });

        const playerCollection = collection(db, `room/${roomID}/jogadores`);
        const refreshPlayerData = onSnapshot(playerCollection, () => {
            getPlayerData();
        });

        return () => {
            refreshMonsterData();
            refreshPlayerData();
        };
    }, [roomID]);

    useEffect(() => {
        if (playerStrength && monsterStrength) {
            if (playerStrength > monsterStrength) {
                setPlayerColor("#55DB5E");
                setMonsterColor("#B2283A");
            } else if (monsterStrength > playerStrength) {
                setPlayerColor("#B2283A");
                setMonsterColor("#55DB5E");
            } else {
                setPlayerColor("#B2283A");
                setMonsterColor("#55DB5E");
            }
        }
    }, [playerStrength, monsterStrength]);

    useEffect(() => {
        if (monsterData.length > 0) {
            var strengthM = 0;
            monsterData.map((monster) => (
                strengthM = strengthM + monster.nivel + monster.modificador
            ));
            setMonsterStrength(strengthM);
        }
        if (playerData.length > 0) {
            var strengthP = 0;
            playerData.map((player) => (
                strengthP = strengthP + player.nivel + player.modificador + player.equipamento
            ));
            setPlayerStrength(strengthP);
        }
    }, [playerData, monsterData]);

    async function getPlayerData() {
        try {
            const playerCollection = await getDocs(
                query(
                    collection(db, `room/${roomID}/jogadores`),
                    where("batalhando", "==", true)
                )
            );
            const data = playerCollection.docs.map((doc) => doc.data());
            setPlayerData(data);
        } catch (error) {
            console.log(`Erro ao obter dados do jogador: ${error}`);
        }
    }

    async function getMonsterData() {
        try {
            const monstrQuerySnapshot = await getDocs(collection(db, `room/${roomID}/jogadores/${playerUid}/monstro`));
            const data = monstrQuerySnapshot.docs.map((doc) => doc.data());
            setMonsterData(data);
        } catch (error) {
            console.log(`Erro ao obter dados do(os) monstros: ${error}`);
        }
    }

    async function addMonster() {
        try {
            const monsterCollection = collection(db, `room/${roomID}/jogadores/${playerUid}/monstro`);
            const monsterData = {
                id: "",
                nivel: 0,
                modificador: 0,
            }
            const monster = await addDoc(monsterCollection, monsterData);
            await updateDoc(doc(monsterCollection, monster.id), { id: monster.id });
        } catch (error) {
            console.log(`Erro ao adicionar monstro: ${error}`);
        }
    }

    async function deleteMonster(monsterId) {
        try {
            const monsterDocRef = doc(db, `room/${roomID}/jogadores/${playerUid}/monstro/${monsterId}`);
            await deleteDoc(monsterDocRef);
        } catch (error) {
            console.log(`Erro ao deletar jogardor/monstro: ${error}`);
        }
    }

    async function deletePlayer(playerUid) {
        try {
            const playerDocRef = doc(db, `room/${roomID}/jogadores/${playerUid}`);
            updateDoc(playerDocRef, { batalhando: false })
        } catch (error) {
            console.log(`Erro ao deletar jogardor/monstro: ${error}`);
        }
    }

    function promiseStopBattle() {
        toast.promise(
            stopBattle(),
            {
                loading: 'Encerrando batalha...',
                success: <b>A batalha acabou!</b>,
                error: (error) => <b>{error.message}</b>,
            }
        );
    }

    async function stopBattle() {
        try {
            monsterData.map(async (monster) => {
                const monsterDocRef = doc(db, `room/${roomID}/jogadores/${playerUid}/monstro/${monster.id}`);
                await deleteDoc(monsterDocRef);
            })
            playerData.map(async (player) => {
                const playerDocRef = doc(db, `room/${roomID}/jogadores/${player.uid}`);
                await updateDoc(playerDocRef, { batalhando: false });
            })

            const roomDocRef = doc(db, `room/${roomID}`);
            await updateDoc(roomDocRef, { uid_batalha: "" });

            navigate(`/game/${roomID}`);
        } catch (error) {
            console.log(`Erro ao encerrar batalha: ${error}`);
            throw new Error("Não foi possível encerrar batalha");
        }
    }

    return (
        <>
            <ShowBattlePlayers
                modalIsVisible={modalIsVisible}
                roomID={roomID}
                setModalIsVisible={setModalIsVisible}
            />
            <div className={styles.container}>
                <BackHeader to={`/game/${roomID}`} backgroundColor={"#0D1117"} title={"BATALHA"} onClickChildren={() => promiseStopBattle()}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="#B2283A">
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                </BackHeader>
                <div className={styles.battle}>
                    <div className={styles.players}>
                        {playerData.map((player) => (
                            <BattleCard
                                key={player.uid}
                                name={player.nome}
                                level={player.nivel}
                                modifier={player.modificador}
                                item={player.equipamento}
                                showItems={true}
                                roomID={roomID}
                                monster={false}
                                battlePlayerUid={player.uid}
                                canDelete={
                                    playerData.length <= 1 || player.uid == playerUid ? false : true
                                }
                                onClick={() => deletePlayer(player.uid)}
                            />
                        ))}
                        <Button
                            height={"52px"}
                            width={"52px"}
                            borderRadius={"52px"}
                            padding={"14px"}
                            onClick={() => setModalIsVisible(true)}
                            text={
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                                </svg>
                            }
                        />
                    </div>
                    <div className={styles.score}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={playerColor}>
                            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                        </svg>
                        <h1 className={styles.scoreText}>
                            {playerStrength} / {monsterStrength}
                        </h1>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={monsterColor}>
                            <path d="M240-80v-170q-39-17-68.5-45.5t-50-64.5q-20.5-36-31-77T80-520q0-158 112-259t288-101q176 0 288 101t112 259q0 42-10.5 83t-31 77q-20.5 36-50 64.5T720-250v170H240Zm80-80h40v-80h80v80h80v-80h80v80h40v-142q38-9 67.5-30t50-50q20.5-29 31.5-64t11-74q0-125-88.5-202.5T480-800q-143 0-231.5 77.5T160-520q0 39 11 74t31.5 64q20.5 29 50.5 50t67 30v142Zm100-200h120l-60-120-60 120Zm-80-80q33 0 56.5-23.5T420-520q0-33-23.5-56.5T340-600q-33 0-56.5 23.5T260-520q0 33 23.5 56.5T340-440Zm280 0q33 0 56.5-23.5T700-520q0-33-23.5-56.5T620-600q-33 0-56.5 23.5T540-520q0 33 23.5 56.5T620-440ZM480-160Z" />
                        </svg>
                    </div>
                    <div className={styles.monsters}>
                        {monsterData.map((monster, index) => (
                            <BattleCard
                                key={monster.id}
                                monsterId={monster.id}
                                name={`Monstro ${index + 1}`}
                                level={monster.nivel}
                                modifier={monster.modificador}
                                roomID={roomID}
                                monster={true}
                                canDelete={
                                    monsterData.length <= 1 ? false : true
                                }
                                onClick={() => deleteMonster(monster.id)}
                            />
                        ))}
                        <Button
                            height={"52px"}
                            width={"52px"}
                            borderRadius={"52px"}
                            padding={"14px"}
                            onClick={() => addMonster()}
                            text={
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
