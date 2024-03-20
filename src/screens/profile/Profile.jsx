import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../../config/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';

import styles from './styles.module.css';
import Info from '../../components/info/Info';
import GotTo from '../../components/gotTo/GotTo';
import Separator from '../../components/separator/Separator';
import Credits from '../../components/credits/Credits';

export default function Profile() {

    const [myUid, setMyUid] = useState("");
    const [username, setUsername] = useState("");
    const [vitorias, setVitorias] = useState(0);
    const [derrotas, setDerrotas] = useState(0);
    const [rating, setRating] = useState(0);
    const [ranking, setRanking] = useState(0);
    const [userPic, setUserPic] = useState("");
    const [modalIsVisible, setModalIsVisible] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user.uid) {
                setMyUid(user.uid);
            }
        });
    }, [myUid]);

    useEffect(() => {
        if (myUid !== "") {
            getUserData();
        }
    }, [myUid]);

    async function getUserData() {
        const userData = await getDoc(doc(db, `user/${myUid}`));
        setUsername(userData.data().nome);
        setVitorias(userData.data().vitorias);
        setDerrotas(userData.data().derrotas);
        setRating(userData.data().rating);
        setUserPic(userData.data().picURL ? userData.data().picURL : require("../../assets/img/userPic.png"));
    }

    return (
        <div className={styles.container}>
            <div className={styles.profile} style={{ filter: modalIsVisible ? "blur(4px)" : "blur(0px)" }}>
                <div className={styles.userInfo}>
                    <img className={styles.userPic} src={userPic ? userPic : require("../../assets/img/userPic.png")} />
                    <h1 className={styles.username}>
                        {username}
                    </h1>
                </div>
                <div className={styles.cards}>

                    <section className={styles.cardsTop}>
                        <Info title={"Derrotas"} symbol={require("../../assets/img/emojis/skull.png")} value={derrotas} color={"#44445b"} />
                        <Info title={"Vitórias"} symbol={require("../../assets/img/emojis/crown.png")} value={vitorias} color={"#44445b"} />
                        <Info title={"Rating"} symbol={require("../../assets/img/emojis/stats.png")} value={`${rating}%`} color={"#44445b"} />
                    </section>

                    <section className={styles.cardsBottom}>
                        <Info title={"Ranking"} symbol={require("../../assets/img/emojis/trophy.png")} value={`${ranking}°`} color={"#44445b"} />
                    </section>

                    <section className={styles.quickActions}>
                        <GotTo
                            page={"/game/"}
                            text={"Entrar em sala"}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#55DB5E'>
                                    <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                                </svg>
                            }
                            available={false}
                        />
                        <Separator />
                        <GotTo
                            page={"/game/create"}
                            text={"Criar sala"}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#55DB5E'>
                                    <path d="m272-440 208 120 208-120-168-97v137h-80v-137l-168 97Zm168-189v-17q-44-13-72-49.5T340-780q0-58 41-99t99-41q58 0 99 41t41 99q0 48-28 84.5T520-646v17l280 161q19 11 29.5 29.5T840-398v76q0 22-10.5 40.5T800-252L520-91q-19 11-40 11t-40-11L160-252q-19-11-29.5-29.5T120-322v-76q0-22 10.5-40.5T160-468l280-161Zm0 378L200-389v67l280 162 280-162v-67L520-251q-19 11-40 11t-40-11Zm40-469q25 0 42.5-17.5T540-780q0-25-17.5-42.5T480-840q-25 0-42.5 17.5T420-780q0 25 17.5 42.5T480-720Zm0 560Z" />
                                </svg>
                            }
                            available={false}
                        />
                    </section>

                    <section className={styles.quickActions}>
                        <GotTo
                            page={"/leaderboard"}
                            text={"Leaderbord"}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#C69749'>
                                    <path d="M160-200h160v-320H160v320Zm240 0h160v-560H400v560Zm240 0h160v-240H640v240ZM80-120v-480h240v-240h320v320h240v400H80Z" />
                                </svg>
                            }
                            available={true}
                        />
                        <Separator />
                        <GotTo
                            page={"/users"}
                            text={"Usuários"}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#C69749'>
                                    <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
                                </svg>
                            }
                            available={true}
                        />
                        <Separator />
                        <GotTo
                            page={"/profile/settings"}
                            text={"Carta favorita"}

                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#C69749'>
                                    <path d="m608-368 46-166-142-98-46 166 142 98ZM160-207l-33-16q-31-13-42-44.5t3-62.5l72-156v279Zm160 87q-33 0-56.5-24T240-201v-239l107 294q3 7 5 13.5t7 12.5h-39Zm206-5q-31 11-62-3t-42-45L245-662q-11-31 3-61.5t45-41.5l301-110q31-11 61.5 3t41.5 45l178 489q11 31-3 61.5T827-235L526-125Zm-28-75 302-110-179-490-301 110 178 490Zm62-300Z" />
                                </svg>
                            }
                            available={false}
                        />
                        <Separator />
                        <GotTo
                            page={"/profile/settings/userPic"}
                            text={"Foto do usuário"}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#C69749'>
                                    <path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z" />
                                </svg>
                            }
                            available={true}
                        />
                        <Separator />
                        <GotTo
                            page={"/profile/settings"}
                            text={"Configurações"}
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#C69749'>
                                    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                                </svg>
                            }
                            available={false}
                        />
                    </section>
                </div>
            </div>
            <Credits setModalIsVisible={setModalIsVisible} modalIsVisible={modalIsVisible} />
        </div>
    );
}
