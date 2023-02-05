const orderModel = require("../models/orderModel");

orderSerivce = {
    getSalePrice: async (ordermenulist) => {
        let totalpayprice = 0
        for (let orderMenu of ordermenulist) {
            const count = orderMenu.count;
            const menupkey = orderMenu.menupkey;
            try{
                const getTotalPayPrice = await orderModel.getSalePrice(count, menupkey);
                totalpayprice += getTotalPayPrice.data[0].orderprice;
                totalpayprice -= orderMenu.discount;
            } catch (err) {
                throw err;
            }
        }

        return {retcode: "00", totalpayprice: totalpayprice}
    },
    fisrtorder: async (spacepkey, ordermenulist, takeoutyn) => {

        /**
         * 1. 총 가격 조회
         * 2. orderinfo 생성
         * 3. ordermenu 생성
         * 4. space 상태 변경
         */

        //  총 가격 조회
        const totalSalePrice = ordermenulist.map((item) => item.saleprice * item.count).reduce((acc, cur) => {return acc+cur}, 0)

        try {
            //  orderinfo 생성
            const createOrderInfo = await orderModel.createOrderInfo(spacepkey, takeoutyn, totalSalePrice);
            console.log("createOrderInfo.data.insertId : ", createOrderInfo.data.insertId)
            //  ordermenu 생성
            await orderModel.createOrderMenu(createOrderInfo.data.insertId, ordermenulist, createOrderInfo.connection);
            console.log()
            //  space 상태 변경
            await orderModel.spaceModify(spacepkey, createOrderInfo.connection);

        } catch (err) {
            throw err;
        }
        return {retcode: "00"}
    },
    reOrder: async (orderinfopkey, ordermenulist) => {

        //  총 가격 조회
        const totalSalePrice = ordermenulist.map((item) => item.saleprice * item.count).reduce((acc, cur) => {return acc+cur}, 0)

        try {
            // 기존 메뉴 목록 삭제
            const reOrderMenuDel = await orderModel.reOrderMenuDel(orderinfopkey);
            const connection = reOrderMenuDel.connection;

            // 새로 등록
            await orderModel.reOrderMenuCountModify(orderinfopkey, ordermenulist, connection);

            // 총가격 업데이트
            await orderModel.orderInfoTotalSalePriceModify(orderinfopkey, totalSalePrice, connection);
        } catch (err) {
            throw err;
        }

        return {retcode: "00"}

    },
    // orderCountModify: async (ordermenupkey, type) => {
    //     /**
    //      * 메뉴 수량 수정
    //      */
    //     console.log(ordermenupkey, type);
    //     let connection = null;
    //     try{
    //         // orderinfo 조회
    //         const getOrderInfo = await orderModel.getOrderInfoPkey(ordermenupkey);
    //         const orderinfopkey = getOrderInfo.orderinfopkey;
    //         console.log("orderinfopkey : ", orderinfopkey);
    //
    //         // 주문메뉴 개수 변경
    //         const orderMenuCountModify = await orderModel.orderMenuCountModify(ordermenupkey, type, connection);
    //         connection = orderMenuCountModify.connection;
    //         // console.log("orderMenuCountModify : ", orderMenuCountModify);
    //
    //         // 주문메뉴의 row가 없으면 orderinfo 삭제
    //         const orderInfoValidCheck = await orderModel.orderInfoValidCheck(orderinfopkey, connection);
    //         console.log("orderInfoValidCheck : ", orderInfoValidCheck.valid)
    //         if (orderInfoValidCheck.valid === false) {
    //             return {retcode: "00", data: {totalSalePrice: 0, totalCount: 0}}
    //         } else {
    //             // 총 가격 조회
    //             const getOrderInfoSalePrice = await orderModel.getOrderInfoSalePrice(orderinfopkey, connection);
    //             console.log("getOrderInfoTotalPrice : ", getOrderInfoSalePrice.totalsaleprice)
    //             const totalSalePrice = getOrderInfoSalePrice.totalsaleprice;
    //             const totalCount = getOrderInfoSalePrice.totalcount;
    //
    //             // orderinfo update
    //             const orderInfoTotalSalePriceModify = await orderModel.orderInfoTotalSalePriceModify(orderinfopkey, totalSalePrice, connection);
    //             console.log("orderInfoTotalSalePriceModify : ", orderInfoTotalSalePriceModify)
    //             return {retcode: "00", data: {totalSalePrice: totalSalePrice, totalCount: totalCount}}
    //         }
    //     } catch (err) {
    //         console.log("1err : ", err)
    //         throw err;
    //     }
    // }
}

module.exports = orderSerivce;