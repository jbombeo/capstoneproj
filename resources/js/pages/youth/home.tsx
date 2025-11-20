import YouthLayout from "./youthlist";
import AnnouncementCard from "./AnnouncementCard";
import PageTitle from "./PageTitle";

interface Announcement {
    id: number;
    title: string;
    content: string;
    date: string;
    time: string;
    author: string;
    image_path?: string;
    category?: string;
}

interface Youth {
    first_name?: string;
}

interface Props {
    announcements: Announcement[];
    youth: Youth | null;
}

export default function Home({ announcements, youth }: Props) {
    return (
        <YouthLayout>
            <div className="space-y-10">

                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white">
                    <p className="text-white/70 text-sm mb-2">Youth Member Portal</p>

                    <h1 className="text-3xl font-bold">
                        Welcome back, {youth?.first_name ?? "Youth"}!
                    </h1>

                    <p className="text-blue-100 mt-2">
                        Stay updated with the latest announcements and activities.
                    </p>
                </div>

                <PageTitle>Latest Announcements</PageTitle>

                <div className="space-y-6">
                    {announcements.map(a => (
                        <AnnouncementCard key={a.id} a={a} />
                    ))}
                </div>
            </div>
        </YouthLayout>
    );
}
