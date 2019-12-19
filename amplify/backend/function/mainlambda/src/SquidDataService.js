
const AWS = require('aws-sdk');
const express = require('express');

const router = express.Router();


// require the daos
const user = require('./dao/user.js');
const userDao = user.dao;

const follower = require('./dao/follower.js');
const followerDao = follower.dao;

const feed = require('./dao/feed.js');
const feedDao = feed.dao;

const story = require('./dao/story.js');
const storyDao = story.dao;

const tagging = require('./dao/tagging.js');
const taggingDao = tagging.dao;

const queue = require('./queue/sqs');
const queueService = queue.qService



/** User table services 
 * 
*/


//register
router.post('/register', (req, res) => {
    
    // call dao to check if alias is taken already
    userDao.getUser(req.body.alias, (err, data) => {

        if (data.Item) {

            //return deny if alias has been taken already
            res.status(403).json({ error: 'the alias has already been taken' });
        }
        else if (err) {
            res.status(400).json({ error: 'in register, checking for alias availability' });
        }
        else {
            //add the user to the table
            userDao.addUser(req.body.alias, req.body.name, req.body.fileurl, (error) => {
                
                if (error) {
                    res.status(500).json({ error: 'Could not create User' });
                }

                // success
                res.status(200).json({ message: 'success: created user' });
            });
        }
    });     
});


// login
router.post('/login', (req, res) => {
    
    //use dao to make request
    userDao.getUser(req.body.alias, (err, data) => {
        console.log(err, data);

        if (data.Item) {
            res.status(200).json({
                alias: data.Item.alias,
                name: data.Item.name,
                fileurl: data.Item.fileurl
            });
        }
        else {
            res.status(400).json({
                error: "The alias or password is wrong."
            });
        }
    });     
});


//get a user
router.get('/user', (req, res) => {
    const alias = req.apiGateway.event.queryStringParameters.alias;
    
    //use dao to make request
    userDao.getUser(alias, (err, data) => {
        console.log(err, data);

        if (data.Item) {
            res.status(200).json({
                alias: data.Item.alias,
                name: data.Item.name,
                fileurl: data.Item.fileurl
            });
        }
        else {
            res.status(400).json({
                error: "user not found"
            });
        }
    });
});





/** feed table services
 * 
 */

//get feed
router.get('/feed', (req, res) => {

    // get params from query string
    const alias = req.apiGateway.event.queryStringParameters.alias;
    const key = req.apiGateway.event.queryStringParameters.key;
    
    
    // call dao for data
    feedDao.getFeed(alias, key, (err, data) => {
        console.log(err, data);
        if (data.Items) {

            //check key for pagination
            let newkey = null;
            if (data.LastEvaluatedKey) {
                newkey = data.LastEvaluatedKey.timestamp;
            }

            res.status(200).json({
                status: data.Items,
                key: newkey
            });
        }
        else {
            res.status(404).send({ error: `The feed for the alias: ${alias} was not found` });
        }
    });
});




/** story table services
 * 
 */

//get story
router.get('/story', (req, res) => {

    // get params from query string
    const alias = req.apiGateway.event.queryStringParameters.alias;
    const key = req.apiGateway.event.queryStringParameters.key;


    // call dao for data
    storyDao.getStory(alias, key, (err, data) => {
        console.log(err, data);
        if (data.Items) {

            //check key for pagination
            let newkey = null;
            if (data.LastEvaluatedKey) {
                newkey = data.LastEvaluatedKey.timestamp;
            }

            res.status(200).json({
                status: data.Items,
                key: newkey
            });
        }
        else {
            res.status(404).send({ error: `The stort for the alias: ${alias} was not found` });
        }
    });
});





/** tagging table services
 * 
*/

//get tagging
router.get('/tagging', (req, res) => {

    //alias bc of paginparams() (it is the tag that is being sent)
    const tag = req.apiGateway.event.queryStringParameters.alias;
    const key = req.apiGateway.event.queryStringParameters.key;
    
    // call dao for data
    taggingDao.getTagging(tag, key, (err, data) => {
        console.log(err, data);
        if (data.Items) {

            //check key for pagination
            let newkey = null;
            if (data.LastEvaluatedKey) {
                newkey = data.LastEvaluatedKey.timestamp;
            }

            res.status(200).json({
                status: data.Items,
                key: newkey
            });
        }
        else {
            res.status(404).send({ error: `The tagging for tag: ${tag} was not found` });
        }
    });
});






/** follower table services 
 * 
*/

//get followers
router.get('/follower', (req, res) => {

    // get params from query string
    const alias = req.apiGateway.event.queryStringParameters.alias;
    const key = req.apiGateway.event.queryStringParameters.key;

    // call dao for data
    followerDao.getFollower(alias, key , (err, data) => {
        console.log(err, data);

        if (data.Items) {

            //check key for pagination
            let newkey = null;
            if (data.LastEvaluatedKey) {
                newkey = data.LastEvaluatedKey.subject;
            }

            res.status(200).json({
                follower: data.Items,
                key: newkey
            });
        }
        else {
            res.status(404).send({ error: `The followers of alias: ${alias} was not found` });
        }
    });
});



