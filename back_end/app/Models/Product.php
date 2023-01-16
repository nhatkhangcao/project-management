<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        "id_group",
        "product_id",
        "product_name",
        "product_detail",
        "product_price",
        "status",
        "image",
        "is_delete",
    ];
}