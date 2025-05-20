<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\api\ApiConfigurationRequest;
use App\Models\Configuration;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApiConfigurationController extends Controller
{
    public function index()
    {
        $user =  User::find(Auth::id());
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $search = request()->query('search');
        $startDate = request()->query('start_date');
        $endDate = request()->query('end_date');
        $sortOrder = request()->query('sort_order', 'desc');
        $perPage = request()->query('per_page', 8);


        if (!is_numeric($perPage) || $perPage <= 0) {
            $perPage = 8;
        }

        $query = Configuration::query();
        if ($search) {
            $query->where('nombre_config', 'LIKE', "%{$search}%");
        }
        if ($startDate) {
            $startDate = Carbon::parse($startDate)->startOfDay();
            $query->where('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $endDate = Carbon::parse($endDate)->endOfDay();
            $query->where('created_at', '<=', $endDate);
        }
        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }
        $sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? $sortOrder : 'desc';
        $configurations = $query->orderBy('created_at', $sortOrder)->paginate($perPage);
        return response()->json($configurations, Response::HTTP_OK);
    }

    public function store(ApiConfigurationRequest $request)
    {
        DB::beginTransaction();

        try {
            $configurations = Configuration::create($request->all());
            DB::commit();
            return response()->json([
                'message' => "Registro creado satisfactoriamente",
                'configurations' => $configurations
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => "Error al crear el registro",
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(ApiConfigurationRequest $request, $id)
    {

        DB::beginTransaction();

        try {
            $configurations = Configuration::find($id);

            if (!$configurations) {
                return response()->json(['message' => "No se encontró el ID especificado."], Response::HTTP_NOT_FOUND);
            }

            $configurations->update($request->all());

            DB::commit();
            return response()->json([
                'message' => "Registro actualizado satisfactoriamente",
                'configuration' => $configurations
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => "Error al actualizar el registro",
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(string $id)
    {
        DB::beginTransaction();

        try {
            $configurations = Configuration::find($id);

            if (!$configurations) {
                return response()->json([
                    'message' => "No se encontró el ID especificado para eliminar."
                ], Response::HTTP_NOT_FOUND);
            }

            $configurations->delete();

            DB::commit();
            return response()->json([
                'message' => "Registro eliminado satisfactoriamente"
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => "Error al eliminar el registro",
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
