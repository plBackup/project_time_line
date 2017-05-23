<%@page import="org.springside.modules.security.springsecurity.SpringSecurityUtils" %>
<%@page import="com.powerlong.org.pd.cache.PlasCache" %>
<%@page import="com.powerlong.org.pd.cache.PlasCacheUtil" %>
<%@page import="com.powerlong.org.pd.util.CodeNameUtil" %>
<%@page import="com.powerlong.org.pd.util.JspUtil" %>
<%@ page import="com.powerlong.org.plas.entity.ws.WsPlasAcct" %>
<%@ page import="com.powerlong.org.plas.entity.ws.WsPlasUser" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page contentType="text/html;charset=UTF-8" %>
<%@ include file="/common/taglibs.jsp" %>
<%@ include file="/common/nocache.jsp" %>
<script type="text/javascript" src="${ctx}/js/datePicker/WdatePicker.js"></script>
<style type="text/css">
/*留言框弹出框“确定”按钮样式控制-add by liuzhihui 2014-07-11*/
#confirmTerm{
	margin-left:250px;
}
</style>

<link type="text/css" rel="stylesheet" href="${ctx}/resources/css/common3/plan/temp.css"/>
<div style="z-index: 2;position:relative;background: #EDEFF3;display: block;">
    <div class="div-detail" style="float: left;background: #EDEFF3;width: 100%;margin-top: 0px;">
        <ul class="ul-senior">
            <li>
                <label class="label-width-10" style="margin-bottom: 0px;">涉及业态：</label>
                <s:iterator value="node.layoutList" id="column">
                <span class="special-input checkbox"><a class="selected" style="text-decoration: none;" nodeId="<s:property value="key"/>"><s:property
                        value="value"/></a></span>
                </s:iterator>
            </li>
            <li style="color:red;padding-bottom: 5px;display: block;clear:both;">
                <label class="label-width-10" style="height: 12px;line-height: 12px;margin-top: 0px;">提示：</label>
                <label class="label-width-10" style="text-align: left;height: 12px;line-height: 12px;margin-top: 0px;width:200px;">可选择多个业态进行操作</label>

                <div style="clear:both;"></div>
            </li>


            <s:if test="node.scheduleStartDate!=''">
                <li>
                    <label class="label-width-10">计划开始：</label>
                    <label class="label-width-10" style="text-align: left;">${node.scheduleStartDate}</label>
                </li>
            </s:if>
            <s:if test="node.scheduleEndDate!=''">
                <li>
                    <label class="label-width-10">计划结束：</label>
                    <label class="label-width-10" style="text-align: left;">${node.scheduleEndDate}</label>
                </li>
            </s:if>
            <s:if test="node.completeDate!=''">
                <li>
                    <label class="label-width-10">实际完成：</label>
                    <label class="label-width-10" style="text-align: left;">${node.completeDate}</label>
                </li>
            </s:if>
            <s:if test="node.delayCompleteDate!=''">
                <li>
                    <label class="label-width-10">延期完成：</label>
                    <label class="label-width-10" style="text-align: left;">${node.delayCompleteDate}</label>
                </li>
            </s:if>
            <li>
                <label class="label-width-10">状态：</label>
                <label class="input-width-35">
                    <s:if test="node.status == 2">
                        已完成
                    </s:if>
                    <s:elseif test="node.confirmStatus == 1 && (node.resStatus ==1 || node.resStatus  == 3)">
                        未启动
                    </s:elseif>
                    <s:elseif test="node.confirmStatus == 1 && node.resStatus == 2 ">
                        确认中
                    </s:elseif>
                    <s:elseif test="node.confirmStatus == 2 && (node.resStatus ==1 || node.resStatus  == 3)">
                        <font color="red">
                            <s:if test="node.isWarning ==1">
                                该计划处于预警状态，须重点关注。请点击“预计按期完成”、“预计延期完成”、“已完成”实时知会相关人员计划当前状态。
                            </s:if>
                            <s:else>
                                请按计划时间开展工作，点击“已完成”发起完成网批
                            </s:else>
                        </font>
                    </s:elseif>
                    <s:elseif test="node.confirmStatus == 2 && node.resStatus ==2 ">
                        <font color="red">该计划处于网批状态，点击“网批查询号”查询网批详情</font>
                    </s:elseif>

                </label>
            </li>
            <s:if test="node.status != 2 ">
                <%
                    if (SpringSecurityUtils.getCurrentUserName().equals(CodeNameUtil.getUserNameByCd(JspUtil.findString("node.chargerCd")))) {
                %>
                    <li><label class="label-width-10">操作：</label>
                        
                 <!-- 非四、五级计划 -->       
                 <s:if test="templetId!=4&&templetId!=6">
                 	 <s:if test="node.confirmStatus  ==2 && node.resStatus != 2 ">
                        <span class="special-input checkbox">
		                <a id="goToRes"   onclick="checkOne(this);openInfo();" style="text-decoration: none;color: red;" nodeId="<s:property value="key"/>">已完成</a></span>
                	</s:if>
                	<s:if test=" node.isWarning ==1 && node.confirmStatus  ==2">
                        <span class="special-input checkbox">
		                <a id="goToStu1"  onclick="checkOne(this);openInfo();" style="text-decoration: none;color: red;" nodeId="<s:property value="key"/>">预计按期完成</a></span>
		                <span class="special-input checkbox">
		                <a id="goToStu2"  onclick="goToResUpdateStatus('${node.nodeId}','2',$(this));checkOne(this);" style="text-decoration: none;color: red;" nodeId="<s:property value="key"/>">预计延期完成</a></span>
                    </s:if>    
               </s:if>       
               <s:if test="templetId==4||templetId==6">
               		<input type="button" class="btn-blue" value="已完成" onclick="startRes('1','${node.nodeId}',$(this))"/> 
               </s:if>
                
              
                        <s:if test="node.confirmStatus  ==2 && node.resStatus != 2 ">
                        <s:if test="templetId==4||templetId==6">
                            <input type="button" class="btn-blue" value="申请延期或撤销" onclick="startRes('2','${node.nodeId}',$(this))"/> </s:if>
                   		</s:if>
                    </li>
                <%} %>
                <%
                    if (SpringSecurityUtils.getCurrentUserName().equals(CodeNameUtil.getUserNameByCd(JspUtil.findString("node.chargerCd")))) {
                %>
                <s:if test=" node.isWarning ==1 && node.confirmStatus  ==2">
                    <s:if test="templetId==4||templetId==6">
                    <li>
                        <label class="label-width-10">预警确认：</label>
                        <input type="button" class="btn-blue" value="预计按期完成" onclick="updateStatus('${node.nodeId}','1',$(this))" style="background: #2D8BEF"/>
                        <input type="button" class="btn-blue" value="预计延期完成" onclick="updateStatusForTemplet4('${node.nodeId}','2',$(this))" style="background: #2D8BEF"/>
                    </li> 
                    </s:if>
                </s:if>
                <%} %>
            </s:if>
            <li>
                <label class="label-width-10">成果判定：</label>
                <label class="label-width-50" style="color: #959595;">${node.outputDesc}</label>
                <div class="clear_div" style="clear:both;">
                    <s:iterator value="attachList">
                        <s:url id="down" action="download" namespace="/app">
                            <s:param name="fileName">${fileName}</s:param>
                            <s:param name="realFileName">${realFileName}</s:param>
                            <s:param name="bizModuleCd">${bizModuleCd}</s:param>
                            <s:param name="filterType">${filterType}</s:param>
                            <s:param name="id">${appAttachFileId}</s:param>
                            <s:param name="fieldName">${bizFieldName}</s:param>
                        </s:url>
                        <div style="clear:both; margin:0;padding:0;"><label class="label-width-10" style="height: 12px;line-height: 12px;">&nbsp;</label>
                            <a class="link" title="${realFileName}"
                               style="max-width:155px;overflow: hidden; text-overflow:ellipsis;margin-bottom:5px;height:15px;line-height:15px; padding-bottom: 3px;padding-right:18px;white-space: nowrap;"
                               href="${down}">${realFileName}</a>
                        </div>
                    </s:iterator>
                </div>
            </li>
            <s:if test="null!=node.refResNumList&&!node.refResNumList.isEmpty()">
                <li>
                    <label class="label-width-10">网批查询号：</label>
                    <label>
                        <s:iterator value="node.refResNumList" var="va" status="stNum">
                            <a style="text-decoration:underline; color:#5A5A5A; cursor:pointer;"
                               href="javascript:lookRes('${node.refResIdList[stNum.index]}');"> ${va}</a>&nbsp;&nbsp;&nbsp;
                        </s:iterator>
                    </label>
                </li>
            </s:if>
            <s:if test="templetId!=4&&templetId!=6">
            <s:if test="isWar !='War'">
            <li>
                 <label style="width:12%;">
                 </label>
                 <input id="showCloseInfo" class="btn-blue" type="button" value="展开反馈信息" onclick="openInfo();"/>
            </li>
            </s:if>
            </s:if>
            <s:if test="templetId!=4&&templetId!=6">
            <!-- 责任人显示输入框及勾选框其他人只读显示 -->
            <div id="feedback" <s:if test="isWar !='War'">style="display: none;"</s:if>>
            <s:if test="isChargerCd==1">
             <%--  <li style="display: none;" id="finishOnTimeLi">
                <label class="label-width-10" style="margin-bottom: 0px;"><font color="red">*</font>是否按期完成：</label>
                <span class="special-input checkbox">
                <input type="hidden" id="hfin" value="${node.finishOnTime}">
                <a id="finishOnTime" class="selected"  onclick="changeFin();" style="text-decoration: none;color: red;" nodeId="<s:property value="key"/>">（勾选为按期完成）</a></span>
            </li> --%>
            <s:if test="templetId!=4&&templetId!=6">
            <li id="cDate" style="display: none;">
                <label class="label-width-10" style="margin-bottom: 0px;">延期时间：</label>
                <input type="text" id="newDelayCompleteDate" value="<s:date name="node.newDelayCompleteDate" format="yyyy-MM-dd"/>"  class='datepicker'/>
            </li>
            </s:if>
            <!-- 里程碑节点不显示 -->
			<s:if test="isLandMarks!=1">
            <li id="influenceMainNodeLi" style="display: none;">
            	  <label class="label-width-10" style="margin-bottom: 0px;">是否影响里程碑节点：</label>
            	  <input type="hidden" id="hinf" value="${node.influenceMainNode}">
            	  <span class="special-input checkbox">
            	  	<a id="influenceMainNode1"   style="text-decoration: none;color: red;" nodeId="<s:property value="key"/>">（勾选为影响）</a></span>
            	  </span>
            </li>
			</s:if>
             <li id="delayReasonLi" <s:if test="node.finishOnTime!=2">style="display: none;"</s:if>>
                <label class="label-width-10" style="margin-bottom: 0px;">风险及具体原因：</label>
                <span class="special-input "><input id="delayReason" class="input-width-35-bis" value="${node.delayReason }"></span>
            </li>
             <%-- <li>
                <label class="label-width-10" style="margin-bottom: 0px;">弥补措施或调整方案：</label>
                <span class="special-input "><input id="adjustmentScheme" class="input-width-35-bis" value="${node.adjustmentScheme }"></span>
            </li> --%>
            </s:if>
            <s:else>
	           <s:if test="node.operationRecord!=null">
		            <li>
		                <label class="label-width-10" style="margin-bottom: 0px;"><font color="red"></font>责任人操作：</label>
		                <label class="input-width-35">
			                <s:if test="node.operationRecord==1">
			               		已完成
			                </s:if>
			                <s:elseif test="node.operationRecord==2">
			                	预计按期完成
			                </s:elseif>
			                <s:elseif test="node.operationRecord==3">
			                	预计延期完成
			                </s:elseif>
		                </label>
		            </li>
	            </s:if> 
            	<li>
                <label class="label-width-10" style="margin-bottom: 0px;"><font color="red">*</font>是否按期完成：</label>
                <label class="input-width-35">
	                <s:if test="node.finishOnTime==3">
	               		按期完成
	                </s:if>
	                <s:elseif test="node.finishOnTime==2">
	                	不能按期完成
	                </s:elseif>
                </label>
            </li>
			<s:if test="isLandMarks!=1">
            <li>
                <label class="label-width-10" style="margin-bottom: 0px;">是否影响里程碑节点：</label>
                <label class="input-width-35">
	                <s:if test="node.influenceMainNode==3">
	               		影响里程碑节点
	                </s:if>
	                <s:elseif test="node.influenceMainNode==2">
	                	不影响里程碑节点
	                </s:elseif>
                </label>
            </li>
            </s:if>
             <li>
                <label class="label-width-10" style="margin-bottom: 0px;">风险及具体原因：</label>
                <label class="input-width-35">${node.delayReason }</label>
            </li>
            <%--  <li>
                <label class="label-width-10" style="margin-bottom: 0px;">弥补措施或调整方案：</label>
                <label class="input-width-35">${node.adjustmentScheme }</label>
            </li> --%>
            </s:else>

            <s:if test="isChargerCd==1">
	             <li>
	                 <label class="label-width-10"></label>
	                 <input type="button" class="btn-blue" value="提交反馈" onclick="saveReason('${node.nodeId}')" style="background: #2D8BEF"/>
	             </li>
            </s:if>
        </ul>
        </div>
        </s:if>
    </div>
    <div class="tr-detail-left" style="float: left;background: #EDEFF3;width: 100%;;margin-top: 0px;padding: 10px 0;width:100%;margin-bottom: 0px;">
        <div class="div-left width-100">
            <ul class="ul-20" style="width:12%">
                <li class="width-100 text-right">留言：</li>
            </ul>
            <s:if test="node.nodeId != ''">
                <ul class="ul-80">
                    <li>
                        <s:iterator value="messageList">
                            <s:if test="type == 1">
                                <div style="word-break:break-all;white-space:normal;">
                                    <span><%=CodeNameUtil.getUserNameByCd(JspUtil.findString("creator"))%>(<s:date format="yyyy-MM-dd HH:mm"
                                                                                                                   name="messageDate"></s:date>):</span>
                                    留言&nbsp;：${contents }
                                </div>
                            </s:if>
                            <s:if test="type == 2">
                                <s:iterator value="plan6MessageShareds">
                                    <div style="word-break:break-all;">
                                    <span><%=CodeNameUtil.getUserNameByCd(JspUtil.findString("creator"))%>(<s:date format="yyyy-MM-dd HH:mm"
                                                                                                                   name="messageDate"></s:date>):</span>
                                        共享给&nbsp;<%
                                        String[] messageUserCds = JspUtil.findString("messageUserCd").split(",");
                                        for (int i = 0; i < messageUserCds.length; i++) {
                                            String wsPlasUser = CodeNameUtil.getUserNameByCd(messageUserCds[i]);
                                            if (StringUtils.isNotBlank(wsPlasUser)) {
                                                out.print(wsPlasUser + (i + 1 < messageUserCds.length ? "、" : ""));
                                            }
                                        }
                                    %>：${contents }
                                        <%if (SpringSecurityUtils.getCurrentUserName().equals(CodeNameUtil.getUserNameByCd(JspUtil.findString("sharedUserCd")))) {%>
                                        <a style="text-decoration:none" onclick="javascript:popReply($(this),'${creator}');">【回复】</a>
                                        <%} %>
                                    </div>
                                </s:iterator>
                            </s:if>
                            <s:if test="type == 3">
                                <div style="word-break:break-all;">
                                    <span><%=CodeNameUtil.getUserNameByCd(JspUtil.findString("creator"))%>(<s:date format="yyyy-MM-dd HH:mm"
                                                                                                                   name="messageDate"></s:date>):</span>
                                    回复给&nbsp;<%=CodeNameUtil.getUserNameByCd(JspUtil.findString("messageUserCd"))%>
                                    <%if (SpringSecurityUtils.getCurrentUserName().equals(CodeNameUtil.getUserNameByCd(JspUtil.findString("messageUserCd")))) {%>
                                    <a style="text-decoration:none" onclick="javascript:popReply($(this),'${creator}');">【回复】</a>
                                    <%} %>
                                    ：${contents }
                                </div>
                            </s:if>
                        </s:iterator>
                    </li>
                </ul>
                <ul class="ul-senior">
                    <li>
                        <label style="width:12%;"></label>
                        <textarea rows="30" cols="40" id="newMessage"></textarea>
                        <input class="btn-special-blue" type="button" value="留言" id="btnMess"/>
                        <script type="text/javascript">
                            $("#newMessage").show();
                        </script>
                        <input class="btn-special-blue" type="button" value="共享" id="btnProMess"/>
                        <input type="hidden" id="sharedUserCd" value=""/>
                        <script type="text/javascript">
                            $("#newMessage").show();
                        </script>
                    </li>
                </ul>
            </s:if>
        </div>
    </div>
    <div style="clear: both;"></div>
