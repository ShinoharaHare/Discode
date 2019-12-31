const error = {
    // 未知
    UnknownError: '未知的錯誤',
    // token
    TokenNotValidError: '無效的Token',
    TokenNotProvidedError: '未提供Token',
    TokenExpiredError: '過期的Token',
    // 登入
    UserNotFoundError: '找不到此用戶',
    PasswordIncorrectError: '密碼錯誤',
    // 註冊
    UsernameDuplicateError: '用戶名已存在'
};

var _code = 0;
for (let name in error) {
    error[name] = {
        code: _code++,
        name: name,
        msg: error[name]
    }
}

module.exports = error;