import React from 'react';

import styles from "./style.module.css";
import Button from '../../../button/Button';

export default function ChangeAttributes({ value, onClick, text, add, dec }) {
    return (
        <div className={styles.container}>
            <div className={styles.changeAttributes}>
                <button className={styles.button} onClick={dec}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M200-440v-80h560v80H200Z" />
                    </svg>
                </button>
                <div className={styles.attributes}>
                    <h2 className={styles.attributesText}>{value}</h2>
                </div>
                <button className={styles.button} onClick={add}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg>
                </button>
            </div>
            <p className={styles.text}>{text}</p>
        </div>
    )
}
