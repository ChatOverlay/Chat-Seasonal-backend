const jwt = require('jsonwebtoken');

//클라톡 데스크탑 앱 로그인 토큰
const DesktopAppAuthenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
  
    if (token == null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
  
      // 여기에서 User 데이터베이스를 조회
      const user = await AdminUser.findById(decoded.id);
      if (!user) {
        return res.sendStatus(404);
      }
  
      // req.user에 사용자 정보를 추가
      req.user = user;
      next();
    });
  };
  