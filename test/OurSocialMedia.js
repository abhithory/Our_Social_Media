const { assert } = require('chai');

const OurSocialMedia = artifacts.require("OurSocialMedia");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Our Social Media', ([account1, account2, account3]) => {
    let ourSocialMedia;
    before(async () => {
        ourSocialMedia = await OurSocialMedia.deployed();
    })

    describe('test deployment', async () => {
        it('deploys successfully', async () => {
            const address = await ourSocialMedia.address;
            const contractName = await ourSocialMedia.contractName();

            assert.equal(contractName, "Our Social Media (OSM)");
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
    })

    describe('test account creation', async () => {
        it('created accounted succefully', async () => {

            const checkAccount1 = await ourSocialMedia.isAccountCreatedOf(account1);
            assert.equal(checkAccount1, false);

            await ourSocialMedia.createAccount('shekhar', 'idshekhar');

            const checkAccount1After = await ourSocialMedia.isAccountCreatedOf(account1);
            assert.equal(checkAccount1After, true);

            //user id already exist
            await ourSocialMedia.createAccount('shekhar01', 'idshekhar', { from: account2 }).should.be.rejected;
            await ourSocialMedia.createAccount('shekhar01', 'idshekhar0').should.be.rejected;

            await ourSocialMedia.createAccount('shekhar2', 'idshekhar2', { from: account2 });
            await ourSocialMedia.createAccount('shekhar3', 'idshekhar3', { from: account3 });

            await ourSocialMedia.createAccount('shekhar2', 'idshekhar2', { from: account2 }).should.be.rejected;
            await ourSocialMedia.createAccount('shekhar2', 'idshekhar22', { from: account2 }).should.be.rejected;
            await ourSocialMedia.createAccount('shekhar3', 'idshekhar3', { from: account3 }).should.be.rejected;
            await ourSocialMedia.createAccount('shekhar3', 'idshekhar33', { from: account3 }).should.be.rejected;

        })

        it('get user data succefully', async () => {
            const user = await ourSocialMedia.profileOf(account1);
            const user2 = await ourSocialMedia.profileOf(account2);
            const user3 = await ourSocialMedia.profileOf(account3);

            assert.equal(user.name, 'shekhar');
            assert.equal(user.userid, 'idshekhar');
            assert.equal(user2.name, 'shekhar2');
            assert.equal(user2.userid, 'idshekhar2');
            assert.equal(user3.name, 'shekhar3');
            assert.equal(user3.userid, 'idshekhar3');
        })
    })

    describe('check posts follow and tips', async () => {
        it('creating post succefully', async () => {
            const maxContentChar = await ourSocialMedia.maxContentChar();
            const maxCommentChar = await ourSocialMedia.maxCommentChar();
            const totalPosts = await ourSocialMedia.totalPosts();

            assert.equal(maxContentChar, 420);
            assert.equal(maxCommentChar, 220);
            assert.equal(totalPosts, 0);

            await ourSocialMedia.createPost("this is first post content", "");

            const totalPostsAfter = await ourSocialMedia.totalPosts();
            assert.equal(totalPostsAfter, 1);

            const post1 = await ourSocialMedia.allPosts(1);
            const userPostCount = await ourSocialMedia.totalPostsCountOfUser(account1);
            const userPostCount2 = await ourSocialMedia.totalPostsCountOfUser(account2);
            const userPostId = await ourSocialMedia.postsOf(account1, userPostCount - 1);

            assert.equal(post1.id, 1);
            assert.equal(post1.content, 'this is first post content');
            assert.equal(post1.tipAmount, 0);
            assert.equal(post1.author, account1);
            assert.equal(userPostCount, 1);
            assert.equal(userPostCount2, 0);
            assert.equal(userPostId, 1);

            await ourSocialMedia.createPost("", "").should.be.rejected;
            await ourSocialMedia.createPost("", "this is url of media");

        })

        it('tip post succefully', async () => {
            const post1 = await ourSocialMedia.allPosts(1);
            assert.equal(post1.tipAmount, 0);

            await ourSocialMedia.tipPost(1,{from:account2,value:10**17}); // 10**18 = 1eth

            const post1After = await ourSocialMedia.allPosts(1);
            // assert.equal(post1After.tipAmount.toNumber(),2*10**18);
        })

        it('succefully comment on post',async () => {
            const totalComments0 = await ourSocialMedia.commentCountOfPost(1);
            assert.equal(totalComments0, 0);

            await ourSocialMedia.commentOnPost(1,'this is comment by accoun2',{from:account2}); 
            await ourSocialMedia.commentOnPost(1,'',{from:account2}).should.be.rejected; 
            await ourSocialMedia.commentOnPost(12,'aa',{from:account2}).should.be.rejected; 

            const totalComments = await ourSocialMedia.commentCountOfPost(1);
            const commentOnPost = await ourSocialMedia.commentsOf(1,totalComments-1);

            assert.equal(totalComments, 1);
            assert.equal(commentOnPost.comment, 'this is comment by accoun2');
            assert.equal(commentOnPost.by, account2);

        })

        it('succefully follow',async () => {
            const followCount = await ourSocialMedia.totalFollowCountOfUser(account2);
            assert.equal(followCount, 0);
            
            await ourSocialMedia.follow(account1,{from:account2}); 

            const followCountAfter = await ourSocialMedia.totalFollowCountOfUser(account2);
            const userFollowTo = await ourSocialMedia.userFollowTo(account2,followCountAfter-1);

            assert.equal(followCountAfter, 1);
            assert.equal(userFollowTo, account1);

        })
    })



})