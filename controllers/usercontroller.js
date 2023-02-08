const userService = require("../services/userservice");
const statusCode = require("../common/statusCode");
const util = require("../common/responseUtill");
const message = require("../common/responseMessage");

const userController = {
    postpaidgrouplist: async (req, res) => {
        const search = req.query.search;

        const userserviceres = await userService.postpaidgrouplist(search);

        if (userserviceres.retcode === "-99") {
            return res.status(500).json({res_code: "9999", message: "데이터베이스 오류"})
        }
        return res.status(200).json({res_code: "0000", message: "후불명부 조회 성공", postpaidgrouplist: userserviceres.postpaidgrouplist});
    },
    login: async (req, res) => {

        const {id, password} = req.body;

        try{
            let getOwner = await userService.login(id, password);
            if (getOwner.retcode === "0000") {
                return res.status(statusCode.OK).json(util.success(getOwner.retcode, getOwner.data));
            } else {
                return res.status(statusCode.OK).json(util.fail(getOwner.retcode));
            }
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail("9999"))
        }
    },
    ownerRegister: async (req, res) => {
        const {id, password} = req.body;

        try{
            const ownerRegister = await userService.ownerRegister(id, password);
            return res.status(statusCode.OK).json(util.success(ownerRegister.retcode, {}));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail("9999"));
        }
    }
}

module.exports = userController;