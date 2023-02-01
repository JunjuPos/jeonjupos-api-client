// common/responseMessage.ts -> response message 가공
code = {
    "0000": "성공",
    "0001": "테스트 실패",
    "0002": "아이디가 일치하지 않습니다.",
    "0003": "비밀번호가 일치하지 않습니다.",
    "8889": "headers에 apikey가 비어있습니다.",
    "8888": "apikey가 위변조 되었습니다.",
    "8887": "headers에 apikey값이 없거나, 요청값이 위변조된 경우",
    "9999": "database 오류",
    // NULL_VALUE: '필요한 값이 없습니다.',
    // NOT_FOUND: '존재하지 않는 자원',
    // BAD_REQUEST: '잘못된 요청',
    // INTERNAL_SERVER_ERROR: '서버 내부 오류',
    //
    // // 포스팅 조회
    // READ_POST_SUCCESS: '포스팅 조회 성공',
    // CREATE_POST_SUCCESS: '포스팅 생성 성공',
    // DELETE_POST_SUCCESS: '포스팅 삭제 성공',
    // UPDATE_POST_SUCCESS: '포스팅 수정 성공',
    //
    // // 결제성공
    // PAY_SUCCESS: '결제 성공',
    //
    // // 로그인, 회원가입
    // LOGIN_SUCCESS: '로그인 성공',
}

module.exports = code;