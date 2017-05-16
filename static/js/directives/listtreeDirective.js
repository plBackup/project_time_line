/**
 * Created by whobird on 17/5/12.
 */
define(["angular","./app.directives"],function(angular,directives){

    directives.directive('listTree', [
        function() {
            return {
                restrict: 'A',
                scope: {
                    itemSelect:"&",
                    //curMonth:"@"
                    listData:"="
                },
                //require:"ngModel",

                template: "<div class='ys-list-tree'>"+
                                /*"<li ng-repeat='item in listData' data-id='item.id'>"+
                                    "<span>"+item.name+"</span>"+
                                    '<div ng-if="item.children.length!==0"  list-tree list-data="item.children" item-select="itemSelect(item)">'+
                                    '</div>'+
                                 "</li>"+*/
                            "</div>",
                /*compile:function($element,attrs,transclude){
                    console.log($element);
                    console.log(attrs);
                    console.log(transclude);
                },*/
                link: function($scope, $element,attrs) {
                    console.log($scope.listData);
                    //destroy
                    var data=$scope.listData;

                    function _createDom(data){
                        var items=[];
                        var sub_li=[];
                        $.each(data,function(i,e){

                           if(typeof e.children!=="undefined" && (e.children.length>0)){
                              var child=_createDom(e.children);
                               var li="<li data-id='"+e.id+"' class='ys-tree-item parent'>"+ "<span>"+e.name+"</span>"+
                                   child +
                                   "</li>";
                           }else{
                               var li=( "<li data-id='"+e.id+"' class='ys-tree-item'>"+ "<span>"+e.name+"</span>"+ "</li>");
                           }

                           items.push(li);
                        });
                        return "<ul class='ys-list-tree'>"+items.join("")+"</ul>"
                    }

                   /* var ulDom= _createDom(data).html();*/
                    var ulDom= _createDom(data);
                    $element.html(ulDom);

                    $("body").on("click","li.ys-tree-item",function(e){
                        e.preventDefault();
                        e.stopPropagation();
                       if($(this).hasClass("parent")){
                           $(this).toggleClass("open");
                           if(!$(this).hasClass("open")){
                               $(this).find(".ys-tree-item").removeClass("open");
                           }
                       }else{
                           console.log($(this).data("id"));
                           var itemId=$(this).data("id")
                           $scope.$apply(function() {
                               $scope.itemSelect({id : itemId});
                           });
                       }
                    });

                    $scope.$on("$destroy", function() {
                        //清除配置
                        //console.log("destroy");
                    });
                }//end link
            };
        }]);
});