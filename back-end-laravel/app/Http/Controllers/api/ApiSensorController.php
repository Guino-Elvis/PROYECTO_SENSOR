<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\api\ApiSensorRequest;
use App\Models\Sensor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApiSensorController extends Controller
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

        // $query = Sensor::query();
        $query = Sensor::with(['lectura']);
        if ($search) {
            $query->where('nombre', 'LIKE', "%{$search}%");
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
        $sensors = $query->orderBy('created_at', $sortOrder)->paginate($perPage);
        return response()->json(
            $sensors,
            Response::HTTP_OK
        );
    }

    public function grafico(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $tipoFiltro = $request->query('tipo', null);
        $tiempo = $request->query('tiempo', null);

        // Si no hay filtros, retornar todo
        if (!$tipoFiltro && !$tiempo) {
            $sensores = Sensor::with('lectura')->get();
            return response()->json($sensores, Response::HTTP_OK);
        }

        // Calcular "desde" solo si se envía tiempo
        $desde = null;
        if ($tiempo) {
            $desde = match ($tiempo) {
                '60m' => Carbon::now()->subMinutes(60),
                '6h'  => Carbon::now()->subHours(6),
                '12h' => Carbon::now()->subHours(12),
                '24h' => Carbon::now()->subHours(24),
                '7d'  => Carbon::now()->subDays(7),
                '30d' => Carbon::now()->subDays(30),
                default => Carbon::now()->subHour(),
            };
        }

        // Caso especial para Temp, Hum, TempHum
        if (in_array($tipoFiltro, ['Temp', 'Hum', 'TempHum'])) {
            $sensor = Sensor::where('tipo', 'TempHum')
                ->where('id', 1)
                ->with(['lectura' => function ($query) use ($desde) {
                    if ($desde) {
                        $query->where('created_at', '>=', $desde);
                    }
                    $query->orderBy('created_at');
                }])
                ->first();

            if (!$sensor) {
                return response()->json([], Response::HTTP_OK);
            }

            return response()->json([
                [
                    'id' => $sensor->id,
                    'nombre' => $sensor->nombre,
                    'tipo' => $sensor->tipo,
                    'estado' => $sensor->estado,
                    'created_at' => $sensor->created_at,
                    'updated_at' => $sensor->updated_at,
                    'lectura' => $sensor->lectura->map(function ($lectura) use ($tipoFiltro) {
                        $data = $lectura->toArray();
                        if ($tipoFiltro === 'Temp') unset($data['valor2']);
                        elseif ($tipoFiltro === 'Hum') unset($data['valor1']);
                        return $data;
                    })->values()
                ]
            ], Response::HTTP_OK);
        }

        // Si tipo viene, filtrar por tipo
        $sensores = Sensor::when($tipoFiltro, function ($q) use ($tipoFiltro) {
            $q->where('tipo', $tipoFiltro);
        })
            ->with(['lectura' => function ($query) use ($desde) {
                if ($desde) {
                    $query->where('created_at', '>=', $desde);
                }
                $query->orderBy('created_at');
            }])
            ->get();

        return response()->json($sensores, Response::HTTP_OK);
    }


    public function show($id)
    {
        $user =  User::find(Auth::id());
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], Response::HTTP_UNAUTHORIZED);
        }

        $sensor = Sensor::with('lectura')->find($id);

        if (!$sensor) {
            return response()->json(['error' => 'Sensor no encontrada'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($sensor, Response::HTTP_OK);
    }

    public function store(ApiSensorRequest $request)
    {
        DB::beginTransaction();

        try {
            $sensors = Sensor::create($request->all());
            DB::commit();
            return response()->json([
                'message' => "Registro creado satisfactoriamente",
                'sensors' => $sensors
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => "Error al crear el registro",
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(ApiSensorRequest $request, $id)
    {

        DB::beginTransaction();

        try {
            $sensors = Sensor::find($id);

            if (!$sensors) {
                return response()->json(['message' => "No se encontró el ID especificado."], Response::HTTP_NOT_FOUND);
            }

            $sensors->update($request->all());

            DB::commit();
            return response()->json([
                'message' => "Registro actualizado satisfactoriamente",
                'sensor' => $sensors
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
            $sensors = Sensor::find($id);

            if (!$sensors) {
                return response()->json([
                    'message' => "No se encontró el ID especificado para eliminar."
                ], Response::HTTP_NOT_FOUND);
            }

            $sensors->delete();

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
