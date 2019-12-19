

const TaggingDao = {

    addTagging(hashtag, alias, name, fileurl, content, attachment, timestamp, callback) {

        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

        let params = {
            TableName: 'tagging',
            Item: {
                "hashtag": hashtag,
                "timestamp": timestamp,
                "alias": alias,
                "name": name,
                "fileurl": fileurl,
                "status": content,
            }
        }
        if (attachment != null) {
            params.Item.attachment = attachment
        }

        return dynamoDb.put(params, callback);
    },


    getTagging(hashtag, key, callback) {
        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

        let params = {
            TableName: 'tagging',
            //IndexName: 'YOUR INDEX NAME HERE', //IF YOUR CREATED NEW INDEX
            KeyConditionExpression: "hashtag = :hashtag", //YOUR PRIMARY KEY
            ProjectionExpression: "alias, #n, fileurl, #s, attachment",
            ExpressionAttributeNames: {
                "#n": "name",
                "#s": "status"
            },
            ExpressionAttributeValues: {
                ":hashtag": hashtag,
            },
            ScanIndexForward: false, //DESC ORDER, Set 'true' if u want asc order 
            Limit: 1//DataPerReq
        }

        if (key != "") {
            //Pagination - LastEvaluatedKeyPair
            let qkey = { "hashtag": hashtag, "timestamp": parseInt(key) }
            console.log(`paginating with key,`, qkey);
            params.ExclusiveStartKey = qkey;
        }

        return dynamoDb.query(params, callback);
    }
}

module.exports = {
    dao: TaggingDao
};

