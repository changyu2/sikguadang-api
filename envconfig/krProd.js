module.exports = {
    url: 'https://soosooplace.com/',
    cdnURL: 'https://cdna.soosooplace.com/',
    log: {
        level: 'info',
        accessLogFormat: 'common'

    },
    mongodb: { url: 'mongodb://soosoodbuser:%23JStn3827@13.209.17.116:20815/kr_prod_soosoo_db' },
    redis: {
        auth: {
            host: '172.31.23.27',
            port: 6379,
            password: 'faveredis08!%',
            database: 1
        },
        count: {
            host: '172.31.23.27',
            port: 6379,
            password: 'faveredis08!%',
            database: 2
        },
        cache: {
            host: '172.31.23.27',
            port: 6379,
            password: 'faveredis08!%',
            database: 3
        },
        shortener: {
            host: '172.31.23.27',
            port: 6379,
            password: 'faveredis08!%',
            database: 4
        },
        buzzvil: {
            host: '172.31.23.27',
            port: 6379,
            password: 'faveredis08!%',
            database: 5
        }
    },
    aws: {
        s3: {
            tempBucket: 'kr-prod-soosoo-temp-01',
            serviceBucket: 'kr-prod-soosoo-01'
        },
        kor: {
            accessKeyId: 'AKIAI4CUZTE5J3IJQ5AQ',
            secretAccessKey: '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',
            region: "ap-northeast-1",
            signatureVersion: 'v4',
            maxRetries: 3
        },
        virginia: {
            accessKeyId: 'AKIAI4CUZTE5J3IJQ5AQ',
            secretAccessKey: '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',
            region: "us-east-1",
            signatureVersion: 'v4',
            maxRetries: 3
        }
    },
    auth: {
        authSecret: "moment",
        restoreSecret: "mesmerized",
        authExpireTime: 86400000,
        restoreExpireTime: 604800000
    },
};
