import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { db } from '../../../config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

import styles from "./style.module.css";
import ChangeAttributes from '../../modal/playerAttributes/changeAttributes/ChangeAttributes';

export default function BattleCard({ battlePlayerUid, monsterId, name, level, item, modifier, roomID, showItems, monster, canDelete, onClick }) {

    const { playerUid } = useParams();

    async function modifyLevel(value) {
        if (monster) {
            const docRef = doc(db, `room/${roomID}/jogadores/${playerUid}/monstro/${monsterId}`);
            await updateDoc(docRef, { nivel: level + value });
        } else {
            const docRef = doc(db, `room/${roomID}/jogadores/${battlePlayerUid}`);
            if (value == 1 && level < 10) {
                await updateDoc(docRef, { nivel: level + value });
            } else if (value == -1 && level > 1) {
                await updateDoc(docRef, { nivel: level + value });
            }
        }
    }

    async function modifyItem(value) {
        if (monster) {
            const docRef = doc(db, `room/${roomID}/jogadores/${playerUid}/monstro/${monsterId}`);
            await updateDoc(docRef, { equipamento: item + value });
        } else {
            const docRef = doc(db, `room/${roomID}/jogadores/${battlePlayerUid}`);
            await updateDoc(docRef, { equipamento: item + value });
        }
    }

    async function modifyModifier(value) {
        if (monster) {
            const docRef = doc(db, `room/${roomID}/jogadores/${playerUid}/monstro/${monsterId}`);
            await updateDoc(docRef, { modificador: modifier + value });
        } else {
            const docRef = doc(db, `room/${roomID}/jogadores/${battlePlayerUid}`);
            await updateDoc(docRef, { modificador: modifier + value });
        }
    }

    return (
        <div className={styles.BattleCard}>
            {canDelete &&
                <div className={styles.delete} onClick={onClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28" fill={"#FFFFFF"}>
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                </div>
            }
            <h1 className={styles.name}>{name}</h1>
            <div className={styles.modifiableAttributes} >
                <ChangeAttributes value={level} text={"NÍVEL"} add={() => modifyLevel(1)} dec={() => modifyLevel(-1)} />
                {showItems &&
                    <ChangeAttributes value={item} text={"ITENS"} add={() => modifyItem(1)} dec={() => modifyItem(-1)} />
                }
                <ChangeAttributes value={modifier} text={"MOD"} add={() => modifyModifier(1)} dec={() => modifyModifier(-1)} />
            </div>
        </div>
    );
}


