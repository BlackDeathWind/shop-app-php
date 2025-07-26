<?php
// routes/web.php
return [
    // Auth
    ['method' => 'POST', 'path' => '/api/auth/login', 'controller' => 'AuthController', 'action' => 'post'],
    ['method' => 'POST', 'path' => '/api/auth/register', 'controller' => 'AuthController', 'action' => 'register'],
    ['method' => 'POST', 'path' => '/api/auth/logout', 'controller' => 'AuthController', 'action' => 'logout'],

    // User
    ['method' => 'GET', 'path' => '/api/users/{id}', 'controller' => 'UserController', 'action' => 'get', 'middleware' => 'AuthMiddleware'],
    ['method' => 'PUT', 'path' => '/api/users/{id}', 'controller' => 'UserController', 'action' => 'put', 'middleware' => 'AuthMiddleware'],
    ['method' => 'PUT', 'path' => '/api/users/{id}/change-password', 'controller' => 'UserController', 'action' => 'change_password', 'middleware' => 'AuthMiddleware'],

    // Category
    ['method' => 'GET', 'path' => '/api/categories', 'controller' => 'CategoryController', 'action' => 'get'],
    ['method' => 'GET', 'path' => '/api/categories/{id}', 'controller' => 'CategoryController', 'action' => 'get'],
    ['method' => 'POST', 'path' => '/api/categories', 'controller' => 'CategoryController', 'action' => 'post', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'PUT', 'path' => '/api/categories/{id}', 'controller' => 'CategoryController', 'action' => 'put', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'DELETE', 'path' => '/api/categories/{id}', 'controller' => 'CategoryController', 'action' => 'delete', 'middleware' => 'RoleMiddleware', 'roles' => [0]],

    // Product
    ['method' => 'GET', 'path' => '/api/products', 'controller' => 'ProductController', 'action' => 'get'],
    ['method' => 'GET', 'path' => '/api/products/{id}', 'controller' => 'ProductController', 'action' => 'get'],
    ['method' => 'POST', 'path' => '/api/products', 'controller' => 'ProductController', 'action' => 'post', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'PUT', 'path' => '/api/products/{id}', 'controller' => 'ProductController', 'action' => 'put', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'DELETE', 'path' => '/api/products/{id}', 'controller' => 'ProductController', 'action' => 'delete', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],

    // Order
    ['method' => 'GET', 'path' => '/api/orders', 'controller' => 'OrderController', 'action' => 'get', 'middleware' => 'AuthMiddleware'],
    ['method' => 'GET', 'path' => '/api/orders/{id}', 'controller' => 'OrderController', 'action' => 'get', 'middleware' => 'AuthMiddleware'],
    ['method' => 'POST', 'path' => '/api/orders', 'controller' => 'OrderController', 'action' => 'post', 'middleware' => 'AuthMiddleware'],
    ['method' => 'PUT', 'path' => '/api/orders/{id}', 'controller' => 'OrderController', 'action' => 'put', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'DELETE', 'path' => '/api/orders/{id}', 'controller' => 'OrderController', 'action' => 'delete', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],

    // Order Detail
    ['method' => 'GET', 'path' => '/api/order-details', 'controller' => 'OrderDetailController', 'action' => 'get', 'middleware' => 'AuthMiddleware'],
    ['method' => 'GET', 'path' => '/api/order-details/{id}', 'controller' => 'OrderDetailController', 'action' => 'get', 'middleware' => 'AuthMiddleware'],
    ['method' => 'POST', 'path' => '/api/order-details', 'controller' => 'OrderDetailController', 'action' => 'post', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'PUT', 'path' => '/api/order-details/{id}', 'controller' => 'OrderDetailController', 'action' => 'put', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'DELETE', 'path' => '/api/order-details/{id}', 'controller' => 'OrderDetailController', 'action' => 'delete', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],

    // Upload
    ['method' => 'POST', 'path' => '/api/upload', 'controller' => 'UploadController', 'action' => 'post', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'POST', 'path' => '/api/upload/multiple', 'controller' => 'UploadController', 'action' => 'multiple', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],

    // Admin
    ['method' => 'GET', 'path' => '/api/admin/dashboard', 'controller' => 'AdminController', 'action' => 'get', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'GET', 'path' => '/api/admin/users/customers', 'controller' => 'UserController', 'action' => 'getAllCustomers', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'GET', 'path' => '/api/admin/users/staff', 'controller' => 'UserController', 'action' => 'getAllStaff', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    // Admin Orders
    ['method' => 'GET', 'path' => '/api/admin/orders', 'controller' => 'OrderController', 'action' => 'get', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'GET', 'path' => '/api/admin/orders/{id}', 'controller' => 'OrderController', 'action' => 'get', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
    ['method' => 'PUT', 'path' => '/api/admin/orders/{id}', 'controller' => 'OrderController', 'action' => 'put', 'middleware' => 'RoleMiddleware', 'roles' => [0,1]],
];
