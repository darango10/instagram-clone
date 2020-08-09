import React from 'react';
import '../styles/post.css'
import Avatar from "@material-ui/core/Avatar";

const Post = ({imageUrl,username,caption,}) => {
    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt="Daniel Arango"
                />

                <h3>{username}</h3>
            </div>

            <img
                className="post__image"
                src={imageUrl}
                alt="post"
            />
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
        </div>
    );
};

export default Post;
