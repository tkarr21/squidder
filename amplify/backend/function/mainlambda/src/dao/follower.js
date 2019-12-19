

const FollowerDao = {

    addFollower(alias, subject, callback) {

        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

        
        const params = {
            TableName: 'follower',
            Item: {
                "alias": subject,
                "subject": alias
            }
        }

        return dynamoDb.put(params, callback);
    },

    getFollower(alias, key, callback) {
        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

        let params = {
            TableName: 'follower',
            //IndexName: 'YOUR INDEX NAME HERE', //IF YOUR CREATED NEW INDEX
            KeyConditionExpression: "alias = :alias", //YOUR PRIMARY KEY
            ProjectionExpression: "subject",
            ExpressionAttributeValues: {
                ":alias": alias,
            },
            Limit: 10000 //DataPerReq
        }

        if (key != "") {
            //Pagination - LastEvaluatedKeyPair
            let qkey = { "alias": alias, "subject": key }
            console.log(`paginating with key,`, qkey);
            params.ExclusiveStartKey = qkey;
        }


        return dynamoDb.query(params, callback);
    }, 

    getFollowing(subject, key, callback) {
        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

        let params = {
            TableName: 'follower',
            IndexName: 'subject-alias-index', //IF YOUR CREATED NEW INDEX
            KeyConditionExpression: "subject = :subject", //YOUR PRIMARY KEY
            ProjectionExpression: "alias",
            ExpressionAttributeValues: {
                ":subject": subject,
            },
            Limit: 1//DataPerReq
        }

        if (key!= "") {
            //Pagination - LastEvaluatedKeyPair
            let qkey = { "subject": subject, "alias": key }
            console.log(`paginating with key,`, qkey);
            params.ExclusiveStartKey = qkey;
        }


        return dynamoDb.query(params, callback);
    },

    endFollower(alias, subject, callback) {
        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

        let params = {
            TableName: 'follower',
            Key: {
                "alias": alias,
                "subject": subject
            }
        }

        return dynamoDb.delete(params, callback);
    },

    checkFollower(alias, subject, callback) {
        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });


        let params = {
            TableName: 'follower',
            KeyConditionExpression: 'alias = :alias and subject = :subject',
            ExpressionAttributeValues: {
                ':alias': alias,
                ':subject': subject 
            }
        };

        return dynamoDb.query(params, callback);
    }
}

module.exports = {
    dao: FollowerDao
};
