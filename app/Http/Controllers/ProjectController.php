<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        return Inertia::render('sk/project', [
            'projects' => Project::latest()->paginate(12),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'required|in:planned,ongoing,completed,cancelled',
            'budget'      => 'nullable|numeric',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $path = 'projects/' . $filename;

            // Resize before saving
            $this->resizeAndSave($file->getRealPath(), $path);

            $data['image_path'] = $path;
        }

        $data['created_by'] = $request->user()->id;

        Project::create($data);

        return back()->with('success', 'Project added successfully.');
    }

    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'required|in:planned,ongoing,completed,cancelled',
            'budget'      => 'nullable|numeric',
            'start_date'  => 'nullable|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        ]);

        if ($request->hasFile('image')) {
            // delete old image
            if ($project->image_path && Storage::disk('public')->exists($project->image_path)) {
                Storage::disk('public')->delete($project->image_path);
            }

            $file = $request->file('image');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $path = 'projects/' . $filename;

            $this->resizeAndSave($file->getRealPath(), $path);

            $data['image_path'] = $path;
        }

        $project->update($data);

        return back()->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        if ($project->image_path && Storage::disk('public')->exists($project->image_path)) {
            Storage::disk('public')->delete($project->image_path);
        }

        $project->delete();

        return back()->with('success', 'Project deleted successfully.');
    }

    /**
     * Resize image using GD and save to storage.
     */
    private function resizeAndSave(string $sourcePath, string $savePath): void
    {
        $info = getimagesize($sourcePath);
        [$width, $height] = $info;
        $mime = $info['mime'];

        $maxWidth = 800;

        // Only resize if width is larger than max
        if ($width > $maxWidth) {
            $ratio = $height / $width;
            $newWidth = $maxWidth;
            $newHeight = intval($maxWidth * $ratio);
        } else {
            $newWidth = $width;
            $newHeight = $height;
        }

        switch ($mime) {
            case 'image/jpeg':
                $src = imagecreatefromjpeg($sourcePath);
                break;
            case 'image/png':
                $src = imagecreatefrompng($sourcePath);
                break;
            default:
                throw new \Exception('Unsupported image type.');
        }

        $dst = imagecreatetruecolor($newWidth, $newHeight);

        // Preserve transparency for PNG
        if ($mime === 'image/png') {
            imagealphablending($dst, false);
            imagesavealpha($dst, true);
            $transparent = imagecolorallocatealpha($dst, 255, 255, 255, 127);
            imagefilledrectangle($dst, 0, 0, $newWidth, $newHeight, $transparent);
        }

        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        // Save to storage
        $absolutePath = Storage::disk('public')->path($savePath);

        // Ensure folder exists
        Storage::disk('public')->makeDirectory(dirname($savePath));

        if ($mime === 'image/png') {
            imagepng($dst, $absolutePath, 8);
        } else {
            imagejpeg($dst, $absolutePath, 85);
        }

        imagedestroy($src);
        imagedestroy($dst);
    }
}
