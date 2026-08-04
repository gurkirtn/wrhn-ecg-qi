import EcgQiApp from "../../../components/EcgQiApp";

export default async function CasePage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  return <EcgQiApp initialPath={`/cases/${caseId}`} />;
}
