<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $documentTypes = DocumentType::orderBy('name')->get();

        return Inertia::render('settings/services', [
            'documentTypes' => $documentTypes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:100|unique:document_types,name',
            'amount' => 'required|numeric|min:0',
        ]);

        DocumentType::create([
            'name'   => $request->name,
            'amount' => $request->amount,
        ]);

        // Return Inertia response with updated document types
        $documentTypes = DocumentType::orderBy('name')->get();
        return Inertia::render('settings/services', [
            'documentTypes' => $documentTypes,
            'success' => 'Document type created successfully.',
        ]);
    }

    public function update(Request $request, DocumentType $documentType)
    {
        $request->validate([
            'name'   => 'required|string|max:100|unique:document_types,name,' . $documentType->id,
            'amount' => 'required|numeric|min:0',
        ]);

        $documentType->update([
            'name'   => $request->name,
            'amount' => $request->amount,
        ]);

        $documentTypes = DocumentType::orderBy('name')->get();
        return Inertia::render('settings/services', [
            'documentTypes' => $documentTypes,
            'success' => 'Document type updated successfully.',
        ]);
    }

    public function destroy(DocumentType $documentType)
    {
        $documentType->delete();

        $documentTypes = DocumentType::orderBy('name')->get();
        return Inertia::render('settings/services', [
            'documentTypes' => $documentTypes,
            'success' => 'Document type deleted successfully.',
        ]);
    }
}
