// ============================= 获取开发计划过滤条件
// ============================= /plan6/sdk!init.action?projectCd=1135
var response = {
    "success": true, // 操作是否成功
    "code": 200,
    "message": "", // 提示
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
            "id": "4028f958518b9b8901518ba74a830003", // 计划编号
            "name": "开发分期一" // 计划名称
        }],
        // 阶段目录
        "phase": {"1": "前期、方案阶段（土地摘牌前-方案批复）" /* ... */},
        // 节点类型
        "type": {"1": "PC设计" /* ... */}
    }
}

// ============================= 获取开发计划节点
// ============================= /plan6/sdk!node.action?planId=4028347044bace9c0144d47419151028&level=1&status=all&all=0
response = {
    "success": true, // 操作是否成功
    "code": 200,
    "message": "", // 提示
    "data": {
        "planId": "", // 当前 计划／业态 编号
        "phases": {start: end,} [{id: "", scheduleStartDate: "", scheduleEndDate: ""}] /* 分组阶段起始时间 */,
        "nodes": [{
            "id": "F4DEEAC1FC9C865EE040007F01006C20", // 节点编号
            "name": "建设工程规划许可证", // 节点名称
            "level": "1", // 节点级别
            "scheduleStartDate": "2015-08-15", // 计划开始时间
            "scheduleEndDate": "2016-03-15", // 计划结束时间
            "completeDate": "", // 完成时间
            "delayCompleteDate": "2017-04-09", // 延期完成时间
            "status": "1",
            "statusText": "", // 状态中文
            "centerOrgCd": "",
            "centerOrgName": "", // 主责方
            "centerManagerCd": "",
            "centerManagerName": "", // 中心 负责人
            "departmentHeadCd": "",
            "departmentHeadName": "", // 部门 负责人
            "centerCd": "",
            "centerName": "", // 责任人
            "resStatus": "", // 网批状态
            "expireStatus": "", // 过期状态
            "confirmStatus": "", // 确认状态
            "sequence": "115", // 序号
            "chargeOrgCd": "1396", // 主责方 CD
            "chargeOrgName": "地产公司", // 主责方名称
            "resNumbers": ["389675"], // 网批查询编号、多个
            "resIds": ["402834e548213f1101483025545c49d3"],// 网批主键编号、多个
            "isWarning": "", // 是否预警,
            "phase": "", // 所处阶段
            "type": "" // 节点类型
        }]
    }
}

// ============================= 获取开发计划节点详情
// ============================= /plan6/sdk!detail.action?nodeId=402834e53c6c48ab013c7afb7f8827ab
response = {
    "success": true, // 操作是否成功
    "code": 200,
    "message": "", // 提示
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
        "templateId": "", // 节点模版编号
        "messages": [{
            "creator": "", // 留言人账号
            "creatorName": "", // 留言人姓名
            "messageDate": "", // 留言时间
            "type": "", // 留言类型 1.留言 2.共享. 3回复
            "content": "", //留言内容
            "messageUserCd": "", // 接收人/被共享人集合             可能会有多个已逗号区分
            "messageUserName": "", // 接收人姓名/被共享人集合        可能会有多个已逗号区分
            "shareds": [{ // type ==2 为共享时、有内容
                "sharedUserCd": "", // 共享接收人 、界面呈现时需要判断 sharedUserCd==当前登陆人时 显示回复按钮 供回复操作
                "creator": "", // 共享人
            }],
            "resNumbers": [""], // 网批查询编号、多个
            "resIds": [""], // 网批主键编号、多个
        }],
        "attachs": [{
            "name": "", // 附件名称
            "url": "" // 附件地址
        }],
    }
}


// ============================= 获取开发计划节点详情
// ============================= /plan6/sdk!template.action?planId=xxx(该参数可为空、当有值时将只返回未创建过的节点)
response = {
    "success": true, // 操作是否成功
    "code": 200,
    "message": "", // 提示
    "data": [
        {
            "enabled": "0",// 是否启用 0启用、1未启用
            "id": "", // 未启用前为空
            "nodeId": "", // 模版节点编号
            "name": "", // 节点名称
            "level": "", // 节点级别
            "type": "", // 节点类型
            "sequence": "", // 节点序号
            "outputDesc": "", // 输出成果、描述
            "scheduleStartDate": "", // 计划开始时间
            "scheduleEndDate": "", // 计划结束时间
            "centerManagerCd": "", // 中心负责人
            "departmentHeadCd": "", // 部门负责人
            "chargerCd": "" // 责任人
        }
    ]
}


// ============================= 提交 评论1001、共享1002、回复1003
// ============================= /plan7/sdk!comment.action?action=(1001,1002,1003)&nodeId=必须&content=必须&userCds=1002(被共享人),1003(被回复人) 必须、1001不必提供
response = {
    "success": true, // 操作是否成功
    "code": 200,
    "message": "" // 提示
}

// ============================= 发起网批 nodeId、type(1已完成、2申请延期或撤销)
// ============================= /plan7/sdk!startRes.action?nodeId=&type=
response = {
    "success": true, // 操作是否成功
    "code": 200,
    "data": "", // 已生成的网批编号
    "message": "" // 提示
}

// ============================= 提交反馈、预警状态下当前节点责任人才能操作 nodeId、finishOnTime(2不能按期完成、3按期完成)、delayCompleteDate(延期时间)、delayReason(风险)、influenceMainNode(是否影响里程碑节点)、
// ============================= /plan7/sdk!feedback.action?nodeId=&finishOnTime=(2|3)&delayCompleteDate=(finishOnTime==2必填)&delayReason=(finishOnTime==2必填)&influenceMainNode=(finishOnTime==2必填)
response = {
    "success": true, // 操作是否成功
    "code": 200,
    "message": "" // 提示
}

// ============================= 模糊查询 用户
// ============================= /plan7/sdk!quick.action?term=模糊搜索内容&size=返回记录数
// ============================= 按照部门查询 用户
// ============================= /plan7/sdk!quick.action?orgCd=部门编号
response = {
    "success": true, // 操作是否成功
    "code": 200,
    "data": [
        {"uuid": "用户名", "name": "中文", "orgCd": "组织机构编号", "orgName": "组织机构名称", "sex": "1:男、2:女"}
    ], "message": "" // 提示
}

// ============================= 组织机构
// ============================= /plan7/sdk!organization.action
response = {
    "success": true, // 操作是否成功
    "code": 200,
    "data": [
        {id: "组织机构编号", name: "组织机构名称"}
    ], "message": "" // 提示
}