import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import {db, storage} from "../firebase";
import firebase from "firebase";
import '../styles/imageUpload.css'

const ImageUpload = ({username}) => {

    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const changeCaption = e => {
        setCaption(e.target.value);
    }

    const handleUpload = e => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (err) => {
                //Error function...
                console.log(err);
                alert(err.message);
            },
            () => {
                //Complete function...
                storage.ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //Post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })


                        setProgress(0)
                        setCaption('')
                        setImage(null)
                    })
            }
        )
    }

    const changeFile = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    return (
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max={100}/>
            <input
                type="text"
                placeholder="Enter a caption..."
                value={caption}
                name="caption"
                onChange={changeCaption}
            />
            <input type="file"
                   onChange={changeFile}
            />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    );
};

export default ImageUpload;
