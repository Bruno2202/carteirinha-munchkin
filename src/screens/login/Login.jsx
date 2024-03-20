import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';

import styles from './style.module.css';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';

export default function Home() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    function tryLogin() {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                toast.success("Sucesso ao logar! 😉")
                navigate('/profile');
            })
            .catch((error) => {
                if (error == "FirebaseError: Firebase: Error (auth/invalid-email).") {
                    toast.error("Usuário ou senha inválidos 😴")
                } else {
                    toast.error("Erro ao tentar logar ❌")
                }
                console.log(`Erro ao tentar logar: ${error}`)
            });
    }

    return (
        <div className={styles.container}>
            <div className={styles.cardLeft}>
                <div className={styles.welcomeCard}>
                    <h1 className={styles.cardText}>
                        Efetue o login <br /> e entre para o jogo !
                    </h1>
                    <img src={require("../../assets/img/munchckin.png")} className={styles.logo} />
                </div>
            </div>
            <div className={styles.cardRight}>
                <div className={styles.cardLogin}>
                    <h1 className={styles.loginTitle}>
                        LOGIN
                    </h1>
                    <div className={styles.inputs}>
                        <Input placeholder={"Email"} type={"text"} setValue={setEmail} />
                        <Input placeholder={"Senha"} type={"password"} setValue={setPassword} />
                    </div>
                    <Button text={"Entrar"} onClick={tryLogin} />
                    <Link to="/register">
                        <p className={styles.navigate}>Criar conta</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
