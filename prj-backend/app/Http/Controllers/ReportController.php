<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReportController extends Controller
{
    public function pdf(Request $request)
    {

        $prefix = Str::uuid();
        Storage::put("report-$prefix.pdf", view('reports.report')->render());

        return response()
            ->download('report.pdf')
            ->deleteFileAfterSend();
    }
}
