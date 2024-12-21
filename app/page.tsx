import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <section className="w-full max-w-5xl text-center space-y-8 mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Book Club
        </h1>
        <p className="text-xl text-muted-foreground">
          Lorem ipsum dolor sit amet.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/sign-up">
            <Button variant="outline" size="lg">
              Registreeru
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg">Logi sisse</Button>
          </Link>
        </div>
      </section>

      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          title="Lorem ipsum dolor sit amet.

"
          description="Lorem ipsum dolor sit amet.

"
          icon="📚"
        />
        <FeatureCard
          title="Lorem ipsum dolor sit amet.

"
          description="Lorem ipsum dolor sit amet.

"
          icon="👥"
        />
        <FeatureCard
          title="Lorem ipsum dolor sit amet.

"
          description="Lorem ipsum dolor sit amet.

"
          icon="💡"
        />
      </section>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="p-6 border rounded-lg space-y-3">
      <div className="text-4xl">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
