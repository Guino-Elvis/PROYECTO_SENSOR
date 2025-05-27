<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SensorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('configurations')->insert([
            'nombre_config' => 'intervalo_insercion',
            'valor' => '120',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $sensores = [
            ['nombre' => "DHT11", 'tipo' => "TempHum"],
            ['nombre' => "MQ135", 'tipo' => "Gases"],
            ['nombre' => "MQ7", 'tipo' => "CO"],
            // ['nombre' => "LM35", 'tipo' => "Temperatura"],
        ];

        foreach ($sensores as $sensor) {
            $sensorId = DB::table('sensors')->insertGetId([
                'nombre' => $sensor['nombre'],
                'tipo' => $sensor['tipo'],
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // for ($i = 0; $i < 5; $i++) {
            //     DB::table('lecturas')->insert([
            //         'valor1' => rand(10, 100),
            //         'valor2' => rand(10, 100),
            //         'fecha' => Carbon::now()->subDays($i)->subHours(rand(0, 12))->subMinutes(rand(0, 59))->subSeconds(rand(0, 59)),
            //         'sensor_id' => $sensorId,
            //         'created_at' => now(),
            //         'updated_at' => now(),
            //     ]);
            // }
        }
    }
}
