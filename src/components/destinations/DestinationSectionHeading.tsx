import styles from "@/components/blog/blog.module.css";

export function DestinationSectionHeading({
  id,
  eyebrow,
  title,
}: {
  id: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      {eyebrow ? (
        <p className={`mb-2 text-xs font-semibold uppercase tracking-[.14em] ${styles.accent}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="font-serif text-3xl font-medium leading-tight sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
