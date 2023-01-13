<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
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
            'email'      => ['required', 'string', 'max:255', 'email:rfc,dns'],
            'password'   => ['required', 'string', 'between:8,255'],

        ];
    }
    public function messages()
    {
        return [
            'email.required' => ('Please enter a valid :attribute address.'),
            'password.required' => ('Please enter a password.')

        ];
    }
}