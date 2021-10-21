import React from 'react';
import OnePost from './OnePost';


export default function Main(props) {
  const { allPosts,loadMorePost,isAllPostLoaded,isLoadingMorePost } = props;



  return (
    <div className="container text-light">
      <h1 className="mt-4 ">All Posts:</h1>
      <div className="row">
        {allPosts && allPosts.map((post, key) => {
          return (
            <div className="col-xl-4 col-lg-6 mb-4" key={key} >
              <OnePost post={post} />
            </div>
          )
        })}


        {allPosts&& <div className="col-12 text-center mt-2 mb-5">
          <button onClick={loadMorePost} disabled={isAllPostLoaded || isLoadingMorePost} className="btn btn-primary">{isLoadingMorePost&&<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>}
            {isAllPostLoaded?'All Post Loaded':'Load More...'}</button> 
          </div>
          }

      </div>
    </div>

  )
}

