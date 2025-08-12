<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return inertia()->render('Dashboard', [
            'files' => $request->user()->files()->latest()->get(),
        ]);
    }
}
