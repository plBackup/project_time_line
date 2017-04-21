/**
 * Created by whobird on 17/4/6.
 */
requirejs.config({
    baseUrl: 'static/dist',
    paths: {
        jquery:"js/jquery",
        "jquery.bootstrap": "js/bootstrap.min",
        zrender: 'zrender-master/src',
    },
    shim: {
        "jquery.bootstrap": {
            deps: ["jquery"]
        }
    }
});

// Start the main app logic.
requirejs(['jquery',"jquery.bootstrap",'zrender/zrender','zrender/graphic/shape/Line','zrender/graphic/shape/Circle','zrender/container/Group','zrender/core/util', ],
    function   ($,bs,zrender,Line,Circle,Group,util) {
        console.log("=====");
        console.log($);
        console.log(zrender);
        console.log(Circle);
        var zr = zrender.init(document.getElementById('main'));
        var CircleShape = Circle;
        zr.clear();
        var c=new CircleShape({
            id:"c1",
            shape : {
                cx : 200,
                cy : 200,
                r : 50,

            },
            style:{
                fill : 'rgba(220, 20, 60, 1)'
            },
            _position:[0,0],
            draggable:true,
            hoverable: false,
            clickable: false,
            ondrag:function(e){
                console.log("=================");
                console.log(this.id);
                console.log(this._position);


                console.log(this.position);
                console.log(e);
                console.log(this.parent);
                console.log("----------------------------------");
                var self=this;
                var x_diff=this.position[0]-this._position[0];
                var y_diff=this.position[1]-this._position[1];
                $.each(this.parent.children(),function(i,child){
                    if(child!==self){
                        console.log("!-----not-------");
                        console.log(child);

                        child.position[0]+=x_diff;
                        child.position[1]+=y_diff;

                        //child.setShape();
                        child.dirty();
                    }
                });

                line.shape.x1+=x_diff;
                line.shape.y1+=y_diff;
                line.dirty();
                //zr.refresh();


                this._position=util.clone(this.position);
            }
        });

        var c2=new CircleShape({
            id:"c2",
            shape : {
                cx : 250,
                cy : 250,
                r : 20,

            },
            style:{
                fill : 'rgba(20, 20, 60, 1)',
                text: "L",

                /**
                 * @type {string}
                 */
                textFill: '#fff',
            },
            position:[-100,-100],
            draggable:false,
            hoverable: false,
            clickable: false,
        });

        var c3=new CircleShape({
            id:"c3",
            shape : {
                cx : 250,
                cy : 250,
                r : 20,

            },
            style:{
                fill : 'rgba(20, 20, 60, 1)',
                text: "R",

                /**
                 * @type {string}
                 */
                textFill: '#fff',
            },
            position:[0,-100],
            draggable:false,
            hoverable: false,
            clickable: false,
        });

        var line=new Line({
            id:"line1",
            shape: {
                // Start point
                x1: 200,
                y1: 200,
                // End point
                x2: 500,
                y2: 600,

                percent: 1
            },
        });

        console.log(c);

        var group=new Group({
            id:"group_1",
            onclick:function(e){
                console.log("=================");
                $("#info-modal").modal("show");
            }
        });
        group.add(c);
        group.add(c2);
        group.add(c3);
        console.log(group.children());
        zr.add(
           group
        );
        zr.add(line);
        //测试group功能

        //var x=c.shape.cx;
        // c.setShape("cx",x+1);
        zr.refresh();
    });