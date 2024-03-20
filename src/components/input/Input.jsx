import React from 'react';
import styles from './style.module.css';

export default function Input({ placeholder, setValue, type }) {
    return (
        <input className={styles.input} placeholder={placeholder} type={type} onChange={(e) => setValue(e.target.value)} />
    );
}