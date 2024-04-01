import React from 'react';
import { Link } from 'react-router-dom';

import styles from "./style.module.css";
import Info from "../info/Info"

export default function MiniUser({
    name,
    victories,
    place,
    placeColor,
    isLeaderboard,
    defeats,
    rating,
    favoriteCard,
    userPic,
    showLeaderPlace,
    showLeaderVictories
}) {
    return (
        <>
            {
                isLeaderboard ? (
                    <div className={styles.miniUser} style={{ backgroundColor: placeColor }} >
                        {showLeaderPlace &&
                            <p className={styles.place}>{place}°</p>
                        }
                        <img className={styles.userPic} src={userPic ? userPic : require("../../assets/img/userPic.png")} />
                        <h3 className={styles.nome}>{name}</h3>
                        {showLeaderVictories &&
                            <h4 className={styles.victories}>{victories}</h4>
                        }
                    </div >
                ) : (
                    <div /*to={`/profile/${name}`}*/ className={styles.miniUser_Users} style={{ backgroundColor: placeColor }}>
                        <div className={styles.userCredentials}>
                            <img className={styles.userPic_Users} src={userPic ? userPic : require("../../assets/img/userPic.png")} />
                            <h3 className={styles.name_Users}>{name}</h3>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.infoTop}>
                                <Info title={"DERROTAS"} value={defeats} />
                                <Info title={"VITÓRIAS"} value={victories} />
                                <Info title={"RATING"} value={rating} />
                            </div>
                            {/* <div className={styles.infoBottom}>
                                <Info title={"CARTA FAVORITA"} value={favoriteCard} font={"Windlass"} textColor={"#C69749"} />
                            </div> */}
                        </div>
                    </div >
                )
            }
        </>
    );
}