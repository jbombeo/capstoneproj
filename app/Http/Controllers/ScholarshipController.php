<?php

namespace App\Http\Controllers;

use App\Models\Scholarship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ScholarshipController extends Controller
{
    /**
     * Display a listing of scholarships.
     */
public function index(Request $request)
{
    $query = Scholarship::query()
        ->withCount('applications')
        ->with(['applications.youth' => function ($q) {
            $q->select('id', 'first_name', 'last_name', 'email');
        }])
        ->latest();

    if ($search = $request->input('search')) {
        $query->where('title', 'like', "%{$search}%");
    }

    return Inertia::render('sk/scholarships', [
        'scholarships' => $query->paginate(12)->withQueryString(),
        'filters' => $request->only('search'),
    ]);
}

    /**
     * Store a newly created scholarship.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'budget'       => 'nullable|numeric|min:0',
            'open_date'    => 'nullable|date',
            'close_date'   => 'nullable|date|after_or_equal:open_date',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        ]);

        // Image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('scholarships', 'public');
            $data['image_path'] = $path;
        }

        $data['created_by'] = auth()->id();

        Scholarship::create($data);

        return redirect()->route('sk.scholarships.index')
            ->with('success', 'Scholarship created successfully.');
    }

    /**
     * Update an existing scholarship.
     */
    public function update(Request $request, Scholarship $scholarship)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'budget'       => 'nullable|numeric|min:0',
            'open_date'    => 'nullable|date',
            'close_date'   => 'nullable|date|after_or_equal:open_date',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        ]);

        // Replace image if new image is sent
        if ($request->hasFile('image')) {
            if ($scholarship->image_path) {
                Storage::disk('public')->delete($scholarship->image_path);
            }

            $path = $request->file('image')->store('scholarships', 'public');
            $data['image_path'] = $path;
        }

        $scholarship->update($data);

        return redirect()->route('sk.scholarships.index')
            ->with('success', 'Scholarship updated successfully.');
    }

    /**
     * Soft delete a scholarship.
     */
    public function destroy(Scholarship $scholarship)
    {
        if ($scholarship->image_path) {
            Storage::disk('public')->delete($scholarship->image_path);
        }

        $scholarship->delete();

        return back()->with('success', 'Scholarship deleted successfully.');
    }

    /**
     * Restore a soft-deleted scholarship.
     */
    public function restore($id)
    {
        $scholarship = Scholarship::onlyTrashed()->findOrFail($id);
        $scholarship->restore();

        return back()->with('success', 'Scholarship restored successfully.');
    }
}
