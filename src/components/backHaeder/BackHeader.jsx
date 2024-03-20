import React from 'react';
import { Link } from 'react-router-dom';

import styles from "./style.module.css";

export default function BackHeader({ title, backgroundColor }) {
    return (
        <Link to={"/profile"} className={styles.header} style={{backgroundColor: backgroundColor}}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#FFFFFF'>
                <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>
            <p className={styles.title}>{title}</p>
        </Link>
    );
}
