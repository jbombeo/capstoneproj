<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Middleware;

class SKOnly
{
    public function handle($request, Closure $next)
    {
        if (!Auth::check() || Auth::user()->role !== 'sk') {
            abort(403, 'Unauthorized SK access.');
        }

        return $next($request);
    }
}
