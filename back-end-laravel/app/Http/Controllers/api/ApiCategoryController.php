<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\api\CategoryApiRequest;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Response;


class ApiCategoryController extends Controller
{
    public function index()
    {
        $search = request()->query('search');
        $startDate = request()->query('start_date');
        $endDate = request()->query('end_date');
        $sortOrder = request()->query('sort_order', 'desc');
        $perPage = request()->query('per_page', 8);


        if (!is_numeric($perPage) || $perPage <= 0) {
            $perPage = 8;
        }

        $query = Category::query();
        if ($search) {
            $query->where('name', 'LIKE', "%{$search}%");
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
        // $categories = $query->orderBy('created_at', $sortOrder)->get();
        $categories = $query->orderBy('created_at', $sortOrder)->paginate($perPage);
        return response()->json($categories, Response::HTTP_OK);
    }

    public function store(CategoryApiRequest $request)
    {

        $categories = Category::create($request->all());

        return response()->json([
            'message' => "Registro creado satisfactoriamente",
            'category' => $categories
        ], Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $categories = Category::with('benefits')->find($id);

        if (!$categories) {
            return response()->json(['message' => "No se encontró el ID especificado."], Response::HTTP_NOT_FOUND);
        }

        return response()->json($categories, 200);
    }

    public function update(CategoryApiRequest $request, $id)
    {
        $categories = Category::find($id);

        if (!$categories) {
            return response()->json(['message' => "No se encontró el ID especificado."], Response::HTTP_NOT_FOUND);
        }

        $categories->update($request->all());
        return response()->json([
            'message' => "Registro actualizado satisfactoriamente",
            'category' => $categories
        ], Response::HTTP_OK);
    }


    public function destroy(string $id)
    {
        $categories = Category::find($id);

        if (!$categories) {
            return response()->json([
                'message' => "No se encontró el ID especificado para eliminar."
            ], Response::HTTP_NOT_FOUND);
        }
        $categories->delete();

        return response()->json([
            'message' => "Registro eliminado satisfactoriamente"
        ], Response::HTTP_OK);
    }
}
