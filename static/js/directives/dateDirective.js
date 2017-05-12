/**
 * Created by whobird on 17/5/12.
 */
define(["angular","./app.directives"],function(angular,directives){

    directives.directive('datePicker', [
        function() {
            return {
                restrict: 'A',
                scope: {
                    dateSelect:"&",
                    //curMonth:"@"
                    dateDirectiveName:"@"
                },
                require:"ngModel",

                template: '<div class="input-group date ys-datepicker">'+
                            '<input size="16" type="text" value="" data-provide="datepicker" name="date-'+
                            $scope.dateDirectiveName+
                            '" id="date-'+
                            $scope.dateDirectiveName+
                            '">' +
                            '</div>',
                link: function($scope, $element,attrs,ngModelCtrl) {
                    function gd(year, month, day) {
                        return new Date(year, month, day).getTime();
                    }

                    function DateAdd(interval,number,dateStr){

                        // DateAdd(interval,number,date)
                        var date = new Date(dateStr);
                        var d="";
                        switch(interval)
                        {
                            case   "y"   :   {
                                date.setFullYear(date.getFullYear()+number);
                                break;
                            }
                            case   "q"   :   {
                                date.setMonth(date.getMonth()+number*3);
                                break;
                            }
                            case   "m"   :   {
                                date.setMonth(date.getMonth()+number);
                                d=  date.getFullYear()+"-"+(date.getMonth()<9?("0"+(date.getMonth()+1)):(date.getMonth()+1));
                                break;
                            }
                            case   "w"   :   {
                                date.setDate(date.getDate()+number*7);
                                d =date.getFullYear()+"-"+(date.getMonth()<9?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+(date.getDate()<9?("0"+date.getDate()):date.getDate());
                                break;
                            }
                            case   "d"   :   {
                                date.setDate(date.getDate()+number);
                                break;
                            }
                            case   "h"   :   {
                                date.setHours(date.getHours()+number);
                                break;

                            }
                            case   "mi"   :   {
                                date.setMinutes(date.getMinutes()+number);
                                break;
                            }
                            case   "s"   :   {
                                date.setSeconds(date.getSeconds()+number);
                                break;
                            }
                            default   :   {
                                date.setDate(date.getDate()+number);
                                break;
                            }

                        }//end switch
                        if(d!=""){
                            return d;
                        }else{
                            return date.getFullYear()+"-"+(date.getMonth()<9?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+(date.getDate()<9?("0"+date.getDate()):date.getDate());
                        }
                    };

                    var updateModel=function(dateText){
                        $scope.$apply(function(){
                            ngModelCtrl.$setViewValue(dateText);
                        });
                    };



                    ngModelCtrl.$render=function(){
                        //console.log("...")
                        //console.log(ngModelCtrl.$viewValue);
                        $element.find("input").val(ngModelCtrl.$viewValue);
                    }

                    //month Selector
                    var dpicker;
                    var dateSelector=function(){
                        /*var curDate=new Date();
                         var start_date=curDate.getFullYear()+"-"+(curDate.getMonth()+1);
                         */
                        dpicker=$element.find("input").datetimepicker({
                            format:"yyyy-mm-dd",
                            todayBtn:"linked",
                            startView:3,
                            minView:3,
                            autoclose: true,
                            language:"zh-CN",
                        }).on('changeDate', function(e){

                            var dateStr=$element.find("input").val();
                            updateModel(dateStr);
                            if($scope.dateSelect){
                                //如果作用域有处理函数，
                                $scope.$apply(function(){
                                    $scope.dateSelect({date:dateStr});
                                });
                            }

                        });

                    };

                    dateSelector();

                    $element.find("input").on("focus",function(){
                        $(this).closest(".input-group").addClass("out-ring");
                    });
                    $element.find("input").on("blur",function(){
                        $(this).closest(".input-group").removeClass("out-ring");
                    });

                    //destroy
                    $scope.$on("$destroy", function() {
                        //清除配置
                        //console.log("destroy");
                        $element.find("input").datetimepicker("remove");

                    });
                }//end link
            };
        }]);
});