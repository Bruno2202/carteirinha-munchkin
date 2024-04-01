import React from 'react';
import { Link } from 'react-router-dom';

import styles from "./style.module.css";

export default function BackHeader({ title, backgroundColor, to, onClick, children }) {
    return (
        <div className={styles.header} style={{ backgroundColor: backgroundColor }}>
            <Link className={styles.a} to={to ? to : "/profile"} onClick={onClick && onClick}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#FFFFFF'>
                    <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
                </svg>
            </Link>
            <p className={styles.title}>{title}</p>
            <div className={styles.children}>
                {children}
            </div>
        </div >
    );
}
