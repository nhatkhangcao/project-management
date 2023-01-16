<?php

namespace App\Repositories\Product;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Expr\FuncCall;
use Illuminate\Support\Str;
use Haruncpi\LaravelIdGenerator\IdGenerator;
use App\Helpers\Helper;

class ProductRepository implements ProductRepositoryInterface
{

   protected $product;
   public function __construct(Product $product)
   {
      $this->product = $product;
   }
   public function getListProduct()
   {
      $product = $this->product->where("is_delete", 0)->orderBy('id', 'DESC')->paginate(20);
      return $product;
   }
   public function searchProduct($request)
   {
      $product = $this->product->where('is_delete', 0);
      if (isset($request->product_name)) {
         $product->where('product_name', 'LIKE', '%' . $request->product_name . '%');
      }
      if (isset($request->status) && $request->status != 'status') {
         $product->where('status', $request->status);
      }

      if (isset($request->from)) {
         $product->where('product_price', '>=', (int)$request->from);
      }
      if (isset($request->to)) {
         $product->where('product_price', '<=',(int)$request->to);
      }
      return $product->orderBy('id', 'DESC')->paginate(20);
   }
   public function addProduct($request)
   {    
     $product = $this->product;
      $product_id = Helper::IDGenarator(new Product,'product_id',$request->product_name[0]);

      $dataCreate = [
         'product_id' => $product_id,
         'product_name' => $request->product_name,
         'product_price' => $request->product_price,
         'product_detail' => $request->product_detail,
         'status' => $request->status,
      ];
      if ($request->file('image')) {
         $file = $request->file('image');
         $filename = 'uploads/' . date('YmdHi') . $file->getClientOriginalName();
         $file->move(('uploads/'), $filename);
         $dataCreate['image']  =  $filename;
      }
      $product->create($dataCreate);

      return response()->json([
         'message' => 'Success',
      ]);
   }
   public function destroyProduct($id)
   {
      $product = $this->product->find($id)->update(['is_delete' => 1]);
      return $product;
   }
   public function editProduct($id, $request)
   {
      $product = $this->product->find($id);

      $dataCreate = [
         'product_name' => $request->product_name,
         'product_price' => $request->product_price,
         'product_detail' => $request->product_detail,
         'status' => $request->status,
      ];
      if ($request->file('image')) {
         $file = $request->file('image');
         $filename = 'uploads/' . date('YmdHi') . $file->getClientOriginalName();
         $file->move(('uploads/'), $filename);
         $dataCreate['image']  =  $filename;
      }
      $product->update($dataCreate);

      return response()->json([
         'message' => 'Success',
      ]);
   }
   public function deleteImg($id, $request)
   {
      $product = $this->product->find($id)->update(['image' => null]);
      return $product;
   }
}