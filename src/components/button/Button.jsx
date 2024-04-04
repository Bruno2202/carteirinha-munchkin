import React from 'react';
import styles from './style.module.css';

export default function Button({ text, onClick, backgroundColor, color, width, height, borderRadius  }) {
    return (
        <button
            className={styles.button} 
            style={{
                backgroundColor: backgroundColor ? backgroundColor : "#C69749", 
                color: color ? color : "#000000",
                width: width ? width : "180px",
                height: height ? height : "48px",
                borderRadius: borderRadius ? borderRadius : "8px"
            }} 
            onClick={onClick}
        >
            {text}
        </button>
    );
}
