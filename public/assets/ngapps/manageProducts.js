//App Created Using angular module
const app = angular.module('manageProducts', ['ngSanitize', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.modal']);


//Controller Created For Angular App
/**
 * $scope for data of controller
 * $http for AJAX
 * $uibModal for Modal Popup
 */
app.controller('manageProductsController', ['$scope', '$http', '$uibModal', ($scope, $http, $uibModal) => {
    //Data Used For Controller
    $scope.products = [];

    //Method To Init Controller
    $scope.init = function () {
        $scope.getAllProducts();
        $scope.getAllUsers();
    }

    //Method To Get All Users List
    $scope.getAllUsers = ()=>{
        $http.get('/getAllUsers').then((res) => {
            console.log(res);
            $scope.users = res.data;
        }).catch((err) => {
            console.log(err);
        })
    }

    //Method To Get All Products
    $scope.getAllProducts = () => {
        $http.get('/getAllProducts').then((res) => {
            console.log(res);
            $scope.products = res.data;
        }).catch((err) => {
            console.log(err);
        })
    };

    //Method To Delete Product
    $scope.deleteProduct = (productId, index) => {
        console.log(productId)
        $http.delete('/deleteProduct/' + productId).then((res) => {
            $scope.products.splice(index, 1);
        }).catch((err) => {
            console.log(err);
        })
    }

    //Method To Open Create or Edit Product Modal
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
            controller: "productModalController",
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


app.controller('productModalController', ['$scope', '$http', 'record', '$window', ($scope, $http, record, $window) => {
    //Controller Data Variables Declared Here
    $scope.newProduct = {};

    //Method To Init Controller
    function init() {
        console.log(record)
        $scope.newProduct = record;
    }


    init();

    //Method To Add Product
    $scope.addProduct = () => {
        $http.post('/createProduct', $scope.newProduct).then((res) => {
            console.log("Success", res);
            //Disable Comment If You Want To Refresh Page
            // $window.location.reload();
            $scope.products.push(res.data);
            $scope.close();
        }).catch((err) => {
            console.log(err);
        })
    };

    //Method to edit product
    $scope.editProduct = function () {
        $http.put('/editProduct/' + $scope.newProduct._id, $scope.newProduct).then((res) => {
            console.log(res)
            $scope.products[$scope.newProduct.index] = res.data;
            $scope.close();
        }).catch((err) => {
            console.log(err);
        })
    }

    $scope.close = () => { $scope.modalInstance.close() };
}]);

