<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'product_name' => ['required', 'min:5'],
            'product_price' => ['required', 'min:0', 'integer'],
            'status' => ['required'],
            'image' => ['nullable', 'mimes:png,jpg,jpeg', 'max:2048',]
        ];
    }
    public function messages()
    {
        return [
            'product_name.required' => ('Please enter the product name!'),
            'product_name.min:5' => ('Please enter the product name at least 5 characters!'),
            'product_price.required' => ('Please enter the product price!'),
            'product_price.min:0' => ('Product Price must not be less than 0'),
            'product_price.integer' => ('Product Price must be integer'),
            'status.required' => ('Status must be non-empty'),
            // 'image.dimensions' => ('Image size should not exceed 1024px'),
        ];
    }
}
