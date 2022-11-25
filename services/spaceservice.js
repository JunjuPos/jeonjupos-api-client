let db = require("../database/db");

exports.spacelist = async () => {
    const connection = await db.getConnection();

    const getSpaceListQuery = `select spacepkey, spacenum, cookingyn from space where isactiveyn='Y'`;
    const getSpaceOrderQuery = `
        select sp.spacepkey, om.menuname, om.saleprice, om.count
        from space sp 
        join orderinfo oi on sp.spacepkey=oi.spacepkey
        join ordermenu om on oi.orderinfopkey=om.orderinfopkey
        where oi.spacepkey in ? and sp.cookingyn='Y' and oi.payyn='N'
    `;

    return new Promise(async (resolve) => {
        // 테이블 리스트 조회
        connection.query(getSpaceListQuery, [], (err, rows) => {
            if (err) {
                resolve({retcode: "-99", message: err.toString()})
            }

            // 테이블 리스트
            const spacelist = rows;

            //  테이블 고유번호 리스트 생성
            const spacepkeylist = rows.map(space => space.spacepkey);

            // 테이블별 주문메뉴 리스트 조회
            connection.query(getSpaceOrderQuery, [[spacepkeylist]], (err, rows) => {
                if (err) {
                    resolve({retcode: "-99", message: err.toString()})
                }

                // 테스트 리스트에 주문한 메뉴리스트 추가
                // rows : 테이블 주문내역
                for (let space of spacelist) {
                    space.amount = 0        // 테이블당 총 주문금액
                    space.orderlist = []    // 테이블당 주문내역
                    rows.find((row) => {
                        if (space.spacepkey === row.spacepkey) {
                            space.amount = row.count * row.saleprice
                            space.orderlist.push({
                                menuname: row.menuname,
                                menucount: row.count,
                                saleprice: row.saleprice
                            })
                        }
                    })
                }

                resolve(spacelist);
            })
        })

        connection.release();
    })
}

exports.orderlist = async (spacepkey) => {
    // TODO: 주문내역 작업 필요함

    let sql = `
        select 
            sp.spacepkey, spacenum, oi.orderinfopkey, totalpayprice,
            om.menupkey, menuname, saleprice, count
        from space sp
        left join orderinfo oi on sp.spacepkey=oi.spacepkey
        join ordermenu om on oi.orderinfopkey=om.orderinfopkey
        where sp.spacepkey=? and oi.payyn='N'
    `;

    const connection = await db.getConnection();
    let spaceorderqueryset;
    try{
        spaceorderqueryset = await new Promise((resolve, reject) => {
            connection.query(sql, [spacepkey], (err, rows) => {
                if(err) reject(err);
                else resolve(rows.length > 0? rows: null);
            })
        })
    }catch (err) {
        console.log(err);
        connection.release();
        return {retcode: "-99", message: err.toString()}
    }

    connection.release();

    let space = {
        spacepkey: spaceorderqueryset[0].spacepkey,
        spacenum: spaceorderqueryset[0].spacenum,
        orderinfopkey: spaceorderqueryset[0].orderinfopkey,
        totalpayprice: spaceorderqueryset[0].totalpayprice
    }

    return {retcode: "00", space, orderlist: []}

}