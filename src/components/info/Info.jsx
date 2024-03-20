import React from 'react';
import styles from "./style.module.css";

export default function Info({ title, color, value, symbol, svg, font, textColor }) {
    return (
        <div className={styles.info} style={{ backgroundColor: color }}>
            <h1 className={styles.value} style={{fontFamily: font, color: textColor}}>
                {value}
            </h1>
            <div className={styles.description}>
                <p className={styles.title} >
                    {title}
                </p>
                <img className={styles.symbol} src={symbol} />
                <p>{svg}</p>
            </div>
        </div>
    );
}
