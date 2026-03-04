import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-20 pointer-events-none">
                <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-cobalt-200 to-cobalt-400 blur-3xl mix-blend-multiply" />
            </div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 opacity-20 pointer-events-none">
                <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-sun-200 to-roman-300 blur-3xl mix-blend-multiply" />
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Create an Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign up with your @goabroad.com email to access the prototype
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <SignUp
                        path="/sign-up"
                        routing="path"
                        signInUrl="/sign-in"
                    />
                </div>
            </div>
        </div>
    );
}
