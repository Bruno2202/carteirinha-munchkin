import React, { useEffect, useState } from 'react';
import { db } from "../../config/firebaseConfig";
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import styles from "./style.module.css";
import BackHeader from '../../components/backHeader/BackHeader';
import MiniUser from '../../components/miniUser/MiniUser';

export default function Users() {
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

    return (
        <div className={styles.container}>
            <BackHeader title={"MUNCHKERS"} backgroundColor={"#0D1117"}/>
            <div className={styles.userList}>
                {data.map((user) => (
                    <MiniUser
                        key={user.nome}
                        placeColor={"#44445b"}
                        name={user.nome}
                        userPic={user.picURL}
                        victories={user.vitorias}
                        defeats={user.derrotas}
                        // favoriteCard={user.carta_favorita}
                        rating={`${user.rating}%`}
                        type={2}
                    />
                ))}
            </div>
        </div>
    );
}
