type Status = "done" | "in-progress" | "todo";

type ListItem = {
  status: Status;
  text: string;
};

type Section = {
  title: string;
  items: ListItem[];
};

const CHECKBOX_REGEX = /^[-*]\s+\[(x|X|~| )\]\s?(.*)$/;

function parseBucketList(markdown: string): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    const heading = /^#{1,3}\s+(.*)$/.exec(trimmed);
    if (heading) {
      current = { title: heading[1], items: [] };
      sections.push(current);
      continue;
    }

    const checkbox = CHECKBOX_REGEX.exec(trimmed);
    if (checkbox && current) {
      const status: Status =
        checkbox[1].toLowerCase() === "x"
          ? "done"
          : checkbox[1] === "~"
            ? "in-progress"
            : "todo";
      current.items.push({ status, text: checkbox[2].trim() });
    }
  }

  return sections;
}

function Checkbox({ status }: { status: Status }) {
  if (status === "done") {
    return (
      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center border border-black bg-black text-[10px] leading-none text-white">
        ✓
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center border border-black text-[10px] leading-none">
        ~
      </span>
    );
  }
  return (
    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center border border-black" />
  );
}

export default function BucketList({ content }: { content: string }) {
  const sections = parseBucketList(content);

  return (
    <main className="min-h-screen w-full bg-[#dfd6cc] text-black">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <div className="bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-10">
          <header className="mb-10 flex flex-wrap items-baseline justify-between gap-4 border-b border-black pb-6">
            <h1 className="font-title text-2xl font-bold sm:text-3xl">
              Bucket List
            </h1>
            <p className="font-body text-xs">
              things I want to do before I&apos;m done
            </p>
          </header>

          {sections.map((section) => (
            <section
              key={section.title}
              className={section.title !== sections[sections.length - 1].title ? "mb-10" : ""}
            >
              <h2 className="mb-5 font-title text-lg font-bold sm:text-xl">
                {section.title}{" "}
                <span className="inline-flex items-center justify-center border border-black px-2 py-0.5 text-xs">
                  {section.items.length}
                </span>
              </h2>
              <ul className="columns-1 gap-x-10 md:columns-2">
                {section.items.map((item) => (
                  <li
                    key={item.text}
                    className="mb-3 flex items-start gap-3 break-inside-avoid font-body text-xs leading-relaxed sm:text-sm"
                  >
                    <Checkbox status={item.status} />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
