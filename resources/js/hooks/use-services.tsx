import { useCallback, useEffect, useState } from 'react';

export type DocumentType = {
    id: number;
    name: string;
    description?: string;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') return;

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

export function useDocumentTypes() {
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch all document types
    const fetchDocumentTypes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/document-types'); // adjust route if needed
            const data = await response.json();
            setDocumentTypes(data);
        } catch (error) {
            console.error('Error fetching document types:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Add a document type
    const addDocumentType = useCallback(
        async (type: Omit<DocumentType, 'id'>) => {
            try {
                const response = await fetch('/document-types', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(type),
                });
                if (response.ok) {
                    fetchDocumentTypes();
                }
            } catch (error) {
                console.error('Error adding document type:', error);
            }
        },
        [fetchDocumentTypes]
    );

    // Update a document type
    const updateDocumentType = useCallback(
        async (id: number, type: Partial<DocumentType>) => {
            try {
                const response = await fetch(`/document-types/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(type),
                });
                if (response.ok) {
                    fetchDocumentTypes();
                }
            } catch (error) {
                console.error('Error updating document type:', error);
            }
        },
        [fetchDocumentTypes]
    );

    // Delete a document type
    const deleteDocumentType = useCallback(
        async (id: number) => {
            try {
                const response = await fetch(`/document-types/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchDocumentTypes();
                }
            } catch (error) {
                console.error('Error deleting document type:', error);
            }
        },
        [fetchDocumentTypes]
    );

    useEffect(() => {
        fetchDocumentTypes();
    }, [fetchDocumentTypes]);

    return {
        documentTypes,
        loading,
        addDocumentType,
        updateDocumentType,
        deleteDocumentType,
        refresh: fetchDocumentTypes,
    } as const;
}
