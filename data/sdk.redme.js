// ============================= 获取开发计划过滤条件http://192.168.121.24:7900/PowerDesk/plan6/sdk!init.action
// ============================= http://192.168.121.24:7900/PowerDesk/plan6/sdk!init.action?projectCd=1135
var response = {
    "success": true, // 操作是否成功
    "code": 200,
    "message": "",// 提示
    "data": {
        // 项目
        "projects": [{
            "projectCd": "SH1245",// 项目CD 类似于 主键ID
            "name": "七宝T" // 项目名称
        }],
        // 级别
        "levels": {"0": "里程碑节点", "all": "全部"},
        // 状态
        "status": {"3": "进行中", "4": "网批中", "5": "已完成", "11": "未启动", "12": "确认中", "all": "全部"},
        // 相关计划、传projectCd时有该字段
        "plans": [{
            "id": "4028f958518b9b8901518ba74a830003",// 计划编号
            "name": "开发分期一" // 计划名称
        }]
    }
}

// ============================= 获取开发计划节点
// ============================= /plan6/sdk!node.action?planId=4028347044bace9c0144d47419151028&level=1&status=all&all=0
response = {
    "success": true, // 操作是否成功
    "code": 200,
    "message": "",// 提示
    "data": {
        "nodes": [{
            "id": "F4DEEAC1FC9C865EE040007F01006C20", // 节点编号
            "name": "建设工程规划许可证",    // 节点名称
            "level": "1", // 节点级别
            "scheduleStartDate": "2015-08-15", // 计划开始时间
            "scheduleEndDate": "2016-03-15", // 计划结束时间
            "completeDate": "",// 完成时间
            "delayCompleteDate": "2017-04-09",// 延期完成时间
            "status": "1",
            // ! PS
            // isEnabled==0 未启用
            // status==2 完成
            // confirmStatus==1&&(resStatus==1||resStatus==3)) 未启动
            // confirmStatus == 1 && resStatus == 2 确认中
            // confirmStatus == 2 && (resStatus ==1 || resStatus  == 3) 进行中
            // confirmStatus == 2 && resStatus ==2 网批中
            "resStatus": "", // 网批状态
            "expireStatus": "", // 过期状态
            "confirmStatus": "", // 确认状态
            "sequence": "115", // 序号
            "chargeOrgCd": "1396",// 主责方 CD
            "chargeOrgName": "地产公司", // 主责方名称
            "resNumbers": ["389675"],// 网批查询编号、多个
            "resIds": ["402834e548213f1101483025545c49d3"],// 网批主键编号、多个
            "isWarning": "" // 是否预警
        }]
    }
}

// ============================= 获取开发计划节点详情
// ============================= /plan6/sdk!detail.action?nodeId=402834e53c6c48ab013c7afb7f8827ab
response = {
    "success": true, // 操作是否成功
    "code": 200,
    "message": "",// 提示
    "data": {
        "outputDesc": "《人防工程竣工验收合格证明》", // 成果判定
        "status": "1",
        "statusText": "未知", // 状态中文解释
        "isWarning": "1", // 是否已经预警
        "resStatus": "1", // 网批状态
        "expireStatus": "2", // 过期状态
        "confirmStatus": "2", // 是否确认状态
        "operationRecord": "", // 责任人操作 1:已完成 2:预计按期完成 3:预计延期完成 else 未知
        "finishOnTime": "", // 是否按期完成 3:按期完成 2:不能按期完成 else 未知
        "influenceMainNode": "", // 是否影响里程碑节点  3:影响里程碑节点、2:不影响里程碑节点 else 未知
        "delayReason": "", // 风险及具体原因
        "messages":[]// 留言
    }
}