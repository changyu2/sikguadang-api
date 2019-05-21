module.exports = {
  url: 'http://dev-soosooplace.com/',
  cdnURL: 'http://dev-cdna.soosooplace.com/',
  log: {
    level: 'debug',
    accessLogFormat: 'common'
  },
  mongodb: {
    url: 'mongodb+srv://root:123456!@sikguadang-vlvwm.mongodb.net/sikguadang_db'
  },
  // mongodb: { url: 'mongodb://soosoodbuser:fave123123@52.79.131.104:26017/kr_dev_soosoo_db' },
  // redis: {
  //     auth: {
  //         host: '52.79.131.104',
  //         port: 6379,
  //         password: 'faveredis',
  //         database: 1
  //     },
  //     count: {
  //         host: '52.79.131.104',
  //         port: 6379,
  //         password: 'faveredis',
  //         database: 2
  //     },
  //     cache: {
  //         host: '52.79.131.104',
  //         port: 6379,
  //         password: 'faveredis',
  //         database: 3
  //     },
  //     shortener: {
  //         host: '52.79.131.104',
  //         port: 6379,
  //         password: 'faveredis',
  //         database: 4
  //     },
  //     buzzvil: {
  //         host: '52.79.131.104',
  //         port: 6379,
  //         password: 'faveredis',
  //         database: 5
  //     }
  // },
  aws: {
    s3: {
      tempBucket: 'kr-soosoo-dev-temp-01',
      serviceBucket: 'kr-soosoo-dev-01'
    },
    kor: {
      accessKeyId: 'AKIAJ4IEV67LDWB2GDWA',
      secretAccessKey: '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',
      region: 'ap-northeast-1',
      signatureVersion: 'v4',
      maxRetries: 3
    },
    virginia: {
      accessKeyId: 'AKIAJ4IEV67LDWB2GDWA',
      secretAccessKey: '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',
      region: 'us-east-1',
      signatureVersion: 'v4',
      maxRetries: 3
    }
  },
  auth: {
    authSecret: 'auth',
    restoreSecret: 'restore',
    authExpireTime: 86400000, //1day
    restoreExpireTime: 604800000 // 7day
  },
  instagram: {
    clientId: '8d05a320afe64f6e92cac33790bc9026',
    secret: '7d9ac130d5634a3ebf4afea8698a58cc',
    redirectUri: 'http://106.244.236.82:3000/post'
  }
};
