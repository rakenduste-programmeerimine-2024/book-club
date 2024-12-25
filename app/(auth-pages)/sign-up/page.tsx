import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <form className="flex flex-col w-full max-w-md p-6 bg-card rounded-md shadow-lg">
        <h1 className="text-2xl font-medium mb-4 text-center text-card-foreground">
          Registreeru
        </h1>
        <p className="text-sm text-center text-muted-foreground mb-6">
          Konto juba olemas?{" "}
          <Link
            className="text-primary font-medium underline hover:text-primary-foreground"
            href="/sign-in"
          >
            Logi sisse
          </Link>
        </p>
        <div className="flex flex-col gap-4">
          <Label htmlFor="email" className="text-card-foreground">
            Email
          </Label>
          <Input name="email" placeholder="teie@email.com" required />
          <Label htmlFor="password" className="text-card-foreground">
            Salasõna
          </Label>
          <Input
            type="password"
            name="password"
            placeholder="Teie Salasõna"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Registreeru
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
