const simpleQ = {

    addStatus(qalias, qname, qfileurl, qstatus, qattachment, qtimestamp, callback) {
        const AWS = require('aws-sdk');
        const sqs = new AWS.SQS({ region: 'us-west-2' });

        var params = {
            MessageBody: JSON.stringify({
                "alias": qalias,
                "name": qname,
                "fileurl": qfileurl,
                "status": qstatus,
                "attachment": qattachment,
                "timestamp": qtimestamp,
            }),
            QueueUrl: 'https://sqs.us-west-2.amazonaws.com/127738093458/statQ',
            DelaySeconds: 0
        };

        return sqs.sendMessage(params, callback);
    }
}

module.exports = {
    qService: simpleQ
};
