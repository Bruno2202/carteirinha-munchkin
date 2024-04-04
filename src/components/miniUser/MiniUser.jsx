import React from 'react';
import { Link } from 'react-router-dom';

import styles from "./style.module.css";
import Info from "../info/Info"

export default function MiniUser({
    name,
    victories,
    place,
    placeColor,
    defeats,
    rating,
    favoriteCard,
    userPic,
    showLeaderPlace,
    showLeaderVictories,
    type,
    level,
    itens,
    onClick
}) {

    const thunderIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z"/></svg>`

    return (


        <>
            {
                type == 1 ? (
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
                ) : type == 2 ? (
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
                ) : type == 3 && (
                    <div className={styles.miniUser_game} style={{ backgroundColor: placeColor }} onClick={onClick}>
                        <div className={styles.userCredentials_game}>
                            <img className={styles.userPic_Users} src={userPic ? userPic : require("../../assets/img/userPic.png")} />
                            <h3 className={styles.name_Users}>{name}</h3>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.info_game}>
                                <Info
                                    title={"NÍVEL"}
                                    value={level}
                                    svg={
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#C69749">
                                            <path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z" />
                                        </svg>
                                    }
                                />
                                <Info
                                    title={"ITENS"}
                                    value={itens}
                                    svg={
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#C69749">
                                            <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Z" />
                                        </svg>
                                    }
                                />
                            </div>
                        </div>
                    </div >
                )
            }
        </>
    );
}