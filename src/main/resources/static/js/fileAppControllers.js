/* js/fileAppControllers.js */

function fileCtrl ($scope, $http, $log, $timeout, Upload) {
    $scope.partialDownloadLink = 'http://localhost:8080/download?filename=';
    $scope.imagePath = 'http://localhost:8080/download?filename=parrot.jpg';
    $scope.filename = '';
    
    $scope.fileUpload = {};
    
    $scope.init = function (imageName) {
    	$http.get("image/" + imageName)
    	.then(function(response) {
    		$log.info(response.data);
    		$scope.fileUpload = response.data;
    		/*
    		var blob = new Blob( [ $scope.fileUpload.file ], { type: $scope.fileUpload.mimeType } );
    		var fileURL = URL.createObjectURL(blob);
    		$log.info(blob);
    		$log.info(fileURL);
    		
    		$scope.imageURL = fileURL;
    		*/
    	});
    }

    $scope.uploadFile = function() {
        $scope.processDropzone();
    };

    $scope.reset = function() {
        $scope.resetDropzone();
    };
    
    //******** ng-file-upload
	$scope.uploadPic = function(file) {
		$scope.formUpload = true;
		if (file != null) {
			upload(file)
		}
	};
	
	function upload(file) {
		$scope.errorMsg = null;
		uploadUsingUpload(file);
		//uploadUsing$http(file);
		/*
		if ($scope.howToSend === 1) {
			uploadUsingUpload(file);
		} else if ($scope.howToSend == 2) {
			uploadUsing$http(file);
		} else {
			uploadS3(file);
		}
		*/
	}

		
	function uploadUsingUpload(file) {
		file.upload = Upload.upload({
			url : 'uploadPic' + $scope.getReqParams(),
			method : 'POST',
			headers : {
				'Content-Type' : undefined
			},
			/*fields : {
				username : $scope.username
			},*/
			fields: $scope.fileUploadNew,
			file : file,
			fileFormDataName : 'picture'
		});
		file.upload.then(function(response) {
			$timeout(function() {
				file.result = response.data;
			});
		}, function(response) {
			if (response.status > 0)
				$scope.errorMsg = response.status + ': ' + response.data;
		});
		file.upload.progress(function(evt) {
			// Math.min is to fix IE which reports 200% sometimes
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded
					/ evt.total));
		});
		file.upload.xhr(function(xhr) {
			// xhr.upload.addEventListener('abort',
			// function(){console.log('abort complete')}, false);
		});
	}

		
	function uploadUsing$http(file) {
		file.upload = Upload.http({
			url : 'uploadPic'
					+ $scope.getReqParams(),
			method : 'POST',
			headers : {
				/*'Content-Type' : file.type*/
				'Content-Type' : undefined
			},
			data : file
		});
		file.upload.then(function(response) {
			file.result = response.data;
		}, function(response) {
			if (response.status > 0)
				$scope.errorMsg = response.status + ': ' + response.data;
		});
		file.upload.progress(function(evt) {
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded
					/ evt.total));
		});
	}
	
	$scope.getReqParams = function () {
		return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
		'&errorMessage=' + $scope.serverErrorMsg : '';
	};
	
	//Initialization
	$scope.init("boy");
}

var ngJsTreeController = function($scope, $log, $timeout,toaster) {
	var newId = 1;
	$scope.ignoreChanges = false;
	$scope.newNode = {};
	$scope.originalData = [
        { id : 'ajson1', parent : '#', text : 'Simple root node', state: { opened: true} },
        { id : 'ajson2', parent : '#', text : 'Root node 2', state: { opened: true} },
        { id : 'ajson3', parent : 'ajson2', text : 'Child 1', state: { opened: true} },
        { id : 'ajson4', parent : 'ajson2', text : 'Child 2' , state: { opened: true}}
    ];
	$scope.treeData = [];
    angular.copy($scope.originalData,$scope.treeData);
    $scope.treeConfig = {
        core : {
            multiple : false,
            animation: true,
            error : function(error) {
                $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback : true,
            worker : true
        },
        types : {
            default : {
                icon : 'glyphicon glyphicon-flash'
            },
            star : {
                icon : 'glyphicon glyphicon-star'
            },
            cloud : {
                icon : 'glyphicon glyphicon-cloud'
            }
        },
        version : 1,
        plugins : ['types','checkbox']
    };


    $scope.reCreateTree = function() {
        vm.ignoreChanges = true;
        angular.copy(this.originalData,this.treeData);
        vm.treeConfig.version++;
    };

    $scope.simulateAsyncData = function() {
    	$scope.promise = $timeout(function(){
    		$scope.treeData.push({ id : (newId++).toString(), parent : $scope.treeData[0].id, text : 'Async Loaded' })
        },3000);
    };

    $scope.addNewNode = function() {
    	$scope.treeData.push({ id : (newId++).toString(), parent : $scope.newNode.parent, text : $scope.newNode.text });
    };

    this.setNodeType = function() {
        var item = _.findWhere(this.treeData, { id : this.selectedNode } );
        item.type = this.newType;
        toaster.pop('success', 'Node Type Changed', 'Changed the type of node ' + this.selectedNode);
    };

    this.readyCB = function() {
        $timeout(function() {
        	$scope.ignoreChanges = false;
            toaster.pop('success', 'JS Tree Ready', 'Js Tree issued the ready event')
        });
    };

    this.createCB  = function(e,item) {
        $timeout(function() {toaster.pop('success', 'Node Added', 'Added new node with the text ' + item.node.text)});
    };

    this.applyModelChanges = function() {
        return !$scope.ignoreChanges;
    };
};

angular.module('fileApp').controller('fileCtrl', fileCtrl);
angular.module('fileApp').controller('ngJsTreeController', ngJsTreeController);