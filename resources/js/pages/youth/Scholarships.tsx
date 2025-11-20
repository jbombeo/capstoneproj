import YouthLayout from "./youthlist";
import ScholarshipCard from "./ScholarshipCard";
import PageTitle from "./PageTitle";

interface Scholarship {
    id: number;
    title: string;
    description: string;
    grant_amount: number;
    requirements: string[];
    application_status?: string | null;
}

interface Props {
    scholarships: Scholarship[];
}

export default function Scholarships({ scholarships }: Props) {

    const apply = (id: number) => {
        alert("Application submitted for scholarship: " + id);
        // Inertia.post(`/youth/scholarships/apply/${id}`);
    };

    return (
        <YouthLayout>
            <div className="space-y-10">
                <PageTitle>Scholarship Programs</PageTitle>

                <div className="grid grid-cols-1 gap-6">
                    {scholarships.map(s => (
                        <ScholarshipCard
                            key={s.id}
                            scholarship={s}
                            onApply={apply}
                        />
                    ))}
                </div>
            </div>
        </YouthLayout>
    );
}
