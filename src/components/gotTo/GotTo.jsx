import React from 'react';
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';

import styles from "./style.module.css";

export default function GotTo({ page, icon, text, available }) {
    return (
        available ? (
            <Link className={styles.gotTo} to={page}>
                <div className={styles.content}>
                    {icon}
                    <p>{text}</p>
                </div>
                <div className={styles.arrow}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#FFFFFF'>
                        <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                    </svg>
                </div>
            </Link>
        ) : (
            <div className={styles.gotTo} onClick={() => toast.error("Página indisponível")}>
                <div className={styles.content}>
                    {icon}
                    <p>{text}</p>
                </div>
                <div className={styles.arrow}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill='#FFFFFF'>
                        <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
                    </svg>
                </div>
            </div>
        )
    );
}
