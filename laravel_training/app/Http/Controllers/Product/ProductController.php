<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddProductRequest;
use App\Repositories\Product\ProductRepository;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productRepository;
    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }
    public function index()
    {
        return $this->productRepository->getListProduct();
    }
    public function searchProduct(Request $request)
    {
        return $this->productRepository->searchProduct($request);
    }
    public function addProduct(AddProductRequest $request)
    {
        return $this->productRepository->addProduct($request);
    }
    public function destroyProduct($id)
    {
        $destroy = $this->productRepository->destroyProduct($id);
        if ($destroy) {
            $response = [
                'code' => 201,
            ];
        }
        return $response;
    }
    public function editProduct($id, AddProductRequest $request)
    {
        $updated = $this->productRepository->editProduct($id, $request);
        if ($updated) {
            $response = [  
                'code' => 200,
                'status' => 'ok',
            ];
        }
        return $response;
    }
    public function deleteImg($id, Request $request)
    {
        $updated = $this->productRepository->deleteImg($id, $request);
        if ($updated) {
            $response = [
                'status' => 'delete successful',
            ];
        }
        return $response;
    }
}