<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'unidad1',
        'unidad2',
        'tipo',
        'estado',
    ];

    public function lectura()
    {
        return $this->hasMany(Lectura::class);
    }
}
