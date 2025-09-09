import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Household Record',
        href: dashboard().url,
    },
];

export default function Household() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Household Record" />
            sdfsdffdsfdsfsdfdsfsdfdsfdsfdsf
        </AppLayout>
    );
}
