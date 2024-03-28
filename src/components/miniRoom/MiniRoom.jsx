import React from 'react'

import styles from "./style.module.css";

export default function MiniRoom({ roomPic, roomName }) {
    return (
        <div className={styles.miniRoom}>   
            <img className={styles.roomPic} src={roomPic} />
            <p className={styles.roomName}>{roomName}</p>
        </div>
    );
}
