import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route, HashRouter
} from "react-router-dom";


import Web3 from 'web3';
import OurSocialMediaJson from './abis/OurSocialMedia.json'

import { OSMcontext } from './OSMcontext';

import "bootstrap-icons/font/bootstrap-icons.css"
import './css/App.css';
import './css/Toast.css';

import Navbar from './components/Navbar'
import Main from './components/Main'
import CreateAccount from './pages/CreateAccount';
import NotConnected from './pages/NotConnected';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import TopFollowTo from './components/TopFollowTo';
import PostOf from './components/PostOf';


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
  }

  async loadWeb3() {

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);

      this.loadBlockchainData()
    } else {
      this.setState({ connected: false })
    }

  }

  async loadBlockchainData() {
    const web3 = new Web3(window.ethereum);

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    web3.eth.defaultAccount = accounts[0];
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    const ourSocialMediaData = OurSocialMediaJson.networks[networkId]

    if (ourSocialMediaData) {
      const ourSocialMedia = web3.eth.Contract(OurSocialMediaJson.abi, ourSocialMediaData.address);
      this.setState({ ourSocialMedia })

      const isAccountCreated = await ourSocialMedia.methods.isAccountCreatedOf(account).call();
      this.setState({ isAccountCreated })

      await this.loadAllPosts();

      if (isAccountCreated) {
        await this.loadProfile();
        await this.loadAllFollow();
      }

      this.setState({ loading: false })

    } else {
      this.setState({ connected: false })
    }
  }

  async loadProfile() {
    const userProfile = await this.state.ourSocialMedia.methods.profileOf(this.state.account).call();
    this.setState({ userProfile });
  }

  async loadAllPosts() {
    const totalPostsCount = await this.state.ourSocialMedia.methods.totalPosts().call();
    this.setState({ totalPostsCount: totalPostsCount.toNumber() });

    let postToLoad;
    let totalLoadedPostsCount;

    if (totalPostsCount <= this.state.everyTimeLoadPostCount) {
      postToLoad = 1;
      totalLoadedPostsCount = totalPostsCount;
    } else {
      postToLoad = totalPostsCount - (this.state.everyTimeLoadPostCount - 1);
      totalLoadedPostsCount = this.state.everyTimeLoadPostCount;

    }

    for (var i = totalPostsCount; i >= postToLoad; i--) {
      let post = await this.state.ourSocialMedia.methods.allPosts(i).call();
      this.setState({
        allPosts: [...this.state.allPosts, post]  // it can add posts in array
      })
    }

    this.setState({ totalLoadedPostsCount })
  }

  async loadMorePost() {

    if (this.state.totalPostsCount <= this.state.totalLoadedPostsCount) {
      this.setState({ isAllPostLoaded: true });
      return;
    }
    this.setState({ isLoadingMorePost: true });
    let postToLoad;

    if (this.state.totalPostsCount <= this.state.everyTimeLoadPostCount + this.state.totalLoadedPostsCount) {
      postToLoad = 1;
    } else {
      postToLoad = this.state.totalPostsCount - (this.state.everyTimeLoadPostCount + this.state.totalLoadedPostsCount - 1);
    }

    for (var i = this.state.totalPostsCount - this.state.totalLoadedPostsCount; i >= postToLoad; i--) {
      let post = await this.state.ourSocialMedia.methods.allPosts(i).call();
      this.setState({
        allPosts: [...this.state.allPosts, post]  // it can add posts in array
      })
    }

    this.setState({ isLoadingMorePost: false });
    this.setState({ totalLoadedPostsCount: this.state.everyTimeLoadPostCount + this.state.totalLoadedPostsCount })


  }

  async loadAllFollow() {

    const followCount = await this.state.ourSocialMedia.methods.totalFollowCountOfUser(this.state.account).call();

    for (var i = 0; i < followCount; i++) {
      let follow = await this.state.ourSocialMedia.methods.userFollowTo(this.state.account, i).call();
      this.setState({
        allFollow: [...this.state.allFollow, follow]
      })
    }
  }


  async createAccount(_name, _userID) {
    this.setState({ loading: true })

    this.state.ourSocialMedia.methods.createAccount(_name, _userID)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('receipt', (receipt) => {
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        this.setState({ isAccountCreated: true })
        this.loadProfile();
        window.location.replace("/");

      })
      .on('error', (error, receipt) => {
        this.launch_toast(error.message);
        this.setState({ loading: false })
        console.log('error', error)
        console.log('receipt', receipt)
      });

  }

  async createPost(_content, _media) {
    this.setState({ loading: true })

    this.state.ourSocialMedia.methods.createPost(_content, _media)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('receipt', (receipt) => {
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log(receipt);
        window.location.replace("/");
      })
      .on('error', (error, receipt) => {
        this.launch_toast(error.message);
        console.log('error', error)
        console.log('receipt', receipt)

        this.setState({ loading: false })

      });
  }



  async tipPost(_id, tipAmount) {

    this.setState({ loading: true })

    this.state.ourSocialMedia.methods.tipPost(_id)
      .send({ from: this.state.account, value: tipAmount * 10 ** 18 })
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('receipt', (receipt) => {
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        window.location.replace("/");
      })
      .on('error', (error, receipt) => {
        this.launch_toast(error.message);
        console.log('error', error)
        console.log('receipt', receipt)
      });

  }

  async follow(_address) {

    this.setState({ loading: true })

    this.state.ourSocialMedia.methods.follow(_address)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        console.log('transactionHash', hash);
      })
      .on('receipt', (receipt) => {
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        window.location.replace("/");
      })
      .on('error', (error, receipt) => {
        this.launch_toast(error.message);
        console.log('error', error)
        console.log('receipt', receipt)
      });

  }

  async isFollowedByUser(_address) {

    for (let i = 0; i < this.state.allFollow.length; i++) {
      if (this.state.allFollow[i] === _address) {
        return true
      }
    }
    return false;
  }

  async launch_toast(_msg) {
    var _toast_text = document.getElementById("toast_text")
    _toast_text.innerText = _msg;

    var x = document.getElementById("toast")
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 5000);

  }



  constructor(props) {
    super(props)
    this.state = {
      account: '',
      userProfile: null,
      isAccountCreated: true,
      ourSocialMedia: null,
      totalPostsCount: 0,
      totalLoadedPostsCount: 0,
      everyTimeLoadPostCount: 3,
      isLoadingMorePost: false,
      isAllPostLoaded: false,
      maxCharctersInPost: 420,
      maxCharctersInComment: 220,
      allPosts: [],
      allFollow: [],
      loading: true,
      connected: true
    }
    this.createAccount = this.createAccount.bind(this)
    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
    this.follow = this.follow.bind(this)
    this.isFollowedByUser = this.isFollowedByUser.bind(this)
    this.loadMorePost = this.loadMorePost.bind(this)
  }


  render() {
    return (
      // <Router>
<HashRouter>
        <OSMcontext.Provider value={{
          account: this.state.account,
          ourSocialMedia: this.state.ourSocialMedia,
          isAccountCreated: this.state.isAccountCreated,
          everyTimeLoadPostCount: this.state.everyTimeLoadPostCount,
          maxCharctersInPost: this.state.maxCharctersInPost,
          maxCharctersInComment: this.state.maxCharctersInComment,
          isFollowedByUser: this.isFollowedByUser,
          tipPost: this.tipPost,
          follow: this.follow
        }}>
          <div className="" >
            {this.state.connected
              ?
              <>
                <Navbar userProfile={this.state.userProfile} />
                {this.state.loading
                  ?
                  <div className="text-center m-5" >
                    <div className="spinner-border bg-light m-auto" role="status">
                    </div>
                  </div>
                  :
                  <Switch>
                    <Route path="/" exact>
                      <TopFollowTo allFollow={this.state.allFollow} />
                      <Main allPosts={this.state.allPosts} loadMorePost={this.loadMorePost} isAllPostLoaded={this.state.isAllPostLoaded} isLoadingMorePost={this.state.isLoadingMorePost} />
                    </Route>
                    <Route path="/postsOf/:userid" exact>
                      <TopFollowTo allFollow={this.state.allFollow} />
                      <PostOf />
                    </Route>
                    <Route path="/createPost" exact>
                      {this.state.isAccountCreated
                        ?
                        <CreatePost createPost={this.createPost} />
                        :
                        <>
                          <div class="mx-5 alert alert-warning" role="alert">
                            Please First Create Account!
                          </div>
                          <CreateAccount createAccount={this.createAccount} />
                        </>
                      }
                    </Route>
                    <Route path="/profile/:userid" exact>
                      <Profile />
                    </Route>
                    <Route path="/createProfile" exact>
                      {this.state.isAccountCreated
                        ?
                        <>
                          <div class="mx-5 alert alert-success" role="alert">
                            Your Profile is already created!
                          </div>
                          <TopFollowTo allFollow={this.state.allFollow} />
                          <Main allPosts={this.state.allPosts} loadMorePost={this.loadMorePost} isAllPostLoaded={this.state.isAllPostLoaded} isLoadingMorePost={this.state.isLoadingMorePost} />
                        </>
                        :
                        <CreateAccount createAccount={this.createAccount} />
                      }
                    </Route>
                  </Switch>
                }

                <div id="toast"><div id="toast_img">Icon</div><div id="toast_text"></div></div>
              </>
              :
              <NotConnected />
            }
          </div>
        </OSMcontext.Provider>
      {/* </Router> */}
      </HashRouter>
    );
  }
}

export default App;
