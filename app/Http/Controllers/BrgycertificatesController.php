<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BrgycertificatesController extends Controller
{
    public function index(){
        return Inertia::render('brgycertificates'); 

    }
}
