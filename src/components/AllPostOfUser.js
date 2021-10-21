import React, { useContext, useEffect, useState } from 'react'
import OnePost from './OnePost';
import "../css/OneChat.css"
import { OSMcontext } from '../OSMcontext';


export default function AllPostOfUser(props) {

    const {userid} = props;

    const [usertotalpostCount, setUsertotalpostCount] = useState();
    const [totalLoadedPostsCount, setTotalLoadedPostsCount] = useState(0);
    const [isLoadingMorePost, setIsLoadingMorePost] = useState(false);
    const [isAllPostLoaded, setIsAllPostLoaded] = useState(false);
    const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);

    const [userPosts, setUserPosts] = useState([]);


    const { ourSocialMedia, everyTimeLoadPostCount } = useContext(OSMcontext);




    useEffect(() => {
        setUserPosts([])
        loadAllPost();
    }, [userid]);

    const loadAllPost = async () => {
        const usertotalpostCount0 = await ourSocialMedia.methods.totalPostsCountOfUser(userid).call();
        console.log('aaaaaaaaaaaaa',usertotalpostCount0.toNumber())
        await setUsertotalpostCount(usertotalpostCount0.toNumber());
        
        if(usertotalpostCount0.toNumber()>0){


        let postToLoad;
        if (usertotalpostCount0.toNumber() <= everyTimeLoadPostCount) {
            postToLoad = 1;
            setTotalLoadedPostsCount(usertotalpostCount);
        } else {
            postToLoad = usertotalpostCount0.toNumber() - (everyTimeLoadPostCount - 1);
            setTotalLoadedPostsCount(everyTimeLoadPostCount);
        }
        let posts0 = []
        for (var i = usertotalpostCount0.toNumber(); i >= postToLoad; i--) {
            let postid = await ourSocialMedia.methods.postsOf(userid, i - 1).call()
            let post = await ourSocialMedia.methods.allPosts(postid.toNumber()).call();
            posts0.push(post);
        }
        setUserPosts(posts0);

            setShowLoadMoreButton(true);
        } 
    }
    const loadMorePost = async () => {

        if (usertotalpostCount <= totalLoadedPostsCount) {
            setIsAllPostLoaded(true);
            return;
        }
        setIsLoadingMorePost(true);

        let postToLoad;

        if (usertotalpostCount <= everyTimeLoadPostCount + totalLoadedPostsCount) {
            postToLoad = 1;
        } else {
            postToLoad = usertotalpostCount - (everyTimeLoadPostCount + totalLoadedPostsCount - 1);
        }

        let posts0 = []
        for (var i = usertotalpostCount - totalLoadedPostsCount; i >= postToLoad; i--) {
            let postid = await ourSocialMedia.methods.postsOf(userid, i - 1).call()
            let post = await ourSocialMedia.methods.allPosts(postid.toNumber()).call();
            posts0.push(post);
            setUserPosts(currentUserPost => [...currentUserPost,post] );
        }
        setTotalLoadedPostsCount(everyTimeLoadPostCount + totalLoadedPostsCount )
        setIsLoadingMorePost(false);
    }

    return (
        
            <div className="row">
                {userPosts && userPosts.map((post, key) => {
                    return (
                        <div className="col-xl-4 col-lg-6 mb-4" key={key} >
                            <OnePost post={post} />
                        </div>
                    )
                })}

                {userPosts && 
                showLoadMoreButton &&
                <div className="col-12 text-center mt-2 mb-5">
                    <button onClick={loadMorePost} disabled={isAllPostLoaded || isLoadingMorePost} className="btn btn-primary">{isLoadingMorePost && <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>}
                        {isAllPostLoaded ? 'All Post Loaded' : 'Load More...'}</button>
                </div>
                }
                
                </div>
    )
}
