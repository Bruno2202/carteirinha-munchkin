import React from 'react';

import styles from "./style.module.css";

export default function showBattlePlayers({ modalIsVisible }) {
    return (
        <>
            {modalIsVisible && (
                <div className={styles.modalOverlay} >
                    <div className={styles.players}>
                
                    </div>
                </div>
            )}
        </>
    )
}
