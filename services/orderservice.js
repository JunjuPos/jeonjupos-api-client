const orderModel = require("../models/orderModel");
const getConnection = require("../common/db");

orderSerivce = {
    /**
     * 첫 주문
     * @param spacepkey
     * @param ordermenulist
     * @param takeoutyn
     * @returns {Promise<{retcode: string}>}
     */
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
            const connection = await getConnection();
            connection.beginTransaction();

            //  orderinfo 생성
            const createOrderInfo = await orderModel.createOrderInfo(spacepkey, takeoutyn, totalSalePrice, connection);
            //  ordermenu 생성
            for (const ordermenu of ordermenulist) {
                await orderModel.createOrderMenu(createOrderInfo.data.insertId, ordermenu, connection);
            }
            //  space 상태 변경
            await orderModel.spaceModify(spacepkey, true, connection);

            connection.commit();
            connection.release();

        } catch (err) {
            throw err;
        }
        return {retcode: "00"}
    },
    /**
     * 재주문
     * @param spacepkey
     * @param orderinfopkey
     * @param ordermenulist
     * @returns {Promise<{retcode: string}>}
     */
    reOrder: async (spacepkey, orderinfopkey, ordermenulist) => {

        //  총 가격 조회 * order.cancelyn = false 인 경우만
        const totalSalePrice = ordermenulist.map((item) => {
            if (item.cancelyn === false) return item.saleprice * item.count;
        }).filter(element => element).reduce((acc, cur) => {return acc+cur}, 0)

        try {
            const connection = await getConnection();
            connection.beginTransaction();

            //  totalSalePrice가 0인 경우 전체 취소로 간주하여 orderinfo, ordermenu 전체 삭제
            if (totalSalePrice === 0) {
                //  ordermenu 전체 삭제
                await orderModel.orderMenuDel(orderinfopkey, connection);
                // orderinfo 삭제
                await orderModel.orderInfoDel(orderinfopkey, connection);

                //  space 상태 변경
                await orderModel.spaceModify(spacepkey, false, connection);

                connection.commit();
                connection.release();
                return {retcode: "00"}
            }

            /**
             *  ordermenupkey가 0 이면서 cancelyn = true인 경우 ordermenu insert skip
             *
             *  ordermenupkey가 0 이면서 cancelyn = false인 경우 ordermenu 새로 추가
             *
             *  ordermenupkey가 0 보다 크면서 cancelyn = true인 경우 ordermenu delete
             *
             *  ordermenupkey가 0 보다 크면서 cancelyn = false인 경우 ordermenu.count update
             */

            for (const ordermenu of ordermenulist) {
                if (ordermenu.ordermenupkey === 0) {
                    if (ordermenu.cancelyn === true) {

                    } else {
                        //  ordermenu 새로 추가
                        await orderModel.createOrderMenu(orderinfopkey, ordermenu, connection)
                    }
                } else if (ordermenu.ordermenupkey > 0) {
                    if (ordermenu.cancelyn === true) {
                        //  ordermenu delete
                        await orderModel.reOrderMenuDel(ordermenu.ordermenupkey, connection);
                    } else {
                        //  ordermenu.count update
                        await orderModel.orderMenuCountModify(ordermenu.ordermenupkey, ordermenu.count, connection);
                    }
                } else {

                }
            }

            // 총가격 업데이트
            await orderModel.orderInfoTotalSalePriceModify(orderinfopkey, totalSalePrice, connection);

            connection.commit();
            connection.release();
        } catch (err) {
            console.log(err);
            throw err;
        }

        return {retcode: "00"}

    },
}

module.exports = orderSerivce;