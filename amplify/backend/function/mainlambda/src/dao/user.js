

const UserDao = {


    // add user to table
    async addUser(alias, name, fileurl, callback) {

        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

        const params = {
            TableName: "users",
            Item: {
                "alias": alias,
                "name": name,
                "fileurl": fileurl
            }
        };

        return dynamoDb.put(params, callback);
    },

    // get user from table
    getUser(alias, callback) {
        
        const AWS = require('aws-sdk');
        const dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });
        
        const params = {
            
            TableName: "users",
            Key: {
                "alias": alias,
            }
        };
        
        console.log(`getting user from db with alias ${alias}`);
        return dynamoDb.get(params, callback);
    }
}




module.exports = {
    dao: UserDao
};
