const spaceModel = require("../models/spaceModel");

spaceService = {
    spacelist: async (storepkey) => {

        try{
            let getSpaceList = await spaceModel.getSpaceList(storepkey);
            const spacelist = getSpaceList.data;
            //  테이블 고유번호 리스트 생성
            const spacepkeylist = getSpaceList.data.map(space => space.spacepkey);

            //  테이블별 주문내역 조회
            const getSpaceOrderList = await spaceModel.getSpaceOrderList(spacepkeylist, storepkey);

            // 테스트 리스트에 주문한 메뉴리스트 추가
            for (let space of spacelist) {
                space.amount = 0        // 테이블당 총 주문금액
                space.orderlist = []    // 테이블당 주문내역
                getSpaceOrderList.data.find((row) => {
                    if (space.spacepkey === row.spacepkey) {
                        space.amount = row.totalsaleprice;
                        space.orderlist.push({
                            menuname: row.menuname,
                            menucount: row.count,
                            saleprice: row.saleprice
                        });
                    }
                });
            }
            return {retcode: "00", spacelist: spacelist};
        } catch (err) {
            throw err;
        }
    },
    orderlist: async (spacepkey, storepkey) => {

        try {
            const getOrderList = await spaceModel.getOrderList(spacepkey, storepkey);
            if (getOrderList.data.length === 0) {
                return {retcode: "00", space: null, orderlist: []};
            } else {
                let totalsaleprice = getOrderList.data[0].totalsaleprice; // 테이블 총 주문가격
                let totalpayprice = getOrderList.data[0].totalpayprice;  // 테이블 총 결제금액
                let expectedrestprice = getOrderList.data[0].expectedrestprice; // 결제후 남은금액
                let totalcount = 0  // 총 주문수량

                //  테이블 주문정보
                const orderlist = getOrderList.data[0].ordermenupkey !== undefined && getOrderList.data[0].ordermenupkey !== null? getOrderList.data.map((order) => {
                    totalcount += order.count
                    return {
                        ordermenupkey: order.ordermenupkey,
                        menupkey: order.menupkey,
                        menuname: order.menuname,
                        saleprice: order.saleprice,
                        count: order.count,
                        totalsaleprice: order.saleprice * order.count,
                        cancelyn: false
                    }
                }): [];

                //  테이블 정보
                const space = {
                    spacepkey: spacepkey,
                    orderinfopkey: getOrderList.data[0].orderinfopkey,
                    totalSalePrice: totalsaleprice,
                    totalPayPrice: totalpayprice,
                    expectedRestPrice: expectedrestprice,
                    totalCount: totalcount
                }

                return {retcode: "00", space: space, orderlist: orderlist};
            }

        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = spaceService;