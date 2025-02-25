import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";

export default function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("User signed in successfully");
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen p-4 bg-background", className)} {...props}>
      <Card className="w-full max-w-md shadow-lg rounded-lg border border-border p-6">
        <CardContent className="flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold text-center">Welcome back</h1>
          <p className="text-muted-foreground text-center">Login to your Acme Inc account</p>
          <Button onClick={handleGoogleSignIn} className="w-full bg-white text-black border border-gray-300 shadow-md flex items-center justify-center gap-2 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
              <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs mt-4">
        By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
      </div>
    </div>
  );
}
