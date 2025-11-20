import YouthLayout from "./youthlist";
import ProjectCard from "./ProjectCard";
import PageTitle from "./PageTitle";
import { Inertia } from "@inertiajs/inertia";

interface Project {
    id: number;
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    participants_count: number;
    status: "planned" | "ongoing" | "completed" | "cancelled";
    attendance_status: "not_registered" | "registered" | "attended" | "absent";
}

interface Props {
    projects: Project[];
}

export default function Projects({ projects }: Props) {

    const register = (projectId: number) => {
        Inertia.post(`/youth/projects/register/${projectId}`, {}, {
            onSuccess: () => alert("Successfully registered!")
        });
    };

    return (
        <YouthLayout>
            <div className="space-y-10">
                <PageTitle>Available Projects</PageTitle>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onRegister={register}
                        />
                    ))}
                </div>
            </div>
        </YouthLayout>
    );
}
