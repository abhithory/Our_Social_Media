import React, { useContext, useState } from 'react'



import Identicon from 'identicon.js';

import "../css/Post.css"
import { useHistory } from 'react-router';
import { OSMcontext } from '../OSMcontext';
import { Link } from 'react-router-dom';

export default function OnePost(props) {
    const { post } = props;

    const { tipPost, follow, isFollowedByUser, isAccountCreated, ourSocialMedia, account, maxCharctersInComment } = useContext(OSMcontext);

    const [allCommentsOnPost, setAllCommentsOnPost] = useState([])

    const history = useHistory();

    const timeConverter = (UNIX_timestamp) => {
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hours = a.getHours();
        var minutes = a.getMinutes();

        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;

        var time = date + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes + ' ' + ampm;
        return time;
    }


    const follow0 = () => {

        const addressAuthor = document.getElementById('popUpPostAuthorID').value;
        if (addressAuthor) {
            if (isAccountCreated) {
                follow(addressAuthor)
            } else {
                history.push("/createProfile");
            }
        }
    }

    const tipPost0 = () => {

        const tipAmount = document.getElementById('tipAmountBox').value;
        const postID = document.getElementById('popUpPostId').value;

        if (tipAmount && postID) {
            tipPost(postID, tipAmount)
        }
    }

    const showModel = async () => {
        const popupContent = document.getElementById("popUpContent");
        const popupDate = document.getElementById("popUpDate");
        const popupTip = document.getElementById("popUpTip");
        const popupPostId = document.getElementById("popUpPostId");
        const popupPostAuthorID = document.getElementById("popUpPostAuthorID");
        const popupLinkBox = document.getElementById("popUpLinkBox");
        const popupMainImg = document.getElementById("popUpMainImg");
        const popupImgBox = document.getElementById("popUpImgBox");
        const popupFollowButton = document.getElementById("popUpFollowButton");

        const isFollowed = await isFollowedByUser(post.author);
        if (isFollowed) {
            popupFollowButton.innerText = "Followed"
            popupFollowButton.disabled = isFollowed;
        }

        popupContent.innerText = post.content;
        popupDate.innerText = timeConverter(post.createTime.toNumber());
        popupTip.innerText = `Tip: ${window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} Ether`;
        popupPostId.value = post.id.toNumber();
        popupPostAuthorID.value = post.author;
        popupLinkBox.href = `#/profile/${post.author}`;//this is for hashRoute
        // popupLinkBox.href = `#/profile/${post.author}`;//this is for Route
        if (post.media) {
            popupMainImg.className = "";
            popupMainImg.src = `https://ipfs.infura.io/ipfs/${post.media}`;
        } else {
            popupMainImg.className = "d-none";
        }
        popupImgBox.src = `data:image/png;base64,${new Identicon(post.author, 50).toString()}`;

        var modal = document.getElementById("myModal");

        modal.style.display = "block";

        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
                const commentsDiv = document.getElementById("commentsDiv");
                commentsDiv.className = "d-none"
            }
        }

        //comments

        const commentPostId = document.getElementById("commentPostId");
        commentPostId.innerText = post.id.toNumber();

    }

    const commentLoader0 = (_n) => {
        const commentLoader = document.getElementById("commentLoader");
        const commentLoaderContent = document.getElementById("commentLoaderContent");


        if (_n) {
            commentLoader.className = "";
            commentLoaderContent.className = "d-none";

        } else {
            commentLoader.className = "d-none";
            commentLoaderContent.className = "";
        }
    }

    const showComments = async () => {
        const postidForComment = document.getElementById("commentPostId").innerText;


        commentLoader0(true);

        const commentsDiv = document.getElementById("commentsDiv");
        if (commentsDiv.className === "d-none") {
            commentsDiv.className = ""

            await loadComments(postidForComment);
            commentLoader0(false);

        } else {
            commentsDiv.className = "d-none"
            commentLoader0(false);
        }
    }

    const commentOnPost = async () => {
        commentLoader0(true);


        const postidForComment1 = document.getElementById("commentPostId").innerText;
        const commentTextForComment0 = document.getElementById("commentTextBox").value;

        const commentTextForComment = commentTextForComment0.trim();

        if (commentTextForComment) {

            document.getElementById("commentTextBox").value = "";

            await ourSocialMedia.methods.commentOnPost(postidForComment1, commentTextForComment)
                .send({ from: account })
                .on('transactionHash', (hash) => {
                })
                .on('receipt', (receipt) => {
                })
                .on('confirmation', async (confirmationNumber, receipt) => {

                    await loadComments(postidForComment1);
                    commentLoader0(false);

                })
                .on('error', (error, receipt) => {
                    console.log('error', error)
                    console.log('receipt', receipt)

                    commentLoader0(false);

                });
        }

    }

    const loadComments = async (id) => {

        const totalComments = await ourSocialMedia.methods.commentCountOfPost(id).call();
        document.getElementById("commentTotalCount").innerText = "Total Comments: "+totalComments.toNumber();

        let commentsOnPost = [];
        for (var i = totalComments.toNumber(); i >= 1; i--) {
            let oneComment = await ourSocialMedia.methods.commentsOf(id, i - 1).call();
            commentsOnPost.push(oneComment);
        }

        console.log(allCommentsOnPost);
        await setAllCommentsOnPost(commentsOnPost)
        console.log(allCommentsOnPost);

    }

    return (
        <>
            <div onClick={showModel}>
                <div className="card text-white card-has-bg click-col" style={{ backgroundImage: `url(https://ipfs.infura.io/ipfs/${post.media})` }}>
                    <div className="card-img-overlay d-flex flex-column">
                        <div className="card-body">

                            <small className="card-meta mb-2 mr-2">{timeConverter(post.createTime.toNumber())}</small>
                            <h6 className="card-title mt-0 text-white">{post.content}</h6>

                        </div>
                        <div className="card-footer">
                            <div className="media">
                                <img className="mr-3 rounded-circle" src={`data:image/png;base64,${new Identicon(post.author, 50).toString()}`} alt="" style={{ maxWidth: 50 }} />
                                <div className="media-body">
                                    <h6 className="my-0 text-warning">Tip: {window.web3.utils.fromWei(post.tipAmount.toString(), 'Ether')} Ether</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div id="myModal" className="modal">
                <div className="modal-content">
                    <div className="text-center" style={{ borderRadius: 20 }}>
                        <input id="popUpPostId" className="d-none"></input>
                        <img id="popUpMainImg" style={{ maxWidth: '60%', maxHeight: 300, borderRadius: 20 }} alt="" />

                        <div className="mt-2 text-light">
                            <div className="d-flex justify-content-center mt-2">
                                <h6 id="popUpDate" className="text-warning mr-2">1</h6>
                                <h6 id="popUpTip" className="text-warning">1</h6>
                            </div>
                            <h5 id="popUpContent">a</h5>
                        </div>
                        <div className="d-flex justify-content-center mt-2">
                            <input className="d-none" id="popUpPostAuthorID" />
                            <a id="popUpLinkBox" href="/">
                                <img id="popUpImgBox" className="rounded-circle mr-2" src="https://cdn0.iconfinder.com/data/icons/user-pictures/100/male-512.png" alt="\" style={{ maxWidth: 50 }} />
                            </a>

                            <button id="popUpFollowButton" onClick={follow0} className="btn btn-primary mr-2">Follow <i className="bi bi-person-plus"></i></button>

                            <button className="btn btn-outline-warning" type="button" data-bs-toggle="dropdown">Tip <i className="bi bi-cash"></i></button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li> <input type="number" id="tipAmountBox" className="form-control dropdown-item" placeholder="enter amount in ETH" min="0" step=".01" /></li>
                                <li><div className="dropdown-item"><button onClick={tipPost0} className=" btn btn-warning">Tip</button></div></li>

                            </ul>

                        </div>

                        <button onClick={showComments} className="btn btn-outline-primary mt-3 btn-sm"> Comments </button>

                        <div id="commentsDiv" className="d-none mt-5">
                            <h6 id="commentPostId" className="text-warning mr-2 d-none">0</h6>

                            <div className="input-group mb-3">
                                <input type="text" maxLength={maxCharctersInComment} className="form-control" id="commentTextBox" placeholder="type comment here..." />
                                <button onClick={commentOnPost} className="btn btn-outline-primary" type="button">Comment</button>
                            </div>
                            <div className="d-none" id="commentLoader">
                                <span class="spinner-border spinner-border"></span>
                            </div>

                            <div className="" id="commentLoaderContent">
                                <h6 id="commentTotalCount" className="text-end text-warning mr-2">.</h6>
                                {allCommentsOnPost && allCommentsOnPost.map((comment, key) => {
                                    return (
                                        <div className="" key={key} >
                                            <div className="mt-4 d-flex border border-secondary rounded-3 p-2" style={{ overflow: 'auto' }}>
                                                <Link to={`/profile/${comment.by}`}>
                                                    <img src={`data:image/png;base64,${new Identicon(comment.by, 30).toString()}`} alt="" className="rounded-circle mr-2" width="40" height="40" />
                                                </Link>
                                                <p>{comment.comment}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>


    )
}

