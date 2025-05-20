<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear roles
        $role1 = Role::create(['name' => 'Administrador']);
        $role2 = Role::create(['name' => 'Empresa']);
        $role3 = Role::create(['name' => 'Cliente']);
        $role4 = Role::create(['name' => 'Usuario']);



        //autenticacion
        Permission::create(['name' => 'auth.logout', 'description' => 'Cerrar sesión'])->syncRoles([$role1, $role2, $role3, $role4]);
        Permission::create(['name' => 'auth.me', 'description' => 'Ver usuario autenticado'])->syncRoles([$role1, $role2, $role3, $role4]);
        Permission::create(['name' => 'auth.refresh', 'description' => 'Refrescar token de sesión'])->syncRoles([$role1, $role2, $role3, $role4]);
        //roles
        Permission::create(['name' => 'admin.roles', 'description' => 'Ver listado de roles'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.roles.edit', 'description' => 'Editar roles'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.roles.create', 'description' => 'Crear roles'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.roles.assign.permission', 'description' => 'Asignar permisos al rol'])->syncRoles([$role1, $role2]);
        //categorias
        Permission::create(['name' => 'admin.categories', 'description' => 'Ver listado de categorias'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.categories.create', 'description' => 'Crear categorias'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.categories.edit', 'description' => 'Editar categorias'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.categories.delete', 'description' => 'Eliminar categorias'])->syncRoles([$role1, $role2]);
        //configuracion
        Permission::create(['name' => 'admin.configurations', 'description' => 'Ver listado de configuraciones'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.configurations.create', 'description' => 'Crear configuraciones'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.configurations.edit', 'description' => 'Editar configuraciones'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.configurations.delete', 'description' => 'Eliminar configuraciones'])->syncRoles([$role1, $role2]);
        //sensores
        Permission::create(['name' => 'admin.sensores', 'description' => 'Ver listado de sensores'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.sensores.create', 'description' => 'Crear sensores'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.sensores.edit', 'description' => 'Editar sensores'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.sensores.delete', 'description' => 'Eliminar sensores'])->syncRoles([$role1, $role2]);
        //lecturas
        Permission::create(['name' => 'admin.lecturas', 'description' => 'Ver listado de lecturas'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.lecturas.create', 'description' => 'Crear lecturas'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.lecturas.edit', 'description' => 'Editar lecturas'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.lecturas.delete', 'description' => 'Eliminar lecturas'])->syncRoles([$role1, $role2]);
        //usuarios por compañia
        Permission::create(['name' => 'admin.usercompanies', 'description' => 'Ver listado usuarios por empresa'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.usercompanies.create', 'description' => 'Crear usuarios por empresa'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.usercompanies.edit', 'description' => 'Editar usuarios por empresa'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.usercompanies.delete', 'description' => 'Eliminar usuarios por empresa'])->syncRoles([$role1, $role2]);
        //usuarios
        Permission::create(['name' => 'admin.users', 'description' => 'Ver listado de usuarios'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.users.create', 'description' => 'Crear usuarios'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.users.edit', 'description' => 'Editar usuarios'])->syncRoles([$role1, $role2]);
        Permission::create(['name' => 'admin.users.delete', 'description' => 'Eliminar usuarios'])->syncRoles([$role1, $role2]);

        Permission::create(['name' => 'admin.home', 'description' => 'Ver la página principal'])->syncRoles([$role1, $role2, $role3, $role4]);
    }
}
