import YouthLayout from "./youthlist";
import OfficialCard from "./OfficialCard";
import PageTitle from "./PageTitle";

interface Official {
    id: number;
    position: string;
    complete_name: string;
    contact: string | null;
    address: string | null;
    term_start: string | null;
    term_end: string | null;
    status: string;
    image?: string | null;
}

interface Props {
    officials: Official[];
}

export default function YouthOfficials({ officials }: Props) {
    return (
        <YouthLayout>
            <div className="space-y-10">
                <PageTitle>SK Officials</PageTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {officials.length === 0 ? (
                        <p className="text-gray-500 text-center col-span-full">
                            No officials found.
                        </p>
                    ) : (
                        officials.map((official) => (
                            <OfficialCard key={official.id} official={official} />
                        ))
                    )}
                </div>
            </div>
        </YouthLayout>
    );
}
