

const StoryDao = {

    addStory(alias, name, fileurl, content, attachment, timestamp, callback) {

        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

        let params = {
            TableName: 'story',
            Item: {
                "alias": alias,
                "timestamp": timestamp,
                "name": name,
                'fileurl': fileurl,
                'status': content
            }
        }
        if (attachment != null) {
            params.Item.attachment = attachment
        }

        return dynamoDb.put(params, callback);
    },

    getStory(alias, key, callback) {
        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

        let params = {
            TableName: 'story',
            //IndexName: 'YOUR INDEX NAME HERE', //IF YOUR CREATED NEW INDEX
            KeyConditionExpression: "alias = :alias", //YOUR PRIMARY KEY
            ProjectionExpression: "alias, #n, fileurl, #s, attachment",
            ExpressionAttributeNames: {
                "#n": "name",
                "#s": "status"
            },
            ExpressionAttributeValues: {
                ":alias": alias,
            },
            ScanIndexForward: false, //DESC ORDER, Set 'true' if u want asc order 
            Limit: 1//DataPerReq
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
    dao: StoryDao
};
