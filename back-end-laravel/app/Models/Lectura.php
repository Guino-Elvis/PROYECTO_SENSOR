<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lectura extends Model
{
    use HasFactory;

    protected $fillable = [
        'valor1',
        'valor2',
        'fecha',
        'sensor_id',
    ];

    public function sensor()
    {
        return $this->belongsTo(Sensor::class);
    }
}
