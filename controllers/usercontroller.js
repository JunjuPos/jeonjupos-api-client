const userservice = require("../services/userservice");

exports.postpaidgrouplist = async (req, res) => {

    const search = req.query.search;

    const userserviceres = await userservice.postpaidgrouplist(search);

    if (userserviceres.retcode === "-99") {
        return res.status(500).json({res_code: "9999", message: "데이터베이스 오류"})
    }
    return res.status(200).json({res_code: "0000", message: "후불명부 조회 성공", postpaidgrouplist: userserviceres.postpaidgrouplist});

}