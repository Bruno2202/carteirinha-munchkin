import React from 'react';
import styles from './style.module.css';

// style: 1 (normal), 2 (line);

export default function Input({ placeholder, setValue, type, style, maxLength }) {

    return (
        (style === 1 || style == "" || style == null || style == undefined) ? (
            <input maxLength={maxLength ? maxLength : 50} className={styles.input1} placeholder={placeholder} type={type} onChange={(e) => setValue(e.target.value)} />
        ) : style == 2 ?(
            <input maxLength={maxLength ? maxLength : 50} className={styles.input2} placeholder={placeholder} type={type} onChange={(e) => setValue(e.target.value)} />
        ) : <></>
    );
}