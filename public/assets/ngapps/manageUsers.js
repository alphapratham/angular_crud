//App Created Using angular module
const app = angular.module('manageUsers', ['ngSanitize', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.modal']);


//Controller Created For Angular App
/**
 * $scope for data of controller
 * $http for AJAX
 * $uibModal for Modal Popup
 */
app.controller('manageUsersController', ['$scope', '$http', '$uibModal', ($scope, $http, $uibModal) => {
    //Data Used For Controller
    $scope.users = [];

    //Method To Init Controller
    $scope.init = function () {
        $scope.getAllUsers();
    }

    //Method To Get All Users
    $scope.getAllUsers = () => {
        $http.get('/getAllUsers').then((res) => {
            console.log(res);
            $scope.users = res.data;
        }).catch((err) => {
            console.log(err);
        })
    };

    //Method To Delete User
    $scope.deleteUser = (userId, index) => {
        console.log(userId)
        $http.delete('/deleteUser/' + userId).then((res) => {
            $scope.users.splice(index, 1);
        }).catch((err) => {
            console.log(err);
        })
    }

    //Method To Open Create or Edit User Modal
    $scope.openModal = (mode, data, index) => {
        let modalData = {};

        if (mode == 'edit') {
            modalData = data;
            modalData.index = index;
        }
        modalData.mode = mode
        $scope.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: "modal.html",
            controller: "userModalController",
            scope: $scope,
            backdrop: false,
            size: "lg",
            windowClass: "show",
            resolve: {
                record: function () {
                    return modalData;
                },
            },
        })
    }
}]);


app.controller('userModalController', ['$scope', '$http', 'record', '$window', ($scope, $http, record, $window) => {
    //Controller Data Variables Declared Here
    $scope.newUser = {};

    //Method To Init Controller
    function init() {
        console.log(record)
        $scope.newUser = record;
    }


    init();

    //Method To Add User
    $scope.addUser = () => {
        $http.post('/createUser', $scope.newUser).then((res) => {
            console.log("Success", res);
            //Disable Comment If You Want To Refresh Page
            // $window.location.reload();
            $scope.users.push(res.data);
            $scope.close();
        }).catch((err) => {
            console.log(err);
        })
    };

    //Method to edit user
    $scope.editUser = function () {
        $http.put('/editUser/' + $scope.newUser._id, $scope.newUser).then((res) => {
            console.log(res)
            $scope.users[$scope.newUser.index] = res.data;
            $scope.close();
        }).catch((err) => {
            console.log(err);
        })
    }

    $scope.close = () => { $scope.modalInstance.close() };
}]);

