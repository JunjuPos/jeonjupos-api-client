const spaceModel = require("../models/spaceModel");

spaceService = {
    spacelist: async () => {

        let getSpaceList = await spaceModel.getSpaceList();

        if (getSpaceList.retcode === "-99") {
            return getSpaceList;
        } else {
            // 테이블 리스트
            const spacelist = getSpaceList.data;
            //  테이블 고유번호 리스트 생성
            const spacepkeylist = getSpaceList.data.map(space => space.spacepkey);

            //  테이블별 주문내역 조회
            const getSpaceOrderList = await spaceModel.getSpaceOrderList(spacepkeylist);
            if (getSpaceOrderList.retcode === "-99") {
                return getSpaceOrderList;
            } else {
                // 테스트 리스트에 주문한 메뉴리스트 추가
                for (let space of spacelist) {
                    space.amount = 0        // 테이블당 총 주문금액
                    space.orderlist = []    // 테이블당 주문내역
                    getSpaceOrderList.data.find((row) => {
                        if (space.spacepkey === row.spacepkey) {
                            space.amount = row.totalpayprice
                            space.orderlist.push({
                                menuname: row.menuname,
                                menucount: row.count,
                                saleprice: row.saleprice
                            });
                        }
                    });
                }
            }
            return {retcode: "00", spacelist: spacelist};
        }
    },
    orderlist: async (spacepkey) => {
        // TODO: 주문내역 작업 필요함

        try {
            const getOrderList = await spaceModel.getOrderList(spacepkey);
            if(getOrderList.retcode === "-99") {
                return getOrderList;
            } else {
                if (getOrderList.data.length === 0) {
                    return {retcode: "00", space: null, orderlist: []};
                }else {
                    let totalpayprice = 0;  // 테이블 총 주문가격
                    //  테이블 주문정보
                    const orderlist = getOrderList.data.map((order) => {
                        totalpayprice = order.totalpayprice
                        return {
                            ordermenupkey: order.ordermenupkey,
                            menupkey: order.menupkey,
                            menuname: order.menuname,
                            saleprice: order.saleprice,
                            count: order.count
                        }
                    });
                    //  테이블 정보
                    const space = {
                        spacepkey: getOrderList.data[0].spacepkey,
                        spacenum: getOrderList.data[0].spacenum,
                        orderinfopkey: getOrderList.data[0].orderinfopkey,
                        totalpayprice: totalpayprice
                    }

                    return {retcode: "00", space: space, orderlist: orderlist};
                }
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = spaceService;