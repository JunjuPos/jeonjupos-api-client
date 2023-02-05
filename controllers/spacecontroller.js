let spaceservice = require("../services/spaceservice");

spaceController = {
    spacelist: async (req, res) => {
        try{
            const spaceserviceres = await spaceservice.spacelist(req.storepkey);
            return res.status(200).json({res_code: "0000", message: "테이블 정보 조회 성공", spacelist: spaceserviceres.spacelist});
        } catch (err) {
            console.log(err);
            return res.status(500).json({res_code: "9999", message: "데이터베이스 오류"})
        }
    },
    orderlist: async (req, res) => {

        const spacepkey = req.query.spacepkey;
        const storepkey = req.storepkey;

        try {
            let spaceserviceres = await spaceservice.orderlist(spacepkey, storepkey);
            return res.status(200).json({res_code: "0000", message: "테이블 주문정보 조회 성공", space: spaceserviceres.space, orderlist: spaceserviceres.orderlist})
        } catch (err) {
            return res.status(500).json({res_code: "9999", message: "데이터베이스 오류"})
        }
    }
}

module.exports = spaceController;
