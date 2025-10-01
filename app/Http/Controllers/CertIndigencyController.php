<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CertIndigencyController extends Controller
{
    public function index(){
        return Inertia::render('CertificateOfIndigenous'); 

    }
}
