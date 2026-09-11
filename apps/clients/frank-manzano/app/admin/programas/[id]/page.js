import Link from "next/link";
import { notFound } from "next/navigation";
import ProgramEditor from "@/components/admin/ProgramEditor";
import { getAdminProgram, getBookFilters, getExerciseBook } from "@/libs/training";

export const dynamic = "force-dynamic";

export default async function ProgramEditorPage({ params }) {
  const { id } = await params;

  const [program, book, filters] = await Promise.all([
    getAdminProgram(id),
    getExerciseBook(),
    getBookFilters(),
  ]);

  if (!program) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/programas"
          className="text-sm font-medium text-base-content/50 hover:text-primary"
        >
          ← Todos los planes
        </Link>
        <h1 className="display mt-3 text-4xl text-base-content sm:text-5xl">
          {program.title}
        </h1>
      </div>

      <ProgramEditor program={program} book={book} filters={filters} />
    </div>
  );
}
