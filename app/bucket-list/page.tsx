import fs from "fs";
import path from "path";
import BucketList from "../../components/BucketList";

export const metadata = {
  title: "Bucket List",
  description:
    "Things I want to do before I'm done - completed, in progress, and not started.",
};

export default function BucketListPage() {
  const content = fs.readFileSync(
    path.join(process.cwd(), "content/bucket-list.md"),
    "utf8",
  );

  return <BucketList content={content} />;
}