</div>
<script type="text/javascript">
    $(function () {
        loadDatepicker();
        autoHeight();
        var influenceMainNode=$("#hinf").val();
        if(influenceMainNode){
	        if('3'==influenceMainNode){
	        	$("#influenceMainNode1").attr("class","selected");
	        }else{
	        	$("#influenceMainNode1").attr("class","");
	        }
        }
        else{
        	$("#influenceMainNode1").attr("class","");
        }
    });
    //回复留言
    function popReply(document, userCd) {
        var contentText = "<div id='simTestContent' ><textarea style='height: 90px;width: 590px;' id='messageText' ></textarea></div>";
        tipsWindown({
            title: "回复留言框",
            content: "text:" + contentText,
            width: 100,
            height: 100,
            drag: "true",
            showbg: "true",
            scroll_move: "true",
            cssName: "simTestContent",
            btn: "true",
            okCallback: function (i, k) {
                var nodeIds = getNodeIds();
                if (nodeIds < 1) {
                    alert("请选择要操作的业态！");
                    return;
                }
                if ($("#messageText").val() == '') {
                    $("#messageText").css("border", "2px solid red");
                    alert('请输入回复内容！');
                    return;
                }
                TB_showMaskLayer("正在执行,请稍候...");
                $.post("${ctx}/plan6/plan6!saveReplyMessage.action",
                        {'message.nodeId': '${node.nodeId}',
                            'nodeId': '${node.nodeId}',
                            'nodeIds': nodeIds.join(","),
                            'message.type': '3',
                            'replyUserCd': userCd,
                            'message.contents': $("#messageText").val()},
                        function (r) {
                            TB_removeMaskLayer();
                            if (r != 'succ') {
                                alert('后台错误！');
                            } else {
                                refreshDetail(document);
                            }

                        });
            }
        });
    }

    function refreshDetail(_this) {
        var _mesSty = $("#newMessage").css("display");
        TB_showMaskLayer("正在加载,请稍候...");
        $.post("${ctx}/plan6/plan6!loadNodeDetail.action",
                {'nodeId': '${node.nodeId}','templetId':'${templetId}','projectCd':$("#projectCd").val()},
                function (result) {
                    TB_removeMaskLayer();
                                                     $(".tr-detail[curselected='yes']").find("td").html(result);
                                                     //将原有的留言框样式带入
                                                     $("#newMessage").css("display", _mesSty);
                                                     autoHeight();
                });
    }

    $(function () {
        //留言
        $("#btnMess").die().live("click", function () {
        	TB_showMaskLayer("加载中...");
            if ($("#newMessage").val() == '') {
                $("#newMessage").css("border", "2px solid red");
                TB_removeMaskLayer();
                return;
            }
            var nodeIds = getNodeIds();
            if (nodeIds < 1) {
                alert("请选择要操作的业态！");
                TB_removeMaskLayer();
                return;
            }
            $.post("${ctx}/plan6/plan6!saveMessage.action",
                    {'message.nodeId': '${node.nodeId}',
                        'nodeId': '${node.nodeId}',
                        'nodeIds': nodeIds.join(","),
                        'message.type': '1',
                        'sharedUserCd': $("#sharedUserCd").val(),
                        'message.contents': $("#newMessage").val()},
                    function (r) {
                        if (r != 'succ') {
                        	TB_removeMaskLayer();
                            alert('后台错误！');
                        } else {
                            refreshDetail(this);
                        }

                    });
        });

        $("#btnProMess").userSelect({
            muti: false,
            callback: function (_userMap, _this) {
                $("#btnProMess").val("共享");
                var sharedUserCd = $("#sharedUserCd").val().replace(/;$/, "").replace(/;/g, ",");
                var nodeIds = getNodeIds();
                if (nodeIds < 1) {
                    alert("请选择要操作的业态！");
                    return;
                }
                if (sharedUserCd == '') {
                    return;
                } else {
                    var contentText = "<div id='simTestContent2' ><textarea style='height: 90px;width: 590px;' id='sharedMessageText' ></textarea></div>";
                    tipsWindown({
                        title: "共享留言框",
                        content: "text:" + contentText,
                        width: 100,
                        height: 100,
                        drag: "true",
                        showbg: "true",
                        scroll_move: "true",
                        cssName: "simTestContent",
                        btn: "true",
                        okCallback: function (i, k) {
                            var nodeIds = getNodeIds();
                            if (nodeIds < 1) {
                                alert("请选择要操作的业态！");
                                return;
                            }
                            if ($("#sharedMessageText").val() == '') {
                                alert('请输入共享内容！');
                                return;
                            }
                            $.post("${ctx}/plan6/plan6!saveShareMessage.action",
                                    {'message.nodeId': '${node.nodeId}',
                                        'nodeId': '${node.nodeId}',
                                        'nodeIds': nodeIds.join(","),
                                        'message.type': '2',
                                        'sharedUserCd': sharedUserCd,
                                        'message.contents': $("#sharedMessageText").val()},
                                    function (r) {
                                        if (r != 'succ') {
                                            alert('后台错误！');
                                        } else {
                                            refreshDetail(this);
                                        }
                                    });
                        }
                    });
                }

            }
        });
        autoHeight();
    });
    /**
     * 查看网上审批
     * @param id 网批ID
     * @return
     */
    function openSheet(id) {
        var url = _ctx + "/res/res-approve-info.action?id=" + id + "&statusCd=2";
        if (parent.TabUtils == null)
            window.open(url);
        else
            parent.TabUtils.newTab("190", "网上审批", url, true);
    }

    function saveReason(nid){
    	var goToRes=$("#goToRes").attr("class");//已经完成
    	var goToStu1=$("#goToStu1").attr("class");//预计按期完成
    	var goToStu2=$("#goToStu2").attr("class");//预计延期完成
    	if('selected'!=goToRes&&'selected'!=goToStu1&&'selected'!=goToStu2){
    		alert("必须勾选已完成、预计按期完成、预计延期完成其中一个!")
    		return;
    	}
    	var finishOntime=$("#finishOnTime").attr("class");
    	var operationRecord='';
    	if('selected'==goToRes){finishOntime='3';operationRecord='1';}
    	if('selected'==goToStu1){finishOntime='3';operationRecord='2';}
    	if('selected'==goToStu2){finishOntime='2';operationRecord='3';}
    	var influenceMainNode=$("#influenceMainNode1").attr("class");
    	if(influenceMainNode){
    		if('selected'==influenceMainNode){
    			influenceMainNode='3';
    		}else{
    			influenceMainNode='2';
    		}
    	}else{
    		influenceMainNode='2';
    	}
    	var nodeIds = getNodeIds();
    	 //预计延期完成
    	var goToStu2=$("#goToStu2").attr("class");


    	$.post("${ctx}/plan6/plan6!saveReason.action",
                {'nodeIds': nodeIds.join(","),
                    'finishOnTime': finishOntime,
                    'influenceMainNode': influenceMainNode,
                    'delayReason': $("#delayReason").val(),
                    'adjustmentScheme': $("#adjustmentScheme").val(),
                    'operationRecord':operationRecord},
                function (r) {
                   //alert("保存成功！");
                   
                   
               	//预计按期完成
               	var goToStu1=$("#goToStu1").attr("class");
            	if('selected'==goToStu1){
        	    	updateStatus(nid,'1',$("#goToStu1"));
            	}
            	
            	//已完成生成网批   
                var goToRes=$("#goToRes").attr("class");
               	if('selected'==goToRes){
               		startRes('1',nid,$("#goToRes"));
               	}

               	if('selected'==goToStu2){
                    var delayReason=$("#delayReason").val();
                    if(''==delayReason){
                        alert("预计延期完成时必须填写风险及具体原因！");
                        return;
                    }

                    var newDelayCompleteDate=$("#newDelayCompleteDate").val();
                    if(''==newDelayCompleteDate){
                        alert("预计延期完成时必须填写延期时间！");
                        return;
                    }


                    if (nodeIds.length < 1) {
                        alert("请选择至少一个业态");
                        return;
                    }
                    updateDelayCompleteDate(nid, '2', $("#goToStu2"), nodeIds);
                    //updateStatus(nodeId,'2',obj);
                }
                });
    }

    function openInfo(){
    	$("#feedback").show();
    	$("#showCloseInfo").val("隐藏反馈信息");
    	$("#showCloseInfo").attr("onclick","closeInfo();");
    }
    function closeInfo(){
    	$("#feedback").hide();
    	$("#showCloseInfo").val("展开反馈信息");
    	$("#showCloseInfo").attr("onclick","openInfo();");
    }
    
    function goToRes(index,nodeId,obj){
    	var goToRes=$("#goToRes").attr("class");
    	if('selected'==goToRes){
    		startRes(index,nodeId,obj);
    	}
    }
    function goToResUpdateStatus(nodeId,index,obj){
    	var isSelected=$(obj).attr("class");
    	if(''==isSelected||undefined==isSelected||'undefined'==isSelected){
    		$("#influenceMainNodeLi").show();
    		$("#finishOnTimeLi").show();
    		$("#cDate").show();
    		$("#delayReasonLi").show();
    	}else{
    		$("#influenceMainNodeLi").hide();
    		$("#finishOnTimeLi").hide();
    		$("#cDate").hide();
    		$("#delayReasonLi").hide();
    	}
    	openInfo();
    }
    
    
    
    function updateDelayCompleteDate(nodeId, status, document, nodeIds) {
    	$.post(_ctx + "/plan6/plan6!saveHistory.action",
                {'nodeId': nodeId, 'operType': status, 'delayCompleteDate': $("#newDelayCompleteDate").val(), 'nodeIds': nodeIds.join(",")},
                function (r) {
                    TB_removeMaskLayer();
                    if (r != 'succ') {
                        alert('后台错误！');
                    } else {
                        refreshDetail(document);
                    }
                });
    }
    
    function getNodeIds() {
        return $("table.node-list span.checkbox a").map(function (index, dom) {
            dom = $(dom);
            if (dom.hasClass("selected")) {
                return dom.attr("nodeId");
            }
        }).get();
    }
    }

    
    function checkOne(obj){
    	var objId=$(obj).attr("id");
    	var goToRes=$("#goToRes").attr("class");
    	var goToStu1=$("#goToStu1").attr("class");
    	var goToStu2=$("#goToStu2").attr("class");
    	if("goToRes"==objId){
    		if(''==goToRes||'undefined'==goToRes||undefined==goToRes){
    			$("#influenceMainNodeLi").hide();
        		$("#cDate").hide();
        		$("#delayReasonLi").hide();
    			$("#goToStu1").removeClass("selected");
    			$("#goToStu2").removeClass("selected");
    		}
    	}else if("goToStu1"==objId){
    		if(''==goToStu1||'undefined'==goToStu1||undefined==goToStu1){
    			$("#cDate").hide();
    			$("#goToRes").removeClass("selected");
    			$("#goToStu2").removeClass("selected");
    			$("#delayReasonLi").hide();
    			$("#influenceMainNodeLi").hide();
    		}
    	}else if("goToStu2"==objId){
    		if(''==goToStu2||'undefined'==goToStu2||undefined==goToStu2){
    			$("#goToRes").removeClass("selected");
    			$("#goToStu1").removeClass("selected");
    			$("#delayReasonLi").show();
    			$("#influenceMainNodeLi").show();
    			$("#delayReasonLi").show();
    		}
    	}
    	
    }

    // 修改预警状态
    function updateStatusForTemplet4(nodeId, status, document) {
        var nodeIds = getNodeIds();
        if (nodeIds.length < 1) {
            alert("请选择至少一个业态");
            return;
        }
        if (status == '2') {
            updateDelayCompleteDateForTemplet4(nodeId, status, document, nodeIds);
        } else {
            if (status == '3' || status == '4') {
                TB_showMaskLayer("正在执行,请稍候...");
                $.post(_ctx + "/plan6/plan6!saveHistory.action",
                    {'nodeId': nodeId, 'operType': status, 'delayCompleteDate': $("#newDelayCompleteDate").val(), 'nodeIds': nodeIds.join(",")},
                    function (r) {
                        TB_removeMaskLayer();
                        if (r != 'succ') {
                            alert('后台错误！');
                        } else {
                            window.location.href=location.href;
                            refreshDetail(document);
                        }
                    });
            } else {
                if (confirm("是否确认此操作？")) {
                    TB_showMaskLayer("正在执行,请稍候...");
                    $.post(_ctx + "/plan6/plan6!saveHistory.action",
                        {'nodeId': nodeId, 'operType': status, 'delayCompleteDate': $("#newDelayCompleteDate").val(), 'nodeIds': nodeIds.join(",")},
                        function (r) {
                            TB_removeMaskLayer();
                            if (r != 'succ') {
                                alert('后台错误！');
                            } else {
                                window.location.href=location.href;
                                refreshDetail(document);
                            }
                        });
                }
            }

        }
    }

    function updateDelayCompleteDateForTemplet4(nodeId, status, document, nodeIds) {
        var text = "<div id='simTestContent1' class='simScrollCont'>" +
            "<ul class='ul-senior'>" +
            "<li>" +
            "<label style='padding-left:48px;'>延期日期：</label>" +
            "<input type='text' id='newDelayCompleteDate' class='input-width-35 datepicker' readonly='readonly'/>" +
            "</li>" +
            "<li style='padding-top:10px;'>" +
            "<label style='padding-left:110px;'></label>" +
            "<input type='button' class='btn-blue' id='okBtn' value='确定'/>" +
            "<label style='padding-left:5px;'></label>" +
            "<input type='button' class='btn-blue' id='cnlBtn' value='取消'/>" +
            "</li>" +
            "</ul>" +
            "</div>";

        tipsWindown({
            title: "延期时间",
            content: "text:" + text,
            width: 350,
            height: 150,
            drag: "true",
            showbg: "true",
            btn: false,
            scroll_move: "true",
            cssName: "simTestContent",
            backcall: function () {
                loadDatepicker();
                $("#windown-close").click(function () {
                    closeWindown();
                });
                $("#cnlBtn").click(function () {
                    closeWindown();
                });
                $("#okBtn").click(function () {
                    if ($("#newDelayCompleteDate").val() == '') {
                        alert("请选择延期时间！");
                        return;
                    } else {
                        closeWindown();
                        TB_showMaskLayer("正在执行,请稍候...");
                        $.post(_ctx + "/plan6/plan6!saveHistory.action",
                            {'nodeId': nodeId, 'operType': status, 'delayCompleteDate': $("#newDelayCompleteDate").val(), 'nodeIds': nodeIds.join(",")},
                            function (r) {
                                TB_removeMaskLayer();
                                if (r != 'succ') {
                                    alert('后台错误！');
                                } else {
                                    refreshDetail(document);
                                }
                            });
                    }
                });
            }
        });
    }
</script>
