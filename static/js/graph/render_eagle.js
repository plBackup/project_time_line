/**
 * Created by whobird on 17/5/2.
 */
/**
 * Created by whobird on 17/4/26.
 */
/**
 * Created by whobird on 17/4/26.
 */
define(["jquery","zrender/zrender","./graph","./data_init","zrender/tool/color","zrender/tool/area","zrender/shape/Circle","zrender/shape/Rectangle",'zrender/shape/Isogon',"zrender/shape/Text","zrender/shape/Line","zrender/Group"],
    function($,zrender,graph,data){
        var eagleRender={};
        eagleRender.render=function(zr){

            var canvas_w =parseInt( $(".navbar").css("width"));
            var mainTop=88;
            var canvas_h = document.documentElement.clientHeight- mainTop;
            var h=30;

            //end nodesRender
            var width = Math.ceil(zr.getWidth());
            var height = Math.ceil(zr.getHeight());
            var layer_move_x=0;
            var layer_move_y=0;

            var eagle_width,eagle_height,eagle_eye_width,eagle_eye_height,eagle_positionX,eagle_positionY;

            eagle_width=450;
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
            var imageData=zr.toDataURL();
            //鹰眼绘图
            var eagle_group= new Group({
                    id: 'eagle_eye',
                    position: [eagle_positionX,eagle_positionY]
                }
            );

            eagle_group.addChild(new ImageShape({
                style: {
                    brushType:'both',
                    image: imageData,
                    x: 0,
                    y: 0,
                    width: eagle_width,
                    height: eagle_height,
                    color:'rgba(255,255,255,0.9)',
                    strokeColor:'#29ABE4',
                    lineWidth:3,
                    radius: 0
                },
                //  zlevel:12,
                clickable:false,
                draggable:false,
                hoverable:false,
                onclick:function(e){
                    e.cancelBubble=true;

                }

            }));

            eagle_group.addChild(new RectangleShape({
                style: {
                    brushType:'both',
                    x: 0,
                    y: 0,
                    width: eagle_width,
                    height: eagle_height,
                    color:'rgba(255,255,255,0.6)',
                    strokeColor:'#29ABE4',
                    lineWidth:3,
                    radius: 0
                },
                //  zlevel:12,
                clickable:false,
                draggable:false,
                hoverable:false,
                onclick:function(e){
                    e.cancelBubble=true;

                }
            }));
            eagle_group.addChild(new RectangleShape({
                id:'eagle',
                style: {
                    brushType:'both',
                    x: 0,
                    y: 0,
                    width: eagle_eye_width,
                    height: eagle_eye_height,
                    color:'rgba(255,0,0,0.9)',
                    // strokeColor:'#29ABE4',
                    //lineWidth:3,
                    radius: 0
                },
                // zlevel:12,
                clickable:false,
                draggable:true,
                hoverable:false,
                ondragstart: function (e) {
                    //$('.node-info').remove();

                },//end ondrag start,
                ondrift:function(dx,dy){
                    movePix=graph.defaultPix;
                    if(this.position[0]<0){
                        this.position[0]=0;
                    }else if(this.position[0]> (eagle_width)){
                        this.position[0]=eagle_width;
                    }
                    if(this.position[1]<0){
                        this.position[1]=0;
                    }else if(this.position[1]> (eagle_height)){
                        this.position[1]=eagle_height;
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


        };

        eagleRender.init=function(zr){
            console.log("eagle render -----init===========================");
            //渲染
            eagleRender.render(zr);

        };


        return eagleRender;
    });