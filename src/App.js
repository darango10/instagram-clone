import React, {useEffect, useState} from 'react';
import './App.css';
import Post from "./components/Post";
import {auth, db} from "./firebase";
import Modal from '@material-ui/core/Modal';
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import ImageUpload from "./components/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [user, setUser] = useState(null);
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                //user has logged in...
                console.log(authUser)
                setUser(authUser);

                if (authUser.displayName) {
                    //don't update username
                } else {
                    return authUser.updateProfile({
                        displayName: values.username
                    })
                }
            } else {
                //user has logged out
                setUser(null)
            }
        });


        return () => {
            //perform some cleanup actions
            unsubscribe();
        }
    }, [user, values.username])

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })))
            // console.log(snapshot.docs[0].data())
        })
    }, []);

    const handleSignUp = (e) => {
        e.preventDefault();

        auth.createUserWithEmailAndPassword(values.email, values.password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: values.username
                })
            })
            .catch(err => alert(err.message))

        setOpen(false)

    }

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    const handleSignIn = e => {
        e.preventDefault()

        auth.signInWithEmailAndPassword(values.email, values.password)
            .catch((err) => alert(err.message))

        setOpenSignIn(false)
    }


    return (
        <div className="app">

            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup" onSubmit={handleSignUp}>
                        <center>
                            <img
                                className="app__headerImage"
                                src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                                alt="Instagram Logo"
                            />
                        </center>
                        <Input
                            placeholder="username"
                            type="text"
                            value={values.username}
                            onChange={handleChange}
                            name="username"
                        />

                        <Input
                            placeholder="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            name="email"
                        />

                        <Input
                            placeholder="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            name="password"
                        />
                        <Button type="submit">Sign Up</Button>
                    </form>

                </div>
            </Modal>

            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup" onSubmit={handleSignIn}>
                        <center>
                            <img
                                className="app__headerImage"
                                src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                                alt="Instagram Logo"
                            />
                        </center>

                        <Input
                            placeholder="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            name="email"
                        />

                        <Input
                            placeholder="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            name="password"
                        />
                        <Button type="submit">Sign In</Button>
                    </form>

                </div>
            </Modal>


            <div className="app__header">
                <img
                    className="app__headerImage"
                    src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt="Instagram Logo"
                />

                {user && <ImageUpload username={user.displayName}/>}

                {user
                    ?
                    <Button onClick={() => auth.signOut()}>Logout</Button>
                    :
                    <div className="app__loginContainer">
                        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        <Button onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>

                }

            </div>

            <div className="app__posts">
                <div className="app__postsLeft">
                    {posts.map(({id, post}) => (
                        <Post
                            key={id}
                            postId={id}
                            imageUrl={post.imageUrl}
                            username={post.username}
                            caption={post.caption}
                            user={user}
                        />
                    ))}
                </div>
                <div className="app__postsRight">
                    <InstagramEmbed
                        url="https://www.instagram.com/p/B_uf9dmAGPw/"
                        maxWidth={320}
                        hideCaptions={false}
                        containerTagName="div"
                        protocol=''
                        injectScript
                        onLoading={() => {
                        }}
                        onSuccess={() => {
                        }}
                        onAfterRender={() => {
                        }}
                        onFailure={() => {
                        }}
                    />
                </div>

            </div>


        </div>
    );
}

export default App;
