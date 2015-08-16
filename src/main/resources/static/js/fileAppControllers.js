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

angular.module('fileApp').controller('fileCtrl', fileCtrl);