import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Welcome to GoAbroad
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in with your @goabroad.com email to access the prototype
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <SignIn
                        path="/sign-in"
                        routing="path"
                        signUpUrl="/sign-up"
                        forceRedirectUrl="/"
                    />
                </div>
            </div>
        </div>
    );
}
