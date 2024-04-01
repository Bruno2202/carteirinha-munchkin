import React from 'react';
import styles from './style.module.css';

export default function Button({ text, onClick, backgroundColor, color }) {
    return (
        <button className={styles.button} style={{ backgroundColor: backgroundColor ? backgroundColor : "#C69749", color: color ? color : "#000000" }} onClick={onClick}>
            {text}
        </button>
    );
}
