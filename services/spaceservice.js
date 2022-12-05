let db = require("../database/db");

exports.spacelist = async () => {
    const connection = await db.getConnection();

    const getSpaceListQuery = `select spacepkey, spacenum, cookingyn from space where isactiveyn='Y'`;
    const getSpaceOrderQuery = `
        select sp.spacepkey, om.menuname, om.saleprice, om.count, oi.totalpayprice
        from space sp 
        join orderinfo oi on sp.spacepkey=oi.spacepkey
        join ordermenu om on oi.orderinfopkey=om.orderinfopkey
        where oi.spacepkey in ? and sp.cookingyn='Y' and oi.paystatus='unpaid'
    `;

    return new Promise(async (resolve) => {
        // 테이블 리스트 조회
        connection.query(getSpaceListQuery, [], (err, rows) => {
            if (err) {
                resolve({retcode: "-99", message: err.toString()});
            }

            // 테이블 리스트
            const spacelist = rows;

            //  테이블 고유번호 리스트 생성
            const spacepkeylist = rows.map(space => space.spacepkey);
            console.log(spacepkeylist);

            // 테이블별 주문메뉴 리스트 조회
            connection.query(getSpaceOrderQuery, [[spacepkeylist]], (err, rows) => {
                if (err) {
                    resolve({retcode: "-99", message: err.toString()})
                }
                console.log(err);
                console.log(rows);

                // 테스트 리스트에 주문한 메뉴리스트 추가
                // rows : 테이블 주문내역
                for (let space of spacelist) {
                    space.amount = 0        // 테이블당 총 주문금액
                    space.orderlist = []    // 테이블당 주문내역
                    rows.find((row) => {
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
                resolve({retcode: "00", spacelist: spacelist})
            });
        });
        connection.release();
    });
}

exports.orderlist = async (spacepkey) => {
    // TODO: 주문내역 작업 필요함

    const getSpaceQuery = `
        select 
            sp.spacepkey, spacenum, oi.orderinfopkey, totalpayprice,
            om.ordermenupkey, om.menupkey, menuname, saleprice, count
        from space sp
        left join orderinfo oi on sp.spacepkey=oi.spacepkey
        join ordermenu om on oi.orderinfopkey=om.orderinfopkey
        where sp.spacepkey=? and sp.cookingyn='Y' and oi.payyn='N'
    `;

    const connection = await db.getConnection();

    return new Promise((resolve) => {
        // 테이블 상세 (테이블, 결제정보, 주문정보)
        connection.query(getSpaceQuery, [spacepkey], (err, rows) => {
            if(err) {
                // 데이터베이스 에러(connection, query 등)
                resolve({retcode: "-99", message: err.toString()});
            }

            //  테이블 정보
            const space = {
                spacepkey: rows[0].spacepkey,
                spacenum: rows[0].spacenum,
                orderinfopkey: rows[0].orderinfopkey,
                totalpayprice: rows[0].totalpayprice
            }

            //  테이블 주문정보
            const orderlist = rows.map((order) => {
                return {
                    ordermenupkey: order.ordermenupkey,
                    menupkey: order.menupkey,
                    menuname: order.menuname,
                    saleprice: order.saleprice,
                    count: order.count
                }
            });
            resolve({retcode: "00", space, orderlist: orderlist})
            connection.release();
        })
    })
}