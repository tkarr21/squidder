

const FeedDao = {

    addFeed(alias, subject, name, fileurl, content, attachment, timestamp, callback) {
        
        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

        let params = {
            TableName: 'feed',
            Item: {
                "alias": alias,
                "timestamp": timestamp,
                "subject": subject,
                "name": name,
                'fileurl': fileurl,
                'status': content
            }
        }
        if (attachment != null) {
            params.Item.attachment = attachment;
        }
        
        return dynamoDb.put(params, callback);
    },

    getFeed(alias, key, callback) {
        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

        let params = {
            TableName: 'feed',
            //IndexName: 'YOUR INDEX NAME HERE', //IF YOUR CREATED NEW INDEX
            KeyConditionExpression: "alias = :alias", //YOUR PRIMARY KEY
            ProjectionExpression: "subject, #n, fileurl, #s, attachment",
            ExpressionAttributeNames: {
                "#n": "name",
                "#s": "status"
            },
            ExpressionAttributeValues: {
                ":alias": alias,
            },
            ScanIndexForward: false, //DESC ORDER, Set 'true' if u want asc order 
            Limit: 1 //DataPerReq
        }

        if (key != "") {
            //Pagination - LastEvaluatedKeyPair
            let qkey = { "alias": alias, "timestamp": parseInt(key) }
            console.log(`paginating with key,`, qkey);
            params.ExclusiveStartKey = qkey;
        }
        
        return dynamoDb.query(params, callback);
    }
}


module.exports = {
    dao: FeedDao
};
