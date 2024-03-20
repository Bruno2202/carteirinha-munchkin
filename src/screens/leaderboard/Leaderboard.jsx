import React, { useEffect, useState } from 'react';
import { db } from "../../config/firebaseConfig";
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import styles from "./style.module.css";
import BackHeader from '../../components/backHaeder/BackHeader';
import MiniUser from '../../components/miniUser/MiniUser';

export default function Leaderboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        catchData();
    }, []);

    async function catchData() {
        try {
            const querySnapshot = await getDocs(query(
                collection(db, "user"),
                orderBy('vitorias', 'desc')
            ));
            const userData = querySnapshot.docs.map(doc => doc.data());
            setData(userData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    function color(index) {
        if (index+1 == 1) {
            return "#FFD700"
        } else if (index+1 == 2) {
            return "#C0C0C0"
        } else if (index+1 == 3) {
            return "#CD7F32"
        } else {
            return "#44445b"
        }
    }

    return (
        <div className={styles.container}>
            <BackHeader title={"LEADERBOARD"} backgroundColor={"#0D1117"}/>
            <div className={styles.leaderboard}>
                {data.map((user, index) => (
                    <MiniUser key={user.nome} name={user.nome} userPic={user.picURL} victories={user.vitorias} showPlace={true} place={index+1} placeColor={color(index)} isLeaderboard={true} />
                ))}
            </div>
        </div>
    );
}
