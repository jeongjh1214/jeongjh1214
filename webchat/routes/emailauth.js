router.get("/emailauth", function(req, res, next){
  let email = req.query.email;
  let authcode = req.query.authcode;

  // token이 일치하면 테이블에서 email을 찾아 회원가입 승인 로직 구현
})

