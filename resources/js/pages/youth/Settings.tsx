import YouthLayout from "./youthlist";
import PageTitle from "./PageTitle";
import ProfileField from "./ProfileField";
import Button from "./base/button";
import InputField from "./base/InputField";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

interface Youth {
    first_name?: string;
    last_name?: string;
    email?: string;
    contact_number?: string;
    birth_date?: string;
}

interface Props {
    youth: Youth;
}

export default function Settings({ youth }: Props) {

    const { data, setData, post, processing, errors } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e: any) => {
        e.preventDefault();

        post("/youth/settings/update-password", {
            onSuccess: () => {
                toast.success("Password updated successfully!");
            },
            onError: () => {
                toast.error("Failed to update password.");
            }
        });
    };

    // Format birth date (Month Day, Year)
    const formattedBirthDate = youth.birth_date
        ? new Date(youth.birth_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "N/A";

    return (
        <YouthLayout>
            <div className="space-y-10">
                <PageTitle>Account Settings</PageTitle>

                {/* Profile Info */}
                <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProfileField label="First Name" value={youth.first_name} />
                        <ProfileField label="Last Name" value={youth.last_name} />
                        <ProfileField label="Email" value={youth.email} />
                        <ProfileField label="Contact Number" value={youth.contact_number} />
                        <ProfileField label="Birth Date" value={formattedBirthDate} />
                    </div>
                </div>

                {/* Password Change */}
                <form onSubmit={submit} className="bg-white shadow-md rounded-xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">Change Password</h2>

                    <div className="space-y-4">

                        <div>
                            <InputField
                                label="Current Password"
                                type="password"
                                value={data.current_password}
                                onChange={(e: any) => setData("current_password", e.target.value)}
                            />
                            {errors.current_password && (
                                <p className="text-red-600 text-sm">{errors.current_password}</p>
                            )}
                        </div>

                        <div>
                            <InputField
                                label="New Password"
                                type="password"
                                value={data.password}
                                onChange={(e: any) => setData("password", e.target.value)}
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <InputField
                                label="Confirm New Password"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e: any) =>
                                    setData("password_confirmation", e.target.value)
                                }
                            />
                        </div>

                        <Button
                            label={processing ? "Updating..." : "Update Password"}
                            variant="primary"
                            full
                            disabled={processing}
                        />
                    </div>
                </form>
            </div>
        </YouthLayout>
    );
}
