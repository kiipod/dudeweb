<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Referral;
use App\Models\User;

class TestController extends Controller
{
    public function __invoke()
    {
        $user = Category::where('id', '07acbc74-e8a5-4b1f-8bf1-a42f2fe42286')->first();
        dd($user->products);
    }
}
