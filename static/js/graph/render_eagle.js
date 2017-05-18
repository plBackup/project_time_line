/**
 * Created by whobird on 17/5/2.
 */
/**
 * Created by whobird on 17/4/26.
 */
/**
 * Created by whobird on 17/4/26.
 */
define(["jquery","zrender/zrender","./graph","./data_init","zrender/tool/color","zrender/tool/area","zrender/shape/Circle","zrender/shape/Rectangle",'zrender/shape/Isogon',"zrender/shape/Text","zrender/shape/Line","zrender/shape/Image","zrender/Group"],
    function($,zrender,graph){
        var eagleRender={};

        var color = require('zrender/tool/color');
        var RectangleShape = require('zrender/shape/Rectangle');
        var Group = require('zrender/Group');
        var ImageShape = require('zrender/shape/Image');
        var Layer=require('zrender/Layer');

        eagleRender.render=function(zr){

            var canvas_w =parseInt( $(".canvas-wrapper").css("width"));
            var mainTop=88;
            var canvas_h = parseInt($(".canvas-wrapper").css("height"));
            var h=30;

            //end nodesRender
         /*   var width = Math.ceil(zr.getWidth());
            var height = Math.ceil(zr.getHeight());*/
            var width=Math.ceil($("#main").data("w"));
            var height=Math.ceil($("#main").data("h"));
            var layer_move_x=0;
            var layer_move_y=0;

            var eagle_width,eagle_height,eagle_eye_width,eagle_eye_height,eagle_positionX,eagle_positionY;

            eagle_width=350;
            eagle_height=eagle_width*(height/width);

            eagle_eye_width=(canvas_w/width)*eagle_width;
            eagle_eye_height=(canvas_h/height)*eagle_height;

            eagle_positionX=canvas_w-eagle_width-20;
            eagle_positionY=canvas_h-eagle_height-20;

            //鹰眼与视图的比例关系
            var coef_x= (width)/(eagle_width);
            var coef_y= (height)/(eagle_height);

            eagle_x_boundary=eagle_width-eagle_eye_width;
            eagle_y_boundary=eagle_height-eagle_eye_height;

            //获取缩略图
            //var zrfake = zrender.getInstance(localStorage.zrfake);
            //var imageData=zrfake.toDataURL();
            //zrfake.dispose();
            var imageData=$("#fake-img").attr("src");
            //鹰眼绘图
            var eagle_group= new Group({
                    id: 'eagle_eye',
                    position: [eagle_positionX,eagle_positionY]
                }
            );


            eagle_group.addChild(new ImageShape({
                id:"eagle_bg",
                style: {
                    brushType:'both',
                    image: imageData,
                    x: 0,
                    y: 0,
                    width: eagle_width,
                    height: eagle_height,
                    color:'rgba(255,255,255,0.9)',
                    strokeColor:'#0084e3',
                    lineWidth:0,
                    radius: 0,
                },
                z:199,
                //  zlevel:12,
                clickable:false,
                draggable:false,
                hoverable:false,
                onclick:function(e){
                    e.cancelBubble=true;

                }

            }));

            eagle_group.addChild(new RectangleShape({
                id:"eagle_rect",
                style: {
                    brushType:'both',
                    x: 0,
                    y: 0,
                    width: eagle_width,
                    height: eagle_height,
                    color:'rgba(255,255,255,0.6)',
                    strokeColor:'#0084e3',
                    lineWidth:3,
                    radius: 0,

                },
                //  zlevel:12,
                z:299,
                clickable:false,
                draggable:false,
                hoverable:false,
                onclick:function(e){
                    e.cancelBubble=true;

                }
            }));
            eagle_group.addChild(new ImageShape({
                id:'eagle',
                style: {
                    brushType:'both',
                    image:"../static/images/opt.png",
                    x: 0,
                    y: 0,
                    width: eagle_eye_width,
                    height: eagle_eye_height,
                    color:'rgba(255,0,0,0.9)',
                    // strokeColor:'#29ABE4',
                    //lineWidth:3,
                    radius: 0,
                },
                z:399,
                // zlevel:12,
                clickable:false,
                draggable:true,
                hoverable:false,
                ondragstart: function (e) {
                    //$('.node-info').remove();
                    $('.node-info').removeClass("active").hide();
                },//end ondrag start,
                ondrift:function(dx,dy){
                    movePix=graph.defaultPix;
                    if(this.position[0]<0){
                        this.position[0]=0;
                    }else if(this.position[0]> (eagle_x_boundary)){
                        this.position[0]=eagle_x_boundary;
                    }
                    if(this.position[1]<0){
                        this.position[1]=0;
                    }else if(this.position[1]> (eagle_y_boundary)){
                        this.position[1]=eagle_y_boundary;
                    }
                    //同步到图形的移动
                    layer_move_x=(-coef_x)*this.position[0];
                    layer_move_y=(-coef_y)*this.position[1];
                    //保持eagle eye的相对屏幕位置不动
                    var eagle_position_x=eagle_positionX-layer_move_x;
                    var eagle_position_y=eagle_positionY-layer_move_y;

                    //x轴，y轴同步偏移
                    $("#date-index").css('left',layer_move_x);
                    $("#project-index").css('top',layer_move_y);

                    zr.modLayer('0',{position:[layer_move_x,layer_move_y]});
                    zr.modGroup("eagle_eye",{position:[eagle_position_x,eagle_position_y]});

                    zr.refresh("0");
                }
            }));
            zr.addGroup(eagle_group);

            /*todo:update: 当页面数据刷新时，同时更新鹰眼视图*/
            /*setTimeout(function(){
                zr.modShape("eagle_bg",{
                    style:{
                        image:"../static/images/opt.png"
                    }
                })
            },3000);*/
        };

        eagleRender.setPosition=function(zr,leftOffset,topOffset){
            var canvas_w =parseInt( $(".canvas-wrapper").css("width"));
            var canvas_h = parseInt($(".canvas-wrapper").css("height"));

            //end nodesRender
            var width = Math.ceil($("#main").data("w"));
            var height = Math.ceil($("#main").data("h"));
            var layer_move_x=leftOffset;
            var layer_move_y=topOffset;

            var eagle_width,eagle_height,eagle_eye_width,eagle_eye_height,eagle_positionX,eagle_positionY;

            eagle_width=350;
            eagle_height=eagle_width*(height/width);

            eagle_eye_width=(canvas_w/width)*eagle_width;
            eagle_eye_height=(canvas_h/height)*eagle_height;

            //鹰眼与视图的比例关系
            var coef_x= (width)/(eagle_width);
            var coef_y= (height)/(eagle_height);

            var eagle_eye_x=layer_move_x/coef_x;
            var eagle_eye_y=layer_move_y/coef_y;


            eagle_positionX=canvas_w-eagle_width-20+layer_move_x;
            eagle_positionY=canvas_h-eagle_height-20+layer_move_y;


            zr.modGroup("eagle_eye",{position:[eagle_positionX,eagle_positionY]});
            zr.modShape("eagle",{
                position:[eagle_eye_x,eagle_eye_y]
            });
        };

        eagleRender.init=function(zr){
            //渲染
            eagleRender.render(zr);
        };



        return eagleRender;
    });