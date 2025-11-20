import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Head, Form } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { register } from '@/routes';
import { request } from '@/routes/password';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <>
            <Head title="Log in" />

            {/* Background with faded logo wallpaper */}
            <div
                className="relative flex min-h-screen items-center justify-center px-4"
                style={{
                    backgroundImage: "url('/images/logo.png')", // 👈 replace with your logo path
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    opacity: 0.95,
                }}
            >
                {/* Overlay for fading effect */}
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

                {/* Login Card */}
                <Card className="relative z-10 w-full max-w-md rounded-2xl shadow-xl bg-white/90 backdrop-blur-md">
                    <CardHeader className="space-y-2 text-center">
                        <img
                            src="/images/logo.png" // 👈 small logo at top
                            alt="Logo"
                            className="mx-auto h-30 w-30"
                        />
                        <CardTitle className="text-3xl font-bold">Barangay System Portal</CardTitle>
                        <CardDescription className="text-l">Official Registration and Services Portal</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form
                            {...AuthenticatedSessionController.store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-4">
                                        {/* Email */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password */}
                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password">Password</Label>
                                                {canResetPassword && (
                                                    <TextLink href={request()} className="text-sm">
                                                        Forgot password?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="remember" name="remember" />
                                            <Label htmlFor="remember">Remember me</Label>
                                        </div>

                                        {/* Submit */}
                                        <Button type="submit" className="w-full" disabled={processing}>
                                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                            Log in
                                        </Button>
                                    </div>

                                    {/* Status Message */}
                                    {status && (
                                        <div className="mt-2 text-center text-sm font-medium text-green-600">
                                            {status}
                                        </div>
                                    )}

                                    {/* Sign up */}
                                    {/* <div className="mt-6 text-center text-sm text-muted-foreground">
                                        Don’t have an account?{' '}
                                        <TextLink href={register()} className="font-medium">
                                            Sign up
                                        </TextLink>
                                    </div> */}
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
