/**
 * Created by whobird on 17/5/5.
 */

/*
* <script src="js/jquery.iframe-transport.js"></script>
 <!-- The basic File Upload plugin -->
 <script src="js/jquery.fileupload.js"></script>
 <!-- The File Upload processing plugin -->
 <script src="js/jquery.fileupload-process.js"></script>
 <!-- The File Upload image preview & resize plugin -->
 <script src="js/jquery.fileupload-image.js"></script>

 <!-- The File Upload validation plugin -->
 <script src="js/jquery.fileupload-validate.js"></script>
 <!-- The File Upload Angular JS module -->
 <script src="js/jquery.fileupload-angular.js"></script>
 <!-- The main application script -->
 <script src="js/app.js"></script>
*
*
* */

define(["jquery","angular","zrender/zrender","./app.controllers"],
    function($,angular,zrender,controllers){

    controllers.controller("fileCtrl",["$rootScope","$scope","$http",'FileUploader',function($rootScope,$scope,$http,FileUploader){

         var self=this;

        var uploader = $scope.uploader = new FileUploader({
            url: 'upload.php'
        });

        // FILTERS
        // a sync filter
        uploader.filters.push({
            name: 'syncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
        });

        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);

    }]);

    });