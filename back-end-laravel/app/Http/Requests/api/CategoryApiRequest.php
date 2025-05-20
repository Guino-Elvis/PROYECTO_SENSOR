<?php

namespace App\Http\Requests\api;

use Illuminate\Foundation\Http\FormRequest;

class CategoryApiRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required',
            'slug' => 'required',
            'status' => 'required',
        ];
    }
}
