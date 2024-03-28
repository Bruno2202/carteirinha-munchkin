import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { db, auth } from '../../../config/firebaseConfig';
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import styles from "./style.module.css";
import BackHeader from "../../../components/backHaeder/BackHeader";
import Button from '../../../components/button/Button';

export default function CreateRoom() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <BackHeader title={"JOGAR"} backgroundColor={"#0D1117"} />
            <div className={styles.selection}>
                <Button text={"Entrar em sala"} onClick={() => navigate('/room/join')} />
                <Button text={"Criar sala"} onClick={() => navigate('/room/create')} />
            </div>
        </div>
    )
}
