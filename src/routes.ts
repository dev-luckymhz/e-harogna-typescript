import express, {Router} from 'express';
import { authenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from './controller/authController';
import { fetchAllCourse } from './controller/CourseController';
import { UploadImage } from './controller/imageController';
import { fetchPermission } from './controller/permissionController';
import { createRole, DeleteRole, fetchRole, getOneRole, UpdateRole } from './controller/roleController';
import { createUser, DeleteUser, fetchAllUser, getOneUser, UpdateUser } from './controller/userController';
import { Course } from './entity/course.entity';
import { authMiddleware } from './middleware/auth.middleware';
import { permissionMiddleware } from './middleware/permission.middleware';

export const routes = (router: Router )=>{

    router.get('/', function(req , res) {
        res.render('pages/Home');
    });

    router.get('/courses', fetchAllCourse );

    router.get('/coursesfile', function(req , res) {
        res.render('courseItems/index');
    });

    router.get('/createcourse', function(req , res) {

        res.render('Course/create');
    });

    router.post('/api/register', Register)
    router.post('/api/login', Login)
    router.get('/api/user', authMiddleware, authenticatedUser)
    router.post('/api/logout', authMiddleware, Logout)
    router.put('/api/user/update', authMiddleware, UpdateInfo)
    router.put('/api/user/update/password', authMiddleware, UpdatePassword)


    router.get('/api/users', authMiddleware, permissionMiddleware('User'), fetchAllUser)
    router.get('/api/users/:id', authMiddleware, permissionMiddleware('User'), getOneUser)
    router.post('/api/users', authMiddleware, permissionMiddleware('User'), createUser)
    router.put('/api/users/:id', authMiddleware,permissionMiddleware('User'),  UpdateUser)
    router.delete('/api/users/:id', authMiddleware, permissionMiddleware('User'), DeleteUser)


    router.get('/api/permission', authMiddleware, permissionMiddleware('Role'), fetchPermission)

    router.get('/api/role', authMiddleware, permissionMiddleware('Role'), fetchRole)
    router.get('/api/role/:id', authMiddleware, permissionMiddleware('Role'), getOneRole)
    router.post('/api/role', authMiddleware, permissionMiddleware('Role'), createRole)
    router.put('/api/role/:id', authMiddleware, permissionMiddleware('Role'), UpdateRole)
    router.delete('/api/role/:id', authMiddleware, permissionMiddleware('Role'), DeleteRole)

    router.post('/api/upload', authMiddleware, UploadImage)
    router.use('/api/uploads', express.static('./upload'))
    router.use('/assets', express.static('./assets'))

    // router.get('/api/product', authMiddleware, permissionMiddleware('Product'), fetchAllProduct)
    // router.get('/api/product/:id', authMiddleware,  permissionMiddleware('Product'), getOneProduct)
    // router.post('/api/product', authMiddleware, permissionMiddleware('Product'), createProduct)
    // router.put('/api/product/:id', authMiddleware, permissionMiddleware('Product'), UpdateProduct)
    // router.delete('/api/product/:id', authMiddleware, permissionMiddleware('Product'), DeleteProduct)
}