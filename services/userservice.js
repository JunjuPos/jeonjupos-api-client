const getConnection = require("../common/db");
const userModel = require("../models/userModel");
const crypto = require('crypto');
const jwtUtil = require("../common/jwtUtil");

const userService = {
    postpaidgrouplist: async (search) => {

        const connection = await getConnection();
        search = "%" + search + "%";

        const getPostpaidgroupListQeury = `
        select 
            postpaidgrouppkey, companyname, departmentname, delegatename, phone
        from postpaidgroup
        where (companyname like ? or departmentname like ? or delegatename like ? or phone like ?) and useyn='Y'
        order by postpaidgrouppkey asc;
    `;

        return new Promise((resolve) => {

            connection.query(getPostpaidgroupListQeury, [search, search, search, search], (err, rows) => {
                if (err) resolve({retcode: "-99", message: err.toString()});

                resolve({retcode: "00", postpaidgrouplist: rows})
            })

            connection.release();
        })
    },
    login: async (id, password) => {

        //  입력받은 password 암호화
        const decode = crypto.createHash('sha256').update(password).digest('hex');

        try{
            // id로 점주의 id, password 조회
            const getOwner = await userModel.getOwner(id);

            // 조회 결과 조회
            if (getOwner.data.length === 0) {
                // 조회 결과가 없으면 id 불일치
                return {retcode: "0002", message: "아이디가 일치하지 않습니다."}
            } else {
                const storename = getOwner.data[0].storename;
                const storepkey = getOwner.data[0].storepkey;
                // 조회 결과 있으면 비밀번호 일치여부 체크
                if (decode === getOwner.data[0].ownerpassword) {
                    // 비밀번호 까지 일치하면 token 발행
                    const jwt = await jwtUtil.sign(getOwner.data[0].storepkey)

                    // 토큰은 다시 owner 테이블에 저장
                    await userModel.updateJwt(id, jwt);
                    return {retcode: "0000", data: {storename: storename, jwt: jwt, storepkey: storepkey}}
                } else {
                    // 비밀번호 불일치
                    return {retcode: "0003", message: "비밀번호가 일치하지 않습니다."}
                }
            }
        } catch (err) {
            throw err;
        }

        // token, 매장명 응답
    },
    ownerRegister: async (id, password) => {
        const decode = crypto.createHash('sha256').update(password).digest('hex');

        // 회원 저장
        try{
            await userModel.ownerRegister(id, decode);
            return {retcode: "0000"}
        } catch (err) {
            throw err;
        }
    }
}

module.exports = userService;