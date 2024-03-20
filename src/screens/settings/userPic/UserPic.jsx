import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { db, storage, auth } from "../../../config/firebaseConfig";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import styles from "./style.module.css";
import BackHeader from '../../../components/backHaeder/BackHeader';


export default function UserPic() {

    const [imageUrls, setImageUrls] = useState([]);
    const [myUid, setMyUid] = useState("");

    useEffect(() => {
        getMunchkinPics();
        onAuthStateChanged(auth, async (user) => {
            setMyUid(user.uid);
        })
    }, []);

    async function getMunchkinPics() {
        const listRef = ref(storage, 'munchkin_images/user_pics/');

        try {
            const res = await listAll(listRef);
            const urlsPromises = res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return url;
            });
            const urls = await Promise.all(urlsPromises);
            setImageUrls(urls);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    }

    async function setUserPic(url) {
        try {

            const userDocRef = doc(db, `user/${myUid}`);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                await updateDoc(userDocRef, { picURL: url });
                toast.success("Foto do usuário atualizada")
            } else {
                console.log("Documento de usuário não encontrado.");
            }
        } catch (error) {
            toast.error("Erro ao mudar foto do perfil ❌")
            console.error("Erro ao atualizar a URL da imagem do usuário:", error);
        }
    }

    return (
        <div className={styles.container}>
            <BackHeader title={"FOTO DO USUÁRIO"} backgroundColor={"#0D1117"} />
            <div className={styles.userPics}>
                {imageUrls.map((url, index) => (
                    <img onClick={() => setUserPic(url)} className={styles.munchkinPics} key={index} src={url} alt={`User Pic ${index}`} />
                ))}
            </div>
        </div>
    );
}
