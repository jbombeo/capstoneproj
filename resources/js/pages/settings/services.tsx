import { Head, usePage } from '@inertiajs/react';
import ServicesTabs from '@/components/services-tabs';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { services } from '@/routes';


interface DocumentType {
  id: number;
  name: string;
  amount: string;
}

interface Props {
  documentTypes: DocumentType[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Services settings',
    href: '/settings/services', // plain URL
  },
];

export default function Services() {
  const { documentTypes } = usePage<{ documentTypes: DocumentType[] }>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Services settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Services settings"
            description="Manage your document types and service fees"
          />
          <ServicesTabs documentTypes={documentTypes} />
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
