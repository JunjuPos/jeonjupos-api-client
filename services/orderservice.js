const orderModel = require("../models/orderModel");

orderSerivce = {
    gettotalpayprice: async (ordermenulist) => {
        let totalpayprice = 0
        for (let orderMenu of ordermenulist) {
            try{
                const getTotalPayPrice = await orderModel.getSalePrice(orderMenu);
                totalpayprice += getTotalPayPrice.data[0].orderprice;
                totalpayprice -= orderMenu.discount;
            } catch (err) {
                return getTotalPayPrice;
            }
        }

        return {retcode: "00", totalpayprice: totalpayprice}
    },
    firstorder: async (spacepkey, ordermenulist, takeoutyn, totalpayprice) => {

        console.log("totalpayprice : ", totalpayprice)

        /**
         * 1. orderinfo 생성
         * 2. ordermenu 생성
         * 3. space 상태 변경
         */

        try{
            const createOrderInfo = await orderModel.createOrderInfo(spacepkey, takeoutyn, totalpayprice);
            await orderModel.createOrderMenu(createOrderInfo.data.insertId, ordermenulist, createOrderInfo.connection);
            await orderModel.spaceModify(spacepkey, createOrderInfo.connection);
        }catch (err) {
            return {retcode: "-99", message: err.toString()}
        }

        return {retcode: "00"}
    },
    reOrder: async (orderinfopkey, orderList, newOrderList) => {

        let totalPayPrice = 0;
        // 총 결제금액
        totalPayPrice += orderList.map((order) => {return order.count*order.saleprice}).reduce((sum, currentValue) => sum + currentValue);
        totalPayPrice += newOrderList.map((order) => {return order.count*order.saleprice}).reduce((sum, currentValue) => sum + currentValue);

        // 기존 주문과 신규 주문 동일 메뉴 체크
        orderList.forEach((order, orderIndex, array) => {
            newOrderList.forEach((newOrder, newOrderIndex, array) => {
                if(order.menupkey === newOrder.menupkey) {
                    order.count += newOrder.count;
                    delete array[newOrderIndex];
                }
            })
        })

        let connection = null;
        //  기존 주문 수량 변경
        const orderMenuCountModifyParams = []
        await orderList.map(async (order) => {
            orderMenuCountModifyParams.push([order.count, order.ordermenupkey])
        })

        try{
            const orderMenuCountModify = await orderModel.orderMenuCountModify(orderMenuCountModifyParams);
            connection = orderMenuCountModify.connection;
        } catch (err) {
            return err;
        }

        //  신규 주문 insert
        try{
            // console.log("newOrderList : ", newOrderList);
            const createOrderMenu = await orderModel.createOrderMenu(orderinfopkey, newOrderList, connection);
            connection = createOrderMenu.connection;
        } catch (err) {
            return err;
        }

        //  orderInfo 정보 update
        try{
            await orderModel.orderInfoModify(orderinfopkey, totalPayPrice, connection);
        } catch (err) {
            return err;
        }

        return {retcode: "00"}

    },
    orderCountModify: async (ordermenupkey, orderinfopkey, type) => {
        /**
         * 메뉴 수량 증가
         */

        let connection = null;

        // 메뉴 카운트 수정
        try{
            const orderCountModify = await orderModel.orderCountModify(ordermenupkey, type);
            connection = orderCountModify.connection;
        } catch (err) {
            console.log(err);
            return err;
        }

        //

        // orderinfo update

        console.log("응답하라")
        return {retcode: "00"}
    }
}

module.exports = orderSerivce;