//get who you're following
router.get('/following', (req, res) => {
    
    // get params from query string
    const alias = req.apiGateway.event.queryStringParameters.alias;
    const key = req.apiGateway.event.queryStringParameters.key;

    
    // call dao for data
    followerDao.getFollowing(alias, key, (err, data) => {

        console.log(err, data);
        if (data.Items) {

            //check key for pagination
            let newkey = null;
            if (data.LastEvaluatedKey) {
                newkey = data.LastEvaluatedKey.alias;
            }

            res.status(200).json({
                following: data.Items,
                key: newkey
            });
        }
        else {
            res.status(404).send({ error: `The followings of alias: ${alias} was not found` });
        }
    });
});



//follow someone
router.post('/follower', async (req, res) => {

    // get params from request
    const alias = req.body.alias;
    const subject = req.body.subject;

    //check if following already 
    checkFollower = await followerDao.checkFollower(alias, subject, (err, data) => {
        console.log('checkFollower');
        console.log(err, data);
    }).promise();

    if (checkFollower.Items.length != 0) {
        res.status(400).json({
            error: `already following ${subject}`
        });
    }
    else {
        //add the follow
        followerDao.addFollower(alias, subject, (error) => {
            console.log(error);
            if (error) {
                res.status(400).json({
                    error: `failed to follow ${subject}`
                });
            }

            res.status(200).json({message: `${alias} follow ${subject} successful`});
        });
    }
});

//stop following someone
router.delete('/follower', async (req, res) => {

    const alias = req.body.alias;
    const subject = req.body.subject;

    //check if following already 
    checkFollower = await followerDao.checkFollower(subject, alias, (err, data) => {
        console.log('checkFollower');
        console.log(err, data);
    }).promise();

    if (checkFollower.Items.length == 0) {
        res.status(400).json({
            error: `already not following user ${subject}`
        });
    }
    else {
        //remove the follow
        followerDao.endFollower(subject, alias, (error) => {
            console.log(error);
            if (error) {
                res.status(400).json({
                    error: 'failed to follow'
                });
            }

            res.status(200).json({ message: `${alias} endfollow ${subject} successful` });
        });
    }
});





/** status service that accesses all tables when a new status is created
 * 
 * 1. add to story of user
 * 2. add to tagging (if any)
 * 3. get all followers of user
 *   - add to feed of all users
 * 
 */
// make a status
router.post('/status', async (req, res) => {

    //params from body 
    const status = req.body.status;
    const alias = req.body.alias;
    const name = req.body.name;
    const fileurl = req.body.fileurl;
    const timestamp = req.body.timestamp;

    //set attachment 
    let attachment = 'none';
    if (req.body.attachment) {
        attachment = req.body.attachment;
    }

    await queueService.addStatus(alias, name, fileurl, status, attachment, timestamp, (err, data) => {
        console.log(err, data);
        if (err) {
            res.status(500).json({ error: 'failed to push status to queue' });
        }
        else {
            res.status(200).json({ message: 'status post successful' });
        }
    }).promise();


    /*async function asyncFeed(array) {
        for (const item of array) {
            await feedDao.addFeed(item.subject, alias, name, fileurl, status, attachment, timestamp, (err, data) => {
                console.log('feed dao');
                console.log(err, data);
            }).promise();
        }
    }

    async function asyncTag(array) {
        for (const item of array) {
            await taggingDao.addTagging(item, alias, name, fileurl, status, attachment, timestamp, (err, data) => {
                console.log('tagging dao');
                console.log(err, data);
            }).promise();
        }
    }

    try {
        //add to story
        await storyDao.addStory(alias, name, fileurl, status, attachment, timestamp, (err, data) => {
            console.log('storydao');
            console.log(err, data);
        }).promise();

        //feed loop 
        let loopkey = "";
        while (loopkey != 'break') {

            //get followers of alias
            let followers = [];
            followers = await followerDao.getFollower(alias, loopkey, (err, data) => {
                console.log('follower dao');
                console.log(err, data);
            }).promise();

            //add to feed of returned followers
            await asyncFeed(followers.Items);
            loopkey = (followers.LastEvaluatedKey ? followers.LastEvaluatedKey.subject : 'break');

        }

        //get tags (if any)
        tags = [];
        textTokens = status.split(" ");
        textTokens.forEach(el => {
            if (el.charAt(0) == '#') {
                tags.push(el);
            }
        });

        //add to table by tag
        await asyncTag(tags);
        
    } catch (err) {
        console.log('error in /status endpoint', err);
        res.status(500).json({error: "status upload error"})
    }

    res.sendStatus(200);*/
});



module.exports = {
    routes: router
};
