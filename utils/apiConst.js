module.exports = {
  authTokenHeader: 'x-sikguadang-token',
  restoreTokenHeader: 'x-sikguadang-restore',
  instagramAccessTokenHeader: 'x-s12-iat',
  instagramUserIdHeader: 'x-s12-iuid',
  defaultProfilePhotoUrl: 'd000/default_profile_photo.jpg',
  defaultUserGender: '1',
  delimiter: {
    colon: ':',
    underscore: '_',
    slash: '/',
    asterisk: '*',
    comma: ',',
    dot: '.'
  },
  redis: {
    key: {
      contentCache: 'content_cache',
      contentCount: 'content_count',
      tmGreetingCache: 'tm_greeting_cache',
      tmAdvertisementCache: 'tm_advertisement_cache'
    },
    hashKey: {
      view: 'view',
      comment: 'comment',
      like: 'like',
      cardLike: 'cardLike'
    },
    expire: {
      contentCacheExpireSec: 600,
      userAuthExpireSec: 604800,
      tmGreetingCacheExpireSec: 60,
      tmAdvertisementCacheExpireSec: 600
    }
  },
  status: {
    active: 'actv',
    delete: 'del'
  },
  userType: {
    author: 'author',
    editor: 'editor',
    normal: 'normal'
  },
  fileMetaCode: {
    userProfilePhoto: 'u000'
  },
  collectionName: {
    user: 'users'
  },
  email: {
    address: {
      noreply: '12101598@nsu.ac.kr'
    },
    subject: {
      passwordReset: '임시 비밀번호 발송 안내'
    },
    html: {
      // auth: '<!DOCTYPE html><html style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; margin: 0; padding: 0;\"><head> <meta name=\"viewport\" content=\"width=device-width\"> <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\"> <title>FAVE</title></head><body bgcolor=\"#fefefe\" style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; -webkit-font-smoothing: antialiased; height: 100%; -webkit-text-size-adjust: none; width: 100% !important; margin: 0; padding: 0;\"> <table class=\"body-wrap\" bgcolor=\"#fefefe\" style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; width: 100%; margin: 0; padding: 0;\"> <tr style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; margin: 0; padding: 0;\"> <td style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; margin: 0; padding: 0;\"> </td><td class=\"container\" bgcolor=\"#FFFFFF\" style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; clear: both !important; display: block !important; max-width: 600px !important; Margin: 0 auto; padding: 40px;\"> <table style=\"border-spacing: 0;\"> <tr> <td style=\"padding: 0;\"> <img style=\"width:100%\" src=\"https://cdna.fave.land/etc0/mail_v2_top_banner.jpg\"/> </td></tr></table> <div class=\"content\" style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; display: block; max-width: 600px; margin: 0 auto; padding: 40px 20px;\"> <table style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; width: 100%; margin: 0; padding: 0;\"> <tr style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; margin: 0; padding: 0;\"> <td style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; margin: 0; padding: 0;\"> <h1 style=\"font-family: \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif; font-size: 24px; line-height: 1.2em; color: #494949; font-weight: 300; margin: 0 0 40px; padding: 0;\">일상의 틈으로 <br/>찾아온 당신에게</h1> <img style=\"width: 15px;\" src=\"https://cdna.fave.land/etc0/mail_v2_icon.png\"/> <h2 style=\"font-family: \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif; font-size: 14px; line-height: 1.4em; color: #494949; font-weight: 200; margin: 40px 0 10px; padding: 0;\"> 본 메일은 회원가입 인증을 확인하는 메일입니다. <br/> 아래의 버튼을 클릭하시면,<br/> 인증절차가 마무리 됩니다.<br/> <br/> 나와 같이 지금을 살아가는 인디라이터 여러분,<br/> 지금 잠깐 틈에서 만나요 :)<br/> </h2> <table class=\"btn-primary\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; width: auto !important; Margin: 40px 0; padding: 0;\"> <tr style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; margin: 0; padding: 0;\"> <td style=\"font-family: \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif; font-size: 14px; line-height: 1.6em; text-align: center; vertical-align: top; margin: 0; padding: 0;\" align=\"center\" valign=\"top\"> <a href=\"soosooemailauthlink\" style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 14px; line-height: 2; color: #494949; display: inline-block; cursor: pointer; font-weight: bold; text-decoration: none; background: #ffffff; margin: 0; padding: 5px 15px; border-color: #a8a8a8; border-style: solid; border-width: 1px;\">메일 인증하기</a> </td></tr></table> </td></tr></table> </div><img style=\"width: 100%; max-width:600px;\" src=\"https://cdna.fave.land/etc0/mail_v2_bottom_banner.jpg\"/> </td><td style=\"font-family: \'Apple SD Gothic Neo\', \'Malgun Gothic\', \'Helvetica Neue\', \'Helvetica\', Helvetica, dotum, sans-serif; font-size: 100%; line-height: 1.6em; margin: 0; padding: 0;\"> </td></tr></table></body></html>',
      passwordReset: `
                <!DOCTYPE html>
                    <html style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', 'Helvetica Neue', 'Helvetica', Helvetica,
                    dotum, sans-serif; font-size: 100%; line-height: 1.6em; margin: 0; padding: 0;">

                        <head>
                            <meta charset="utf-8" />
                            <meta http-equiv="Content-Type" content="text/html">
                            <title>SIKGUADANG</title>
                            <meta name="viewport" content="width=device-width">
                        </head>

                        <body style="margin-top: 40px;">
                            <div style="width: 600px; margin: 0 auto; padding-left: 20px; padding-right: 20px;">
                                <div style="background-color: #E7DDD6; padding-top: 20px; padding-left: 20px; padding-bottom: 20px;">
                                    <p style="margin-bottom: 0; margin-top: 40px; font-size: 1.4rem;">식과당 임시 비밀번호 발송 안내</h1>
                                </div>
                                <div style="padding-left: 20px; padding-right: 20px;">
                                    <p style="margin-top: 40px; margin-bottom: 10px;">안녕하세요, 식과당입니다.</p>
                                    <p style="margin-top: 10px; margin-bottom: 10px;">본 메일은 임시 비밀번호 발송 안내 메일입니다.</p>
                                    <p style="margin-top: 10px; margin-bottom: 10px;">임시 비밀번호는 <strong>TEMPPASSWORD</strong> 입니다.</p>
                                    <p style="margin-top: 10px; margin-bottom: 10px;">로그인 후, 반드시 비밀번호를 변경해주시기 바랍니다. 감사합니다:)</p>

                                </div>
                                <div style="border-top: 1px solid black; margin-left: 20px; margin-right: 20px;">
                                    <p style="margin-top: 25px; margin-bottom: 0;">본 메일은 발신전용 메일입니다.</p>
                                    <p style="margin-top: 10px;">COPYRIGHT © SIKGUADANG.ALL RIGHTS RESERVED.</p>
                                </div>
                            </div>
                        </body>

                    </html>`
    },
    authLink: 'http://dev.soosooplace.com/auth/'
  },
  regex: {
    nickNameReg: /^[\u3131-\u314E\u314F-\u3163\uAC00-\uD7A3_\w]*$/g
  },
  nickNameMaxSize: 15,
  commentMaxSize: 200,
  tmTimestampHeader: 'x-fave-tm-timestamp',
  storyType: {
    drawing: 'drawing',
    wallpaper: 'wallpaper',
    photo: 'photo'
  },
  noticeType: {
    shipping: 'shipping',
    product: 'product',
    event: 'event',
    etc: 'etc'
  }
};
