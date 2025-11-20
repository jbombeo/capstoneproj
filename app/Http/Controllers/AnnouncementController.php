<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Laravel\Facades\Image;


class AnnouncementController extends Controller
{
    public function index()
    {
        return Inertia::render('sk/announcement', [
            'announcements' => Announcement::with('creator')
                ->latest()
                ->paginate(12)
                ->through(fn ($a) => [
                    'id'        => $a->id,
                    'title'     => $a->title,
                    'excerpt'   => substr(strip_tags($a->content), 0, 120) . '...',
                    'date'      => $a->created_at->format('M d, Y'),
                    'image_path'=> $a->image_path,
                    'author'    => $a->creator?->name ?? 'Unknown',
                    'created_at'=> $a->created_at,
                ])
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'image'   => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        ]);

        // Save image (no Intervention)
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('announcements', 'public');
        }

        // Store SK user who created it
        $data['created_by'] = auth()->id();

        Announcement::create($data);

        return back()->with('success', 'Announcement posted successfully.');
    }

    public function destroy(Announcement $announcement)
    {
        if ($announcement->image_path) {
            Storage::disk('public')->delete($announcement->image_path);
        }

        $announcement->delete();

        return back()->with('success', 'Announcement deleted successfully.');
    }
}
