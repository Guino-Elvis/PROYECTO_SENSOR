<?php

use App\Http\Controllers\api\ApiAuthController;
use App\Http\Controllers\api\ApiCategoryController;
use App\Http\Controllers\api\ApiCompanyController;
use App\Http\Controllers\api\ApiConfigurationController;
use App\Http\Controllers\api\ApiContractController;
use App\Http\Controllers\api\ApiDeliveredFoodController;
use App\Http\Controllers\api\ApiDetalleContratoController;
use App\Http\Controllers\api\ApiInstitutionController;
use App\Http\Controllers\api\ApiMenuRolController;
use App\Http\Controllers\api\ApiPickingController;
use App\Http\Controllers\api\ApiPreCargaInstitutionController;
use App\Http\Controllers\api\ApiRRSSEntregaBolsaController;
use App\Http\Controllers\api\ApiSensorController;
use App\Http\Controllers\api\ApiUserAdministrationCompanyController;
use App\Http\Controllers\api\ApiUserController;
use App\Http\Controllers\api\RoleController;
use App\Http\Requests\api\ApiPickingRequest;
use App\Http\Requests\api\ApiPreCargaRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::post('/auth/register', [ApiAuthController::class, 'createUser']);
Route::post('/auth/login', [ApiAuthController::class, 'loginUser']);

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {


    Route::get('data/menu', [ApiMenuRolController::class, 'getMenu']);

    Route::post('/auth/logout', [ApiAuthController::class, 'logoutUser'])->middleware('can:auth.logout');
    Route::post('/auth/refresh', [ApiAuthController::class, 'refresh'])->middleware('can:auth.refresh');
    Route::get('/auth/user', [ApiAuthController::class, 'getUserData'])->middleware('can:auth.me');

    Route::apiResource('categories', ApiCategoryController::class)->middleware('can:admin.categories');
    Route::apiResource('companies', ApiCompanyController::class)->middleware('can:admin.companies');
    Route::apiResource('configurations', ApiConfigurationController::class)->middleware('can:admin.configurations');
    Route::apiResource('sensores',ApiSensorController::class)->middleware('can:admin.sensores');
   

    Route::apiResource('administration_user',  ApiUserAdministrationCompanyController::class)->middleware('can:admin.usercompanies');
    Route::apiResource('role',  RoleController::class)->middleware('can:admin.roles');
    Route::apiResource('users',  ApiUserController::class)->middleware('can:admin.users');

  
});
