<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'tipo',
        'estado',
    ];

    public function lectura()
    {
        return $this->hasMany(Lectura::class);
    }
}
