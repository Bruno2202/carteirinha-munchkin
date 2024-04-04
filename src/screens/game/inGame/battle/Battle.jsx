import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { db } from '../../../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import styles from "./style.module.css";
import BackHeader from '../../../../components/backHeader/BackHeader';
import MiniUser from '../../../../components/miniUser/MiniUser';

export default function Battle() {

    const [playerData, setPlayerData] = useState([]);

    const { roomID, playerUid } = useParams();

    useEffect(() => {
        const getPlayerData = async () => {
            try {
                const playerSnapshot = await getDoc(doc(db, `room/${roomID}/jogadores/${playerUid}`));
                setPlayerData([playerSnapshot.data()]);
            } catch (error) {
                console.log(`Erro ao obter dados do jogador: ${error}`);
            }
        }
        getPlayerData();
    }, []);

    return (
        <div className={styles.container}>
            <BackHeader to={`/game/${roomID}`} backgroundColor={"#0D1117"} title={"BATALHA"} />
            <div className={styles.players}>
                {playerData.map((player) => (
                    <MiniUser
                        key={player.uid}
                        name={player.nome}
                        placeColor={"#44445B"}
                        type={3}
                    />
                ))}
            </div>
        </div>
    );
}
