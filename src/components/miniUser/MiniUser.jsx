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
    items,
    modifier,
    onClick,
    showItems,
    showModifier,
    showStrength
}) {
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
                                            <path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z" />
                                        </svg>
                                    }
                                />
                                {showItems &&
                                    <Info
                                        title={"ITENS"}
                                        value={items}
                                        svg={
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#C69749">
                                                <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Z" />
                                            </svg>
                                        }
                                    />
                                }
                                {showModifier &&
                                    <Info
                                        title={"MOD"}
                                        value={modifier}
                                        svg={
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#C69749">
                                                <path d="M200-120q-51 0-72.5-45.5T138-250l222-270v-240h-40q-17 0-28.5-11.5T280-800q0-17 11.5-28.5T320-840h320q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760h-40v240l222 270q32 39 10.5 84.5T760-120H200Zm0-80h560L520-492v-268h-80v268L200-200Zm280-280Z" />
                                            </svg>
                                        }
                                    />
                                }
                                {showStrength &&
                                    <Info
                                        title={"FORÇA"}
                                        value={level + items}
                                        svg={
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#C69749">
                                                <path d="m826-585-56-56 30-31-128-128-31 30-57-57 30-31q23-23 57-22.5t57 23.5l129 129q23 23 23 56.5T857-615l-31 30ZM346-104q-23 23-56.5 23T233-104L104-233q-23-23-23-56.5t23-56.5l30-30 57 57-31 30 129 129 30-31 57 57-30 30Zm397-336 57-57-303-303-57 57 303 303ZM463-160l57-58-302-302-58 57 303 303Zm-6-234 110-109-64-64-109 110 63 63Zm63 290q-23 23-57 23t-57-23L104-406q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l63 63 110-110-63-62q-23-23-23-57t23-57l57-57q23-23 56.5-23t56.5 23l303 303q23 23 23 56.5T857-441l-57 57q-23 23-57 23t-57-23l-62-63-110 110 63 63q23 23 23 56.5T577-161l-57 57Z" />
                                            </svg>
                                        }
                                    />
                                }
                            </div>
                        </div>
                    </div >
                )
            }
        </>
    );
}