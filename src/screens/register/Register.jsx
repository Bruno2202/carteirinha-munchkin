import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';

import styles from './style.module.css';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';

export default function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    function validateFields() {
        if (username == "" || email == "" || password == "") {
            toast.error("Preencha os campos corretamente");
        } else {
            tryRegister();
        }
    }

    async function tryRegister() {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            const userCollectionRef = collection(db, "user");
            const userDocRef = doc(userCollectionRef, uid);
    
            const userData = {
                email: email,
                nome: username,
                dt_criacao: new Date,
                vitorias: 0,
                derrotas: 0,
                rating: 0,
                picURL: ""
            };

            await setDoc(userDocRef, userData);

            toast.success("Sucesso ao se cadastrar! 😉");
            navigate('/');

        } catch (error) {
            if (error == "FirebaseError: Firebase: Error (auth/invalid-email).") {
                toast.error("O email inserido é inválido");
			}
            if (error == "FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).") {
                toast.error("A senha deve conter 6 ou mais caracteres");
			}
            if (error == "FirebaseError: Firebase: Error (auth/email-already-in-use).") {
                toast.error("O email já está em uso");
			}
            console.log(`Erro ao tentar se cadastrar: ${error}`);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.cardLeft}>
                <div className={styles.welcomeCard}>
                    <h1 className={styles.cardText}>
                        Efetue o cadastro <br /> e entre para o jogo !
                    </h1>
                    <img src={require("../../assets/img/munchckin.png")} className={styles.logo} />
                </div>
            </div>
            <div className={styles.cardRight}>
                <div className={styles.cardRegister}>
                    <h1 className={styles.registerTitle}>
                        CADASTRO
                    </h1>
                    <div className={styles.inputs}>
                        <Input placeholder={"Usuario"} type={"text"} setValue={setUsername} />
                        <Input placeholder={"Email"} type={"text"} setValue={setEmail} />
                        <Input placeholder={"Senha"} type={"password"} setValue={setPassword} />
                    </div>
                    <Button text={"Cadastrar"} onClick={validateFields} />
                    <Link to="/">
                        <p className={styles.navigate}>Ja possuo uma conta</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